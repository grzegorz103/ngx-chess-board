import {PieceAbstractDecorator} from './piece-abstract-decorator';
import {Point} from '../models/pieces/point';
import {AbstractPiece} from './abstract-piece';
import {MoveUtils} from '../utils/move-utils';
import {Color} from '../models/pieces/color';
import {NgxChessBoardComponent} from '../ngx-chess-board.component';

export class AvailableMoveFilter extends PieceAbstractDecorator {

  private pointClicked: Point;
  private color: Color;
  private component: NgxChessBoardComponent;

  constructor(piece: AbstractPiece, pointClicked: Point, color: Color,component:NgxChessBoardComponent) {
    super(piece);
    this.pointClicked = pointClicked;
    this.color = color;
    this.component = component;
  }

  getPossibleCaptures(): Point[] {
    return this.piece.getPossibleCaptures()
      .filter(point => !MoveUtils.willMoveCauseCheck(this.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col,this.component));
  }

  getPossibleMoves(): Point[] {
    return this.piece.getPossibleMoves()
      .filter(point => !MoveUtils.willMoveCauseCheck(this.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col,this.component));
  }
}
