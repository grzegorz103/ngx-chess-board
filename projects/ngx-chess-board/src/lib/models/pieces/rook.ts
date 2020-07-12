import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';
import { King } from './king';
import {NgxChessBoardComponent} from '../../ngx-chess-board.component';

export class Rook extends Piece {

  isMovedAlready = false;

    constructor(point: Point, color: Color, image: string, ngxChessBoardComponent: NgxChessBoardComponent) {
        super(point, color, image, 5, ngxChessBoardComponent);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        for (let i = row + 1; i < 8; ++i) { // dol
            if (this.ngxChessBoardComponent.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            } else {
                break;
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (this.ngxChessBoardComponent.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            } else {
                break;
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (this.ngxChessBoardComponent.isFieldEmpty(row, j)) {
                possiblePoints.push(new Point(row, j));
            } else {
                break;
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (this.ngxChessBoardComponent.isFieldEmpty(row, j)) {
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
            if (this.ngxChessBoardComponent.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, col));
                break;
            } else {
                if (!this.ngxChessBoardComponent.isFieldEmpty(i, col)) {
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (this.ngxChessBoardComponent.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, col));
                break;
            } else {
                if (!this.ngxChessBoardComponent.isFieldEmpty(i, col)) {
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row,j));
                break;
            } else {
                if (!this.ngxChessBoardComponent.isFieldEmpty(row,j)) {
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (this.ngxChessBoardComponent.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row, j));
                break;
            } else {
                if (!this.ngxChessBoardComponent.isFieldEmpty(row, j)) {
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
            if (this.ngxChessBoardComponent.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            } else {
                if (!(this.ngxChessBoardComponent.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (this.ngxChessBoardComponent.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            } else {
                if (!(this.ngxChessBoardComponent.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (this.ngxChessBoardComponent.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            } else {
                if (!(this.ngxChessBoardComponent.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (this.ngxChessBoardComponent.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            } else {
                if (!(this.ngxChessBoardComponent.getPieceByField instanceof King)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
            }
        }

        return possiblePoints;
    }

}
