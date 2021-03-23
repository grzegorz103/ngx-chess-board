import { Board } from '../../models/board';
import { MoveTranslation } from '../../models/move-translation';
import { Bishop } from '../../models/pieces/bishop';
import { Color } from '../../models/pieces/color';
import { King } from '../../models/pieces/king';
import { Knight } from '../../models/pieces/knight';
import { Pawn } from '../../models/pieces/pawn';
import { Piece } from '../../models/pieces/piece';
import { Point } from '../../models/pieces/point';
import { Queen } from '../../models/pieces/queen';
import { Rook } from '../../models/pieces/rook';
import {
    ColorInput,
    PieceTypeInput
} from '../../utils/inputs/piece-type-input';
import { UnicodeConstants } from '../../utils/unicode-constants';

export class PieceFactory {

    static create(
        indexes: MoveTranslation,
        pieceTypeInput: PieceTypeInput,
        colorInput: ColorInput,
        board: Board
    ): Piece {
        let piece;
        let color = colorInput === ColorInput.LIGHT
            ? Color.WHITE
            : Color.BLACK;

        switch (pieceTypeInput) {
            case PieceTypeInput.QUEEN:
                piece = new Queen(
                    new Point(indexes.yAxis, indexes.xAxis),
                    color,
                    color === Color.WHITE ? UnicodeConstants.WHITE_QUEEN : UnicodeConstants.BLACK_QUEEN,
                    board
                );
                break;
            case PieceTypeInput.KING:
                piece = new King(
                    new Point(indexes.yAxis, indexes.xAxis),
                    color,
                    color === Color.WHITE ? UnicodeConstants.WHITE_KING : UnicodeConstants.BLACK_KING,
                    board
                );

                break;
            case PieceTypeInput.KNIGHT:
                piece = new Knight(
                    new Point(indexes.yAxis, indexes.xAxis),
                    color,
                    color === Color.WHITE ? UnicodeConstants.WHITE_KNIGHT : UnicodeConstants.BLACK_KNIGHT,
                    board
                );
                break;
            case PieceTypeInput.BISHOP:
                piece = new Bishop(
                    new Point(indexes.yAxis, indexes.xAxis),
                    color,
                    color === Color.WHITE ? UnicodeConstants.WHITE_BISHOP : UnicodeConstants.BLACK_BISHOP,
                    board
                );
                break;
            case PieceTypeInput.ROOK:
                piece = new Rook(
                    new Point(indexes.yAxis, indexes.xAxis),
                    color,
                    color === Color.WHITE ? UnicodeConstants.WHITE_ROOK : UnicodeConstants.BLACK_ROOK,
                    board
                );
                break;
            case PieceTypeInput.PAWN:
                piece = new Pawn(
                    new Point(indexes.yAxis, indexes.xAxis),
                    color,
                    color === Color.WHITE ? UnicodeConstants.WHITE_PAWN : UnicodeConstants.BLACK_PAWN,
                    board
                );
                break;
        }

        return piece;
    }
}
