import { Board } from '../models/board';

export class HistoryMove {
    move: string;
    piece: string;
    color: string;
    x: boolean;
    board: Board;

    constructor(move: string, piece: string, color: string, captured: boolean) {
        this.move = move;
        this.piece = piece;
        this.color = color;
        this.x = captured;
    }
}
