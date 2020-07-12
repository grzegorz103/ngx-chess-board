import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {NgxChessBoardComponent} from '../../ngx-chess-board.component';
import {Board} from '../board';

export class Pawn extends Piece {

  isMovedAlready = false;

  constructor(point: Point, color: Color, image: string) {
    super(point, color, image, 1);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];
    let row = this.point.row;
    let col = this.point.col;
    if (this.color === Color.WHITE) {
      if (NgxChessBoardComponent.isFieldEmpty(row - 1, col)) {
        possiblePoints.push(new Point(row - 1, col));

        if (!this.isMovedAlready && NgxChessBoardComponent.isFieldEmpty(row - 2, col)) {
          possiblePoints.push(new Point(row - 2, col));
        }
      }
    } else {
      if (/*!NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ NgxChessBoardComponent.isFieldEmpty(row + 1, col)) {
        possiblePoints.push(new Point(row + 1, col));

        if (!this.isMovedAlready && NgxChessBoardComponent.isFieldEmpty(row + 2, col)) {
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
      if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col - 1, Color.BLACK)) {
        possiblePoints.push(new Point(row - 1, col - 1));
      }
      if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col + 1, Color.BLACK)) {
        possiblePoints.push(new Point(row - 1, col + 1));
      }
    } else {
      if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col - 1, Color.WHITE)) {
        possiblePoints.push(new Point(row + 1, col - 1));
      }
      if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col + 1, Color.WHITE)) {
        possiblePoints.push(new Point(row + 1, col + 1));
      }
    }

    if (Board.enPassantPoint && Board.enPassantPiece.color === (this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      if (row === Board.enPassantPiece.point.row) {
        possiblePoints.push(Board.enPassantPoint);
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
