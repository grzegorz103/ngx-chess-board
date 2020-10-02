import { AbstractPiece } from '../../piece-decorator/abstract-piece';
import { Board } from '../board';
import { Color } from './color';
import { Point } from './point';

export abstract class Piece implements AbstractPiece {
    point: Point;
    color: Color;
    image: string;
    checkPoints: Point[] = [];
    relValue: number;
    board: Board;

    constructor(point: Point, color: Color, image: string, relValue: number, board: Board) {
        this.color = color;
        this.image = image;
        this.point = point;
        this.relValue = relValue;
        this.board = board;
    }

    abstract getPossibleMoves(): Point[];

    abstract getPossibleCaptures(): Point[];

    abstract getCoveredFields(): Point[]; // zwraca liste punktow ktore sa puste lub istnieje na nich pionek tego samego koloru
}
