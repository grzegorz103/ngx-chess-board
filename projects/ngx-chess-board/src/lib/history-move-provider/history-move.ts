export class HistoryMove {
    move: string;
    piece: string;
    color: string;
    x: boolean;
    check: boolean;
    stalemate: boolean;
    mate: boolean;

    constructor(move: string, piece: string, color: string, captured: boolean) {
        this.move = move;
        this.piece = piece;
        this.color = color;
        this.x = captured;
    }

    setGameStates(check: boolean, stalemate: boolean, mate: boolean): void {
        this.check = check;
        this.stalemate = stalemate;
        this.mate = mate;
    }

}
