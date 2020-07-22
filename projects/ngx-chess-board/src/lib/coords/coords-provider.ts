export class CoordsProvider {

  private _xCoords: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  private _yCoords: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

  reverse() {
    this._xCoords = this._xCoords.reverse();
    this._yCoords = this._yCoords.reverse();
  }

  get xCoords(): string[] {
    return this._xCoords;
  }

  get yCoords(): number[] {
    return this._yCoords;
  }

  reset() {
    this.init();
  }

  private init() {
    this._xCoords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    this._yCoords = [8, 7, 6, 5, 4, 3, 2, 1];
  }
}
