import {BoardState} from './board-state';

export class BoardStateProvider {

  moves: BoardState[];

  constructor() {
    this.moves = [];
  }

  addMove(moveHistory: BoardState) {
    this.moves.push(moveHistory);
  }

  getMoves() {
    return this.moves;
  }

  pop() {
    return this.moves.pop();
  }

  isEmpty() {
    return this.moves.length === 0;
  }

}
