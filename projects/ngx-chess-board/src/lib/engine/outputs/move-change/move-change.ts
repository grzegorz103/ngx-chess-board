import { Color } from '../../../models/pieces/color';
import { Piece } from '../../../models/pieces/piece';
import { PgnOutput } from './pgn-output';

export interface MoveChange {
    move: string;
    piece: Piece;
    color: Color;
    x: boolean;
    mate: boolean;
    premove: boolean;
    check: boolean;
    stalemate: boolean;
    checkmate: boolean;
    fen: string;
    pgn: PgnOutput;
    freeMode: boolean;
}
