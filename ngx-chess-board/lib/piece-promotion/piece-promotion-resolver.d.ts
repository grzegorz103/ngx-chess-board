import { Board } from '../models/board';
import { Piece } from '../models/pieces/piece';
export declare class PiecePromotionResolver {
    static resolvePromotionChoice(board: Board, piece: Piece, index: number): void;
}
