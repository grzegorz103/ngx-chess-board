export class DrawPoint {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqual(that: DrawPoint) {
    return that && that.x === this.x && this.y === that.y;
  }

}
