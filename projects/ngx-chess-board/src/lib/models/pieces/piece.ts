import { AbstractPiece } from '../../engine/piece-decorator/abstract-piece';
import { PieceConstant } from '../../utils/unicode-constants';
import { Board } from '../board';
import { Color } from './color';
import { Point } from './point';

export abstract class Piece implements AbstractPiece {
    point: Point;
    color: Color;
    constant: PieceConstant;
    checkPoints: Point[] = [];
    relValue: number;
    board: Board;

    constructor(
        point: Point,
        color: Color,
        constant: PieceConstant,
        relValue: number,
        board: Board
    ) {
        this.color = color;
        this.constant = constant;
        this.point = point;
        this.relValue = relValue;
        this.board = board;
    }

    abstract getPossibleMoves(): Point[];

    abstract getPossibleCaptures(): Point[];

    abstract getCoveredFields(): Point[]; // zwraca liste punktow ktore sa puste lub istnieje na nich pionek tego samego koloru
}
