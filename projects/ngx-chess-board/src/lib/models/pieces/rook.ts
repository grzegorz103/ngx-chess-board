import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';
import { King } from './king';
import {Board} from '../board';

export class Rook extends Piece {

  isMovedAlready = false;

  constructor(point: Point, color: Color, image: string, board: Board) {
        super(point, color, image, 5, board);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

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
                possiblePoints.push(new Point(row,j));
                break;
            } else {
                if (!this.board.isFieldEmpty(row,j)) {
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
            if (this.board.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            } else {
                if (!(this.board.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (this.board.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            } else {
                if (!(this.board.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (this.board.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            } else {
                if (!(this.board.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (this.board.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            } else {
                if (!(this.board.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
            }
        }

        return possiblePoints;
    }

}
