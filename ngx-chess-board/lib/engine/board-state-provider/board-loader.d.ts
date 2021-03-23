import { Board } from '../../models/board';
export declare class BoardLoader {
    private board;
    constructor(board: Board);
    addPieces(): void;
    loadFEN(fen: string): void;
    setBoard(board: Board): void;
    private setCurrentPlayer;
    private setCastles;
    private setFullMoveCount;
    private setEnPassant;
    private setRookAlreadyMoved;
}
