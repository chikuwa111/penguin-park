const MOVE_STEP = 2;
const SCALE_STEP = 1.01;
const MAX_SCALE = 12;

type Textures = {
  left: PIXI.Texture[];
  right: PIXI.Texture[];
  up: PIXI.Texture[];
  down: PIXI.Texture[];
};
type Direction = 'left' | 'up' | 'right' | 'down';
export type PenguinStatus = {
  x: number;
  y: number;
  scale: number;
  direction: Direction;
};
export default class Penguin {
  static stage: PIXI.Container;
  static textures: Textures;

  private sprite: PIXI.extras.AnimatedSprite;
  private direction: Direction;

  static init(stage: PIXI.Container, textures: Textures) {
    Penguin.stage = stage;
    Penguin.textures = textures;
  }

  constructor() {
    this.sprite = new PIXI.extras.AnimatedSprite(Penguin.textures.down);
    this.direction = 'down';
  }

  get status(): PenguinStatus {
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    const direction = this.direction;
    return {
      x,
      y,
      scale,
      direction,
    };
  }

  joinStage() {
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();

    this.sprite.anchor.set(0.5);
    this.sprite.position.set(window.innerWidth / 2, window.innerHeight / 4);
    this.sprite.scale.set(2, 2);

    Penguin.stage.addChild(this.sprite);
  }

  leaveStage() {
    Penguin.stage.removeChild(this.sprite);
  }

  update({ x, y, scale, direction }: PenguinStatus) {
    if (this.direction !== direction) {
      this.direction = direction;
      this.sprite.textures = Penguin.textures[direction];
      this.sprite.play();
    }
    if (scale > MAX_SCALE) return;
    this.sprite.position.set(x, y);
    this.sprite.scale.set(scale, scale);
  }

  moveLeft() {
    const direction = 'left';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({
      x: x - Math.floor(MOVE_STEP * scale),
      y,
      scale,
      direction,
    });
  }

  moveRight() {
    const direction = 'right';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({
      x: x + Math.floor(MOVE_STEP * scale),
      y,
      scale,
      direction,
    });
  }

  moveUp() {
    const direction = 'up';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({ x, y: y - MOVE_STEP, scale: scale / SCALE_STEP, direction });
  }

  moveDown() {
    const direction = 'down';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({ x, y: y + MOVE_STEP, scale: scale * SCALE_STEP, direction });
  }

  addUserControl() {
    let direction: Direction = null;

    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        default:
      }
    });
    document.addEventListener('keyup', e => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowRight':
        case 'ArrowDown':
          direction = null;
          break;
        default:
      }
    });

    const directions: Array<Direction> = ['left', 'up', 'right', 'down'];
    directions.forEach(d => {
      const controller = document.getElementById(`controller-${d}`);
      ['mousedown', 'touchstart'].forEach(e => {
        controller.addEventListener(e, e => {
          e.preventDefault();
          direction = d;
        });
      });
      ['mouseup', 'touchend'].forEach(e => {
        controller.addEventListener(e, e => {
          e.preventDefault();
          direction = null;
        });
      });
    });

    const update = () => {
      switch (direction) {
        case 'left':
          this.moveLeft();
          break;
        case 'up':
          this.moveUp();
          break;
        case 'right':
          this.moveRight();
          break;
        case 'down':
          this.moveDown();
          break;
        default:
      }
      requestAnimationFrame(update);
    };
    update();
  }
}
