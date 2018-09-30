import Penguin, { PenguinStatus } from './penguin';

const WEBSOCKET_SERVER_URL = 'ws://localhost:8000/ws';

type Message =
  | {
      type: 'REGISTER';
      id: string;
    }
  | {
      type: 'UPDATE';
      id: string;
    } & PenguinStatus
  | {
      type: 'REMOVE';
      id: string;
    };

export default function setup(penguin: Penguin) {
  if (!window['WebSocket']) {
    // TODO: toastかなんかで伝える
    return;
  }

  let ownId = '';
  const penguins: { [id: string]: Penguin } = {};
  const conn = new WebSocket(WEBSOCKET_SERVER_URL);

  conn.onclose = function(_e) {
    // TODO: toastかなんかで伝える
  };
  conn.onmessage = function(e) {
    const messages: Message[] = JSON.parse(e.data);
    messages.forEach(message => {
      switch (message.type) {
        case 'REGISTER':
          ownId = message.id;
          break;
        case 'UPDATE':
          const { id, x, y, scale, direction } = message;
          if (id === ownId || id === '') return;
          if (penguins[id]) {
            penguins[id].update({ x, y, scale, direction });
          } else {
            const penguin = new Penguin();
            penguins[id] = penguin;
            penguin.joinStage();
            penguin.update({ x, y, scale, direction });
          }
          break;
        case 'REMOVE':
          const penguin = penguins[message.id];
          if (penguin == null) return;
          penguin.leaveStage();
          penguins[id] = null;
          break;
      }
    });
  };

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ArrowDown':
        conn.send(
          JSON.stringify({
            ...penguin.status,
            type: 'UPDATE',
            id: ownId,
          })
        );
    }
  });
}
