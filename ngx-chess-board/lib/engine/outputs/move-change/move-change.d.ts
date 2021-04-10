import { PgnOutput } from './pgn-output';
export interface MoveChange {
    check: boolean;
    stalemate: boolean;
    checkmate: boolean;
    fen: string;
    pgn: PgnOutput;
    freeMode: boolean;
}
