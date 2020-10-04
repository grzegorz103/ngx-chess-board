export class HistoryMove {
    move: string;
    piece: string;
    color: string;
    x: boolean;
    check: boolean;
    checkmate: boolean;
    stalemate: boolean;
    fen: string;

    constructor(
        move: string,
        piece: string,
        color: string,
        captured: boolean,
        check: boolean,
        checkmate: boolean,
        stalemate: boolean,
        fen: string
    ) {
        this.move = move;
        this.piece = piece;
        this.color = color;
        this.x = captured;
        this.check = check;
        this.stalemate = stalemate;
        this.checkmate = checkmate;
        this.fen = fen;
    }
}
