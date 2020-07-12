import {PieceAbstractDecorator} from './piece-abstract-decorator';
import {Point} from '../models/pieces/point';
import {AbstractPiece} from './abstract-piece';
import {MoveUtils} from '../utils/move-utils';
import {Color} from '../models/pieces/color';

export class AvailableMoveFilter extends PieceAbstractDecorator {

  private pointClicked: Point;
  private color: Color;

  constructor(piece: AbstractPiece, pointClicked: Point, color: Color) {
    super(piece);
    this.pointClicked = pointClicked;
    this.color = color;
  }

  getPossibleCaptures(): Point[] {
    return this.piece.getPossibleCaptures()
      .filter(point => !MoveUtils.willMoveCauseCheck(this.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col));
  }

  getPossibleMoves(): Point[] {
    return this.piece.getPossibleMoves()
      .filter(point => !MoveUtils.willMoveCauseCheck(this.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col));
  }
}
