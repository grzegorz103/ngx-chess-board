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

  constructor(point: Point, color: Color, image: string) {
    super(point, color, image, 0);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;
    // lewo
    if (NgxChessBoardComponent.isFieldEmpty(row, col - 1) && !NgxChessBoardComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (NgxChessBoardComponent.isFieldEmpty(row, col + 1) && !NgxChessBoardComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (NgxChessBoardComponent.isFieldEmpty(row + 1, col) && !NgxChessBoardComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (NgxChessBoardComponent.isFieldEmpty(row - 1, col) && !NgxChessBoardComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (NgxChessBoardComponent.isFieldEmpty(row - 1, col - 1) && !NgxChessBoardComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (NgxChessBoardComponent.isFieldEmpty(row - 1, col + 1) && !NgxChessBoardComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (NgxChessBoardComponent.isFieldEmpty(row + 1, col - 1) && !NgxChessBoardComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (NgxChessBoardComponent.isFieldEmpty(row + 1, col + 1) && !NgxChessBoardComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    if(!this.isMovedAlready){
      let longCastlePossible = true;
      for (let i = col - 1; i > 0; --i) {
        if (!NgxChessBoardComponent.isFieldEmpty(row, i) || NgxChessBoardComponent.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
          longCastlePossible = false;
          break;
        }
      }

      if (longCastlePossible && NgxChessBoardComponent.getPieceByField(row, 0)) {
        let leftRook = NgxChessBoardComponent.getPieceByField(row, 0);
        if (leftRook instanceof Rook) {
          if (!leftRook.isMovedAlready) {
            possiblePoints.push(new Point(row, col - 2));
          }
        }
      }

      let shortCastlePossible = true;
      for (let i = col + 1; i < 7; ++i) {
        if (!NgxChessBoardComponent.isFieldEmpty(row, i) || NgxChessBoardComponent.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
          shortCastlePossible = false;
          break;
        }
      }

      if (shortCastlePossible && NgxChessBoardComponent.getPieceByField(row, 7)) {
        let rightRook = NgxChessBoardComponent.getPieceByField(row, 7);
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
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !NgxChessBoardComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // lewo
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row, col - 1, this.color)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row, col + 1, this.color)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col, this.color)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col, this.color)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (NgxChessBoardComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }
}
