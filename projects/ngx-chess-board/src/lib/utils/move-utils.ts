import {Color} from '../models/pieces/color';
import {Board} from '../models/board';
import {NgxChessBoardComponent} from '../ngx-chess-board.component';

export class MoveUtils {

  public static willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number, ngxChessBoardComponent: NgxChessBoardComponent) {
    let srcPiece = ngxChessBoardComponent.getPieceByField(row, col);
    let destPiece = ngxChessBoardComponent.getPieceByField(destRow, destCol);

    if (srcPiece) {
      srcPiece.point.row = destRow;
      srcPiece.point.col = destCol;
    }

    if (destPiece) {
      ngxChessBoardComponent.board.pieces = ngxChessBoardComponent.board.pieces.filter(e => e !== destPiece);
    }
    let isBound = ngxChessBoardComponent.isKingInCheck(currentColor, ngxChessBoardComponent.board.pieces);

    if (srcPiece) {
      srcPiece.point.col = col;
      srcPiece.point.row = row;
    }

    if (destPiece) {
      ngxChessBoardComponent.board.pieces.push(destPiece);
    }

    return isBound;
  }

}
