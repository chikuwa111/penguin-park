import Penguin, { PenguinStatus, Textures } from './penguin';

const WEBSOCKET_SERVER_HOST = 'localhost:8000';

type Message = Array<PenguinStatus>;

export default function setup(ignoreId: string) {
  if (!window['WebSocket']) {
    // TODO: toastかなんかで伝える
    return null;
  }
  const penguins: { [id: string]: Penguin } = {};
  const conn = new WebSocket('ws://' + WEBSOCKET_SERVER_HOST + '/ws');
  conn.onclose = function(_e) {
    // TODO: toastかなんかで伝える
  };
  conn.onmessage = function(e) {
    const message: Message = JSON.parse(e.data);
    message.forEach(penguinStatus => {
      if (penguinStatus.id === ignoreId) return;
      if (penguins[penguinStatus.id]) {
        penguins[penguinStatus.id].update(penguinStatus);
      } else {
        const penguin = new Penguin();
        penguins[penguinStatus.id] = penguin;
        penguin.addToStage();
        penguin.update(penguinStatus);
      }
    });
  };

  return conn;
}
