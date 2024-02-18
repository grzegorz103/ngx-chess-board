import { Board } from '../models/board';
import { Bishop } from '../models/pieces/bishop';
import { Color } from '../models/pieces/color';
import { Knight } from '../models/pieces/knight';
import { Piece } from '../models/pieces/piece';
import { Queen } from '../models/pieces/queen';
import { Rook } from '../models/pieces/rook';
import { UnicodeConstants } from '../utils/unicode-constants';

export class PiecePromotionResolver {

    static resolvePromotionChoice(board: Board, piece: Piece, letter: string) {
        const isWhite = piece.color === Color.WHITE;
        switch (letter) {
            case "q":
                board.pieces.push(
                    new Queen(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_QUEEN
                            : UnicodeConstants.BLACK_QUEEN,
                        board
                    )
                );
                break;
            case "r":
                board.pieces.push(
                    new Rook(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_ROOK
                            : UnicodeConstants.BLACK_ROOK,
                        board
                    )
                );
                break;
            case "b":
                board.pieces.push(
                    new Bishop(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_BISHOP
                            : UnicodeConstants.BLACK_BISHOP,
                        board
                    )
                );
                break;
            case "n":
                board.pieces.push(
                    new Knight(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_KNIGHT
                            : UnicodeConstants.BLACK_KNIGHT,
                        board
                    )
                );
                break;
        }
    }

}
