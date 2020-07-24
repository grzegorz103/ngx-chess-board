import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {Board} from '../board';

export class Pawn extends Piece {

  isMovedAlready = false;

  constructor(point: Point, color: Color, image: string, board: Board) {
    super(point, color, image, 1, board);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];
    let row = this.point.row;
    let col = this.point.col;
    if ((!this.board.reverted && this.color === Color.WHITE) || (this.board.reverted && this.color === Color.BLACK)) {
      if (this.board.isFieldEmpty(row - 1, col)) {
        possiblePoints.push(new Point(row - 1, col));

        if (!this.isMovedAlready && this.board.isFieldEmpty(row - 2, col)) {
          possiblePoints.push(new Point(row - 2, col));
        }
      }
    } else {
      if (/*!board.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ this.board.isFieldEmpty(row + 1, col)) {
        possiblePoints.push(new Point(row + 1, col));

        if (!this.isMovedAlready && this.board.isFieldEmpty(row + 2, col)) {
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

    if ((!this.board.reverted && this.color === Color.WHITE) || (this.board.reverted && this.color === Color.BLACK)) {
      if (this.board.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(row - 1, col - 1));
      }
      if (this.board.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(row - 1, col + 1));
      }
    } else {
      if (this.board.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(row + 1, col - 1));
      }
      if (this.board.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(row + 1, col + 1));
      }
    }

    if (this.board.enPassantPoint && this.board.enPassantPiece.color === (this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      if (row === this.board.enPassantPiece.point.row && Math.abs(this.board.enPassantPiece.point.col - col) === 1) {
        possiblePoints.push(this.board.enPassantPoint);
      }
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];
    let row = this.point.row;
    let col = this.point.col;

    if ((!this.board.reverted && this.color === Color.WHITE) || (this.board.reverted && this.color === Color.BLACK)) {

      possiblePoints.push(new Point(row - 1, col - 1));

      possiblePoints.push(new Point(row - 1, col + 1));
    } else {
      possiblePoints.push(new Point(row + 1, col - 1));

      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }

}
