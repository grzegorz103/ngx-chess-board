import {Piece} from './piece';
import {Point} from './point';
import {Color} from './color';
import {NgxChessBoardComponent} from '../../ngx-chess-board.component';

export class Knight extends Piece {

  isMovedAlready = false;

    constructor(point: Point, color: Color, image: string, ngxChessBoardComponent: NgxChessBoardComponent) {
    super(point, color, image, 3, ngxChessBoardComponent);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // gora -> lewo
    if (this.ngxChessBoardComponent.isFieldEmpty(row - 2, col - 1)) {
      possiblePoints.push(new Point(row - 2, col - 1));
    }

    // gora -> prawo
    if (this.ngxChessBoardComponent.isFieldEmpty(row - 2, col + 1)) {
      possiblePoints.push(new Point(row - 2, col + 1));
    }

    // lewo -> gora
    if (this.ngxChessBoardComponent.isFieldEmpty(row - 1, col - 2)) {
      possiblePoints.push(new Point(row - 1, col - 2));
    }

    // prawo -> gora
    if (this.ngxChessBoardComponent.isFieldEmpty(row - 1, col + 2)) {
      possiblePoints.push(new Point(row - 1, col + 2));
    }

    // lewo -> dol
    if (this.ngxChessBoardComponent.isFieldEmpty(row + 1, col - 2)) {
      possiblePoints.push(new Point(row + 1, col - 2));
    }

    // prawo -> dol
    if (this.ngxChessBoardComponent.isFieldEmpty(row + 1, col + 2)) {
      possiblePoints.push(new Point(row + 1, col + 2));
    }

    // dol -> lewo
    if (this.ngxChessBoardComponent.isFieldEmpty(row + 2, col - 1)) {
      possiblePoints.push(new Point(row + 2, col - 1));
    }

    // dol -> prawo
    if (this.ngxChessBoardComponent.isFieldEmpty(row + 2, col + 1)) {
      possiblePoints.push(new Point(row + 2, col + 1));
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // gora -> lewo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 2, col - 1));
    }

    // gora -> prawo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 2, col + 1));
    }

    // lewo -> gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 2));
    }

    // prawo -> gora
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row - 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 2));
    }

    // lewo -> dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 2));
    }

    // prawo -> dol
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 2));
    }

    // dol -> lewo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 2, col - 1));
    }

    // dol -> prawo
    if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row + 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
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
