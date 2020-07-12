import {Color} from '../models/pieces/color';
import {Board} from '../models/board';
import {NgxChessBoardComponent} from '../ngx-chess-board.component';

export class MoveUtils {

  public static willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number) {
    let srcPiece = NgxChessBoardComponent.getPieceByField(row, col);
    let destPiece = NgxChessBoardComponent.getPieceByField(destRow, destCol);

    if (srcPiece) {
      srcPiece.point.row = destRow;
      srcPiece.point.col = destCol;
    }

    if (destPiece) {
      Board.pieces = Board.pieces.filter(e => e !== destPiece);
    }
    let isBound = NgxChessBoardComponent.isKingInCheck(currentColor, Board.pieces);

    if (srcPiece) {
      srcPiece.point.col = col;
      srcPiece.point.row = row;
    }

    if (destPiece) {
      Board.pieces.push(destPiece);
    }

    return isBound;
  }

}
