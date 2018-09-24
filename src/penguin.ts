const nanoid = require('nanoid');

export interface Textures {
  left: PIXI.Texture[];
  right: PIXI.Texture[];
  up: PIXI.Texture[];
  down: PIXI.Texture[];
}
type Direction = 'left' | 'up' | 'right' | 'down';
export interface PenguinStatus {
  id: string;
  x: number;
  y: number;
  scale: number;
  direction: Direction;
}
export default class Penguin {
  static stage: PIXI.Container;
  static textures: Textures;

  public uuid: string;
  private sprite: PIXI.extras.AnimatedSprite;
  private direction: Direction;

  static init(stage: PIXI.Container, textures: Textures) {
    Penguin.stage = stage;
    Penguin.textures = textures;
  }

  constructor() {
    this.sprite = new PIXI.extras.AnimatedSprite(Penguin.textures.down);
    this.direction = 'down';
    this.uuid = nanoid();
  }

  addToStage() {
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();

    this.sprite.anchor.set(0.5);
    this.sprite.position.set(640 / 2, 360 / 2);

    Penguin.stage.addChild(this.sprite);
  }

  removeFromStage() {
    Penguin.stage.removeChild(this.sprite);
  }

  update({ x, y, scale, direction }: PenguinStatus) {
    if (this.direction !== direction) {
      this.direction = direction;
      this.sprite.textures = Penguin.textures[direction];
      this.sprite.play();
    }
    this.sprite.position.set(x, y);
    this.sprite.scale.set(scale, scale);
  }

  moveLeft() {
    if (this.direction !== 'left') {
      this.direction = 'left';
      this.sprite.textures = Penguin.textures.left;
      this.sprite.play();
    }
    this.sprite.position.x -= 16;
  }

  moveRight() {
    if (this.direction !== 'right') {
      this.direction = 'right';
      this.sprite.textures = Penguin.textures.right;
      this.sprite.play();
    }
    this.sprite.position.x += 16;
  }

  moveUp() {
    if (this.direction !== 'up') {
      this.direction = 'up';
      this.sprite.textures = Penguin.textures.up;
      this.sprite.play();
    }
    this.sprite.position.y -= 16;
    this.sprite.scale.x /= 1.25;
    this.sprite.scale.y /= 1.25;
  }

  moveDown() {
    if (this.direction !== 'down') {
      this.direction = 'down';
      this.sprite.textures = Penguin.textures.down;
      this.sprite.play();
    }
    this.sprite.position.y += 16;
    this.sprite.scale.x *= 1.25;
    this.sprite.scale.y *= 1.25;
  }

  addKeyboardControl() {
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        default:
      }
    });
  }

  setWS(conn: WebSocket) {
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowRight':
        case 'ArrowDown':
          conn.send(
            JSON.stringify({
              id: this.uuid,
              x: this.sprite.position.x,
              y: this.sprite.position.y,
              scale: this.sprite.scale.x,
              direction: this.direction,
            })
          );
      }
    });
  }
}
