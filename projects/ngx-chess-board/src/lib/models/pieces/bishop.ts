import { PieceConstant } from '../../utils/unicode-constants';
import { Board } from '../board';
import { Color } from './color';
import { King } from './king';
import { Piece } from './piece';
import { Point } from './point';

export class Bishop extends Piece {
    constructor(
        point: Point,
        color: Color,
        constant: PieceConstant,
        board: Board
    ) {
        super(point, color, constant, 3, board);
    }

    getPossibleMoves(): Point[] {
        const possiblePoints = [];

        const row = this.point.row;
        const col = this.point.col;

        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            // lewa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
            // prawa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
            // lewa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
            // prawa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        return possiblePoints;
    }

    getPossibleCaptures() {
        const possiblePoints = [];

        const row = this.point.row;
        const col = this.point.col;

        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            // lewa gorna przekatna
            if (
                this.board.isFieldTakenByEnemy(
                    i,
                    j,
                    this.color === Color.WHITE ? Color.BLACK : Color.WHITE
                )
            ) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!this.board.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
            // prawa gorna przekatna
            if (
                this.board.isFieldTakenByEnemy(
                    i,
                    j,
                    this.color === Color.WHITE ? Color.BLACK : Color.WHITE
                )
            ) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!this.board.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
            // lewa dolna przekatna
            if (
                this.board.isFieldTakenByEnemy(
                    i,
                    j,
                    this.color === Color.WHITE ? Color.BLACK : Color.WHITE
                )
            ) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!this.board.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
            // prawa dolna przekatna
            if (
                this.board.isFieldTakenByEnemy(
                    i,
                    j,
                    this.color === Color.WHITE ? Color.BLACK : Color.WHITE
                )
            ) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!this.board.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        return possiblePoints;
    }

    getCoveredFields(): Point[] {
        const possiblePoints = [];

        const row = this.point.row;
        const col = this.point.col;

        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            // lewa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                if (!(this.board.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                }
                break;
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
            // prawa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                if (!(this.board.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                }
                break;
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
            // lewa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                if (!(this.board.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                }
                break;
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
            // prawa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                if (!(this.board.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                }
                break;
            }
        }

        return possiblePoints;
    }
}
