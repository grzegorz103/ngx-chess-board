import {Color} from '../models/pieces/color';
import {Board} from '../models/board';
import {Point} from '../models/pieces/point';

export class MoveUtils {

  public static willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number, board: Board) {
    let srcPiece = board.getPieceByField(row, col);
    let destPiece = board.getPieceByField(destRow, destCol);

    if (srcPiece) {
      srcPiece.point.row = destRow;
      srcPiece.point.col = destCol;
    }

    if (destPiece) {
      board.pieces = board.pieces.filter(e => e !== destPiece);
    }
    let isBound = board.isKingInCheck(currentColor, board.pieces);

    if (srcPiece) {
      srcPiece.point.col = col;
      srcPiece.point.row = row;
    }

    if (destPiece) {
      board.pieces.push(destPiece);
    }

    return isBound;
  }

  public static format(sourcePoint: Point, destPoint: Point, reverted: boolean) {
    if (reverted) {
      let sourceX = 104 - sourcePoint.col;
      let destX = 104 - destPoint.col;
      return String.fromCharCode(sourceX) + (sourcePoint.row + 1)
        + String.fromCharCode(destX) + (destPoint.row + 1);
    } else {
      let incrementX = 97;
      return String.fromCharCode(sourcePoint.col + incrementX) + (Math.abs(sourcePoint.row - 7) + 1)
        + String.fromCharCode(destPoint.col + incrementX) + (Math.abs(destPoint.row - 7) + 1);
    }
  }

}
