export class Point {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  isEqual(that: Point) {
    return that && this.row === that.row && this.col === that.col;
  }
}

