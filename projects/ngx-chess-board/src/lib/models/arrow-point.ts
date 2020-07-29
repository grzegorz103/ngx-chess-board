export class ArrowPoint {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqual(that: ArrowPoint) {
    return that && that.x === this.x && this.y === that.y;
  }

}
