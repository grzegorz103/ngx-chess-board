import { PgnOutput } from './pgn-output';

export interface MoveChange {
    move: string;
    piece: string;
    color: string;
    x: boolean;
    mate: boolean;

    check: boolean;
    stalemate: boolean;
    checkmate: boolean;
    fen: string;
    pgn: PgnOutput;
    freeMode: boolean;
}
