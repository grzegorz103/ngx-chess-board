import { Board } from '../../../../models/board';

export abstract class AbstractFenResolver {

    protected board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    public abstract resolve(fen: string): void;

}
