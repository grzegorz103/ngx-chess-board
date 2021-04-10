import { Board } from '../models/board';
import { Bishop } from '../models/pieces/bishop';
import { Color } from '../models/pieces/color';
import { King } from '../models/pieces/king';
import { Knight } from '../models/pieces/knight';
import { Pawn } from '../models/pieces/pawn';
import { Piece } from '../models/pieces/piece';
import { Point } from '../models/pieces/point';
import { MoveTranslation } from '../models/move-translation';
import { Queen } from '../models/pieces/queen';
import { Rook } from '../models/pieces/rook';

export class MoveUtils {
    public static willMoveCauseCheck(
        currentColor: Color,
        row: number,
        col: number,
        destRow: number,
        destCol: number,
        board: Board
    ) {
        const srcPiece = board.getPieceByField(row, col);
        const destPiece = board.getPieceByField(destRow, destCol);

        if (srcPiece) {
            srcPiece.point.row = destRow;
            srcPiece.point.col = destCol;
        }

        if (destPiece) {
            board.pieces = board.pieces.filter((piece) => piece !== destPiece);
        }
        const isBound = board.isKingInCheck(currentColor, board.pieces);

        if (srcPiece) {
            srcPiece.point.col = col;
            srcPiece.point.row = row;
        }

        if (destPiece) {
            board.pieces.push(destPiece);
        }

        return isBound;
    }

    public static format(
        sourcePoint: Point,
        destPoint: Point,
        reverted: boolean
    ) {
        if (reverted) {
            const sourceX = 104 - sourcePoint.col;
            const destX = 104 - destPoint.col;
            return (
                String.fromCharCode(sourceX) +
                (sourcePoint.row + 1) +
                String.fromCharCode(destX) +
                (destPoint.row + 1)
            );
        } else {
            const incrementX = 97;
            return (
                String.fromCharCode(sourcePoint.col + incrementX) +
                (Math.abs(sourcePoint.row - 7) + 1) +
                String.fromCharCode(destPoint.col + incrementX) +
                (Math.abs(destPoint.row - 7) + 1)
            );
        }
    }

    public static translateCoordsToIndex(coords: string, reverted: boolean) {
        let xAxis: number;
        let yAxis: number;
        if (reverted) {
            xAxis = 104 - coords.charCodeAt(0);
            yAxis = +coords.charAt(1) - 1;
        } else {
            xAxis = coords.charCodeAt(0) - 97;
            yAxis = Math.abs(+coords.charAt(1) - 8);
        }

        return new MoveTranslation(xAxis, yAxis, reverted);
    }

    public static findPieceByPossibleMovesContaining(
        coords: string,
        board: Board,
        color: Color
    ): Piece[] {
        let indexes = this.translateCoordsToIndex(coords, board.reverted);
        let destPoint = new Point(indexes.yAxis, indexes.xAxis);
        let foundPieces = [];

        for (let piece of board.pieces.filter(piece => piece.color === color)) {
            for (let point of piece.getPossibleMoves()) {
                if (!MoveUtils.willMoveCauseCheck(
                    piece.color,
                    piece.point.row,
                    piece.point.col,
                    indexes.yAxis,
                    indexes.xAxis,
                    board
                ) && point.isEqual(destPoint)) {
                    foundPieces.push(piece);
                }
            }
        }
        return foundPieces;
    }

    public static findPieceByPossibleCapturesContaining(
        coords: string,
        board: Board,
        color: Color
    ): Piece[] {
        let indexes = this.translateCoordsToIndex(coords, board.reverted);
        let destPoint = new Point(indexes.yAxis, indexes.xAxis);
        let foundPieces = [];
        for (let piece of board.pieces.filter(piece => piece.color === color)) {
            for (let point of piece.getPossibleCaptures()) {
                if (!MoveUtils.willMoveCauseCheck(
                    piece.color,
                    piece.point.row,
                    piece.point.col,
                    indexes.yAxis,
                    indexes.xAxis,
                    board
                ) && point.isEqual(destPoint)) {
                    foundPieces.push(piece);
                }
            }
        }

        return foundPieces;
    }

    public static formatSingle(point: Point, reverted: boolean): string {
        if (reverted) {
            const sourceX = 104 - point.col;
            return (
                String.fromCharCode(sourceX) +
                (point.row + 1)
            );
        } else {
            const incrementX = 97;
            return (
                String.fromCharCode(point.col + incrementX) +
                (Math.abs(point.row - 7) + 1)
            );
        }
    }

    public static getFirstLetterPiece(piece: Piece): string {
        if (piece instanceof Pawn) {
            return 'P';
        } else {
            if (piece instanceof Knight) {
                return 'N';
            } else {
                if (piece instanceof Bishop) {
                    return 'B';
                } else {
                    if (piece instanceof Rook) {
                        return 'R';
                    } else {
                        if (piece instanceof King) {
                            return 'K';
                        } else {
                            if (piece instanceof Queen) {
                                return 'Q';
                            }
                        }
                    }
                }
            }
        }

        return '';
    }

    static reverse(board: Board, row: number) {
        return board.reverted
            ? row + 1
            : Math.abs(row - 7) + 1;
    }

    static formatCol(board: Board, col: number): string {
        return board.reverted
            ? String.fromCharCode(104 - col)
            : String.fromCharCode(97 + col);
    }
}
