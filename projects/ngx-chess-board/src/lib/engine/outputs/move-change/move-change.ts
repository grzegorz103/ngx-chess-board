import { Color } from '../../../models/pieces/color';
import { Piece } from '../../../models/pieces/piece';

export interface MoveChange {
    move: string;
    piece: Piece;
    color: Color;
    x: boolean;
    premove: boolean;
    check: boolean;
    stalemate: boolean;
    checkmate: boolean;
    fen: string;
    pgn: string;
    freeMode: boolean;
    insufficientMaterial: boolean;
    notation: string;
}
