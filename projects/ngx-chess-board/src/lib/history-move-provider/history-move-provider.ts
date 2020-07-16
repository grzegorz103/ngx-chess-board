import {HistoryMove} from './history-move';

export class HistoryMoveProvider {

  historyMoves: HistoryMove[];

  constructor() {
    this.historyMoves = [];
  }

  addMove(historyMove: HistoryMove) {
    this.historyMoves.push(historyMove);
  }

  pop() {
    return this.historyMoves.pop();
  }

  getAll() {
    return this.historyMoves;
  }

}
