import {Point} from './point';
import {Color} from './color';
import {AbstractPiece} from '../../piece-decorator/abstract-piece';
import {NgxChessBoardComponent} from '../../ngx-chess-board.component';

export abstract class Piece implements AbstractPiece {
  point: Point;
  color: Color;
  image: string;
  checkPoints: Point[] = [];
  relValue: number;
  ngxChessBoardComponent: NgxChessBoardComponent;

    constructor(point: Point, color: Color, image: string, relValue: number, ngxChessBoardComponent: NgxChessBoardComponent) {
    this.color = color;
    this.image = image;
    this.point = point;
    this.relValue = relValue;
      this.ngxChessBoardComponent = ngxChessBoardComponent;
    }

  abstract getPossibleMoves(): Point[];

  abstract getPossibleCaptures(): Point[];

  abstract getCoveredFields(): Point[]; // zwraca liste punktow ktore sa puste lub istnieje na nich pionek tego samego koloru

}
