import { Board } from '../../../models/board';

export class BoardState {

    board: Board;

    constructor(board: Board) {
        this.board = board;
    }

}
