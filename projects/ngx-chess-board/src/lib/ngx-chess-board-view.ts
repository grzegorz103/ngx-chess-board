export interface NgxChessBoardView {
  reset();

  reverse();

  undo();

  getMoveHistory();

  setFEN(fen: string);

  getFEN()

  move(coords: string);

}
