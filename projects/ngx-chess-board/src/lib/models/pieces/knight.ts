import {Piece} from './piece';
import {Point} from './point';
import {Color} from './color';
import {Board} from '../board';

export class Knight extends Piece {

  isMovedAlready = false;

  constructor(point: Point, color: Color, image: string, board: Board) {
    super(point, color, image, 3, board);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // gora -> lewo
    if (this.board.isFieldEmpty(row - 2, col - 1)) {
      possiblePoints.push(new Point(row - 2, col - 1));
    }

    // gora -> prawo
    if (this.board.isFieldEmpty(row - 2, col + 1)) {
      possiblePoints.push(new Point(row - 2, col + 1));
    }

    // lewo -> gora
    if (this.board.isFieldEmpty(row - 1, col - 2)) {
      possiblePoints.push(new Point(row - 1, col - 2));
    }

    // prawo -> gora
    if (this.board.isFieldEmpty(row - 1, col + 2)) {
      possiblePoints.push(new Point(row - 1, col + 2));
    }

    // lewo -> dol
    if (this.board.isFieldEmpty(row + 1, col - 2)) {
      possiblePoints.push(new Point(row + 1, col - 2));
    }

    // prawo -> dol
    if (this.board.isFieldEmpty(row + 1, col + 2)) {
      possiblePoints.push(new Point(row + 1, col + 2));
    }

    // dol -> lewo
    if (this.board.isFieldEmpty(row + 2, col - 1)) {
      possiblePoints.push(new Point(row + 2, col - 1));
    }

    // dol -> prawo
    if (this.board.isFieldEmpty(row + 2, col + 1)) {
      possiblePoints.push(new Point(row + 2, col + 1));
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // gora -> lewo
    if (this.board.isFieldTakenByEnemy(row - 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 2, col - 1));
    }

    // gora -> prawo
    if (this.board.isFieldTakenByEnemy(row - 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 2, col + 1));
    }

    // lewo -> gora
    if (this.board.isFieldTakenByEnemy(row - 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 2));
    }

    // prawo -> gora
    if (this.board.isFieldTakenByEnemy(row - 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 2));
    }

    // lewo -> dol
    if (this.board.isFieldTakenByEnemy(row + 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 2));
    }

    // prawo -> dol
    if (this.board.isFieldTakenByEnemy(row + 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 2));
    }

    // dol -> lewo
    if (this.board.isFieldTakenByEnemy(row + 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 2, col - 1));
    }

    // dol -> prawo
    if (this.board.isFieldTakenByEnemy(row + 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 2, col + 1));
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // gora -> lewo
    possiblePoints.push(new Point(row - 2, col - 1));


    // gora -> prawo
    possiblePoints.push(new Point(row - 2, col + 1));

    // lewo -> gora
    possiblePoints.push(new Point(row - 1, col - 2));

    // prawo -> gora
    possiblePoints.push(new Point(row - 1, col + 2));

    // lewo -> dol
    possiblePoints.push(new Point(row + 1, col - 2));

    // prawo -> dol
    possiblePoints.push(new Point(row + 1, col + 2));

    // dol -> lewo
    possiblePoints.push(new Point(row + 2, col - 1));


    // dol -> prawo
    possiblePoints.push(new Point(row + 2, col + 1));


    return possiblePoints;
  }
}
