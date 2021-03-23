import { Board } from '../../models/board';
import { MoveTranslation } from '../../models/move-translation';
import { Piece } from '../../models/pieces/piece';
import { ColorInput, PieceTypeInput } from '../../utils/inputs/piece-type-input';
export declare class PieceFactory {
    static create(indexes: MoveTranslation, pieceTypeInput: PieceTypeInput, colorInput: ColorInput, board: Board): Piece;
}
