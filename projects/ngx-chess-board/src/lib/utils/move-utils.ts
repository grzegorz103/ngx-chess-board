import { Board } from '../models/board';
import { Color } from '../models/pieces/color';
import { Point } from '../models/pieces/point';
import { MoveTranslation } from '../models/move-translation';

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
}
