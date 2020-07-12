import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {Rook} from "./rook";
import {NgxChessBoardComponent} from '../../ngx-chess-board.component';

export class King extends Piece {

  castledAlready = false;
  shortCastled = false;
  longCastled = false;
  isMovedAlready;
  isCastling = false;

    constructor(point: Point, color: Color, image: string, ngxChessBoardComponent: NgxChessBoardComponent) {
    super(point, color, image, 0, ngxChessBoardComponent);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;
    // lewo
    if (this.ngxChessBoardComponent.isFieldEmpty(row, col - 1) && !this.ngxChessBoardComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (this.ngxChessBoardComponent.isFieldEmpty(row, col + 1) && !this.ngxChessBoardComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (this.ngxChessBoardComponent.isFieldEmpty(row + 1, col) && !this.ngxChessBoardComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (this.ngxChessBoardComponent.isFieldEmpty(row - 1, col) && !this.ngxChessBoardComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (this.ngxChessBoardComponent.isFieldEmpty(row - 1, col - 1) && !this.ngxChessBoardComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (this.ngxChessBoardComponent.isFieldEmpty(row - 1, col + 1) && !this.ngxChessBoardComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (this.ngxChessBoardComponent.isFieldEmpty(row + 1, col - 1) && !this.ngxChessBoardComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (this.ngxChessBoardComponent.isFieldEmpty(row + 1, col + 1) && !this.ngxChessBoardComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    if(!this.isMovedAlready){
      let longCastlePossible = true;
      for (let i = col - 1; i > 0; --i) {
        if (!this.ngxChessBoardComponent.isFieldEmpty(row, i) || this.ngxChessBoardComponent.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
          longCastlePossible = false;
          break;
        }
      }

      if (longCastlePossible && this.ngxChessBoardComponent.getPieceByField(row, 0)) {
        let leftRook = this.ngxChessBoardComponent.getPieceByField(row, 0);
        if (leftRook instanceof Rook) {
          if (!leftRook.isMovedAlready) {
            possiblePoints.push(new Point(row, col - 2));
          }
        }
      }

      let shortCastlePossible = true;
      for (let i = col + 1; i < 7; ++i) {
        if (!this.ngxChessBoardComponent.isFieldEmpty(row, i) || this.ngxChessBoardComponent.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
          shortCastlePossible = false;
          break;
        }
      }

      if (shortCastlePossible && this.ngxChessBoardComponent.getPieceByField(row, 7)) {
        let rightRook = this.ngxChessBoardComponent.getPieceByField(row, 7);
        if (rightRook instanceof Rook) {
          if (!rightRook.isMovedAlready) {
            possiblePoints.push(new Point(row, col + 2));
          }
        }
      }
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // lewo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !this.ngxChessBoardComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // lewo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row, col - 1, this.color)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row, col + 1, this.color)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col, this.color)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col, this.color)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }
}
