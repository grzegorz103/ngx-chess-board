export declare class HistoryMove {
    move: string;
    piece: string;
    color: string;
    x: boolean;
    check: boolean;
    stalemate: boolean;
    mate: boolean;
    constructor(move: string, piece: string, color: string, captured: boolean);
    setGameStates(check: boolean, stalemate: boolean, mate: boolean): void;
}
