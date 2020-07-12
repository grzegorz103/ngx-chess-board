import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {NgxChessBoardComponent} from '../../ngx-chess-board.component';
import {Board} from '../board';

export class Pawn extends Piece {

  isMovedAlready = false;

    constructor(point: Point, color: Color, image: string, ngxChessBoardComponent: NgxChessBoardComponent) {
    super(point, color, image, 1, ngxChessBoardComponent);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];
    let row = this.point.row;
    let col = this.point.col;
    if (this.color === Color.WHITE) {
      if (this.ngxChessBoardComponent.isFieldEmpty(row - 1, col)) {
        possiblePoints.push(new Point(row - 1, col));

        if (!this.isMovedAlready && this.ngxChessBoardComponent.isFieldEmpty(row - 2, col)) {
          possiblePoints.push(new Point(row - 2, col));
        }
      }
    } else {
      if (/*!NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ this.ngxChessBoardComponent.isFieldEmpty(row + 1, col)) {
        possiblePoints.push(new Point(row + 1, col));

        if (!this.isMovedAlready && this.ngxChessBoardComponent.isFieldEmpty(row + 2, col)) {
          possiblePoints.push(new Point(row + 2, col));
        }
      }
    }
    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];
    let row = this.point.row;
    let col = this.point.col;
    if (this.color === Color.WHITE) {
      if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col - 1, Color.BLACK)) {
        possiblePoints.push(new Point(row - 1, col - 1));
      }
      if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col + 1, Color.BLACK)) {
        possiblePoints.push(new Point(row - 1, col + 1));
      }
    } else {
      if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col - 1, Color.WHITE)) {
        possiblePoints.push(new Point(row + 1, col - 1));
      }
      if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col + 1, Color.WHITE)) {
        possiblePoints.push(new Point(row + 1, col + 1));
      }
    }

    if (this.ngxChessBoardComponent.board.enPassantPoint && this.ngxChessBoardComponent.board.enPassantPiece.color === (this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      if (row === this.ngxChessBoardComponent.board.enPassantPiece.point.row) {
        possiblePoints.push(this.ngxChessBoardComponent.board.enPassantPoint);
      }
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];
    let row = this.point.row;
    let col = this.point.col;

    if (this.color === Color.WHITE) {

      possiblePoints.push(new Point(row - 1, col - 1));

      possiblePoints.push(new Point(row - 1, col + 1));
    } else {
      possiblePoints.push(new Point(row + 1, col - 1));

      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }

}
