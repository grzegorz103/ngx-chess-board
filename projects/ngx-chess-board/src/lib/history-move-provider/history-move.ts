export class HistoryMove {

  move: string;
  piece: string;
  color: string;

  constructor(move: string, piece: string, color: string) {
    this.move = move;
    this.piece = piece;
    this.color = color;
  }

}
