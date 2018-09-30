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
    this.sprite.position.set(640 / 2, 360 / 2);

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
    this.sprite.position.set(x, y);
    this.sprite.scale.set(scale, scale);
  }

  moveLeft() {
    const direction = 'left';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({ x: x - 16, y, scale, direction });
  }

  moveRight() {
    const direction = 'right';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({ x: x + 16, y, scale, direction });
  }

  moveUp() {
    const direction = 'up';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({ x, y: y - 16, scale: scale / 1.25, direction });
  }

  moveDown() {
    const direction = 'down';
    const { x, y } = this.sprite.position;
    const scale = this.sprite.scale.x;
    this.update({ x, y: y + 16, scale: scale * 1.25, direction });
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
}
