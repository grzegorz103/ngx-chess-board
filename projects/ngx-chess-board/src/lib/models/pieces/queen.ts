import {Piece} from './piece';
import {Point} from './point';
import {Color} from './color';
import {King} from './king';
import {Board} from '../board';

export class Queen extends Piece {

  constructor(point: Point, color: Color, image: string, board: Board) {
    super(point, color, image, 9, board);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        break;
      }
    }

    for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        break;
      }
    }

    for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        break;
      }
    }

    for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        break;
      }
    }

    for (let i = row + 1; i < 8; ++i) { // dol
      if (this.board.isFieldEmpty(i, col)) {
        possiblePoints.push(new Point(i, col));
      } else {
        break;
      }
    }

    for (let i = row - 1; i >= 0; --i) { // gora
      if (this.board.isFieldEmpty(i, col)) {
        possiblePoints.push(new Point(i, col));
      } else {
        break;
      }
    }

    for (let j = col - 1; j >= 0; --j) { // lewo
      if (this.board.isFieldEmpty(row, j)) {
        possiblePoints.push(new Point(row, j));
      } else {
        break;
      }
    }

    for (let j = col + 1; j < 8; ++j) { // prawo
      if (this.board.isFieldEmpty(row, j)) {
        possiblePoints.push(new Point(row, j));
      } else {
        break;
      }
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
      if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(i, j));
        break;
      } else {
        if (!this.board.isFieldEmpty(i, j)) {
          break;
        }
      }
    }

    for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
      if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(i, j));
        break;
      } else {
        if (!this.board.isFieldEmpty(i, j)) {
          break;
        }
      }
    }

    for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
      if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(i, j));
        break;
      } else {
        if (!this.board.isFieldEmpty(i, j)) {
          break;
        }
      }
    }

    for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
      if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(i, j));
        break;
      } else {
        if (!this.board.isFieldEmpty(i, j)) {
          break;
        }
      }
    }
    for (let i = row + 1; i < 8; ++i) { // dol
      if (this.board.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(i, col));
        break;
      } else {
        if (!this.board.isFieldEmpty(i, col)) {
          break;
        }
      }
    }

    for (let i = row - 1; i >= 0; --i) { // gora
      if (this.board.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(i, col));
        break;
      } else {
        if (!this.board.isFieldEmpty(i, col)) {
          break;
        }
      }
    }

    for (let j = col - 1; j >= 0; --j) { // lewo
      if (this.board.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(row, j));
        break;
      } else {
        if (!this.board.isFieldEmpty(row, j)) {
          break;
        }
      }
    }

    for (let j = col + 1; j < 8; ++j) { // prawo
      if (this.board.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(new Point(row, j));
        break;
      } else {
        if (!this.board.isFieldEmpty(row, j)) {
          break;
        }
      }
    }
    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    for (let i = row + 1; i < 8; ++i) { // dol
      if (this.board.isFieldEmpty(i, col)) {
        possiblePoints.push(new Point(i, col));
      } else {
        if (!(this.board.getPieceByField(i, col) instanceof King)) {
          possiblePoints.push(new Point(i, col));
          break;
        }
      }
    }

    for (let i = row - 1; i >= 0; --i) { // gora
      if (this.board.isFieldEmpty(i, col)) {
        possiblePoints.push(new Point(i, col));
      } else {
        if (!(this.board.getPieceByField(i, col) instanceof King)) {
          possiblePoints.push(new Point(i, col));
          break;
        }
      }
    }

    for (let j = col - 1; j >= 0; --j) { // lewo
      if (this.board.isFieldEmpty(row, j)) {
        possiblePoints.push(new Point(row, j));
      } else {
        if (!(this.board.getPieceByField(row, j) instanceof King)) {
          possiblePoints.push(new Point(row, j));
          break;
        }
      }
    }

    for (let j = col + 1; j < 8; ++j) { // prawo
      if (this.board.isFieldEmpty(row, j)) {
        possiblePoints.push(new Point(row, j));
      } else {
        if (!(this.board.getPieceByField(row, j) instanceof King)) {
          possiblePoints.push(new Point(row, j));
          break;
        }
      }
    }


    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        if (!(this.board.getPieceByField(i, j) instanceof King)) {
          possiblePoints.push(new Point(i, j));
          break;
        }
      }
    }

    for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        if (!(this.board.getPieceByField(i, j) instanceof King)) {
          possiblePoints.push(new Point(i, j));
          break;
        }
      }
    }

    for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        if (!(this.board.getPieceByField(i, j) instanceof King)) {
          possiblePoints.push(new Point(i, j));
          break;
        }
      }
    }

    for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
      if (this.board.isFieldEmpty(i, j)) {
        possiblePoints.push(new Point(i, j));
      } else {
        if (!(this.board.getPieceByField(i, j) instanceof King)) {
          possiblePoints.push(new Point(i, j));
          break;
        }
      }
    }

    return possiblePoints;
  }

}
