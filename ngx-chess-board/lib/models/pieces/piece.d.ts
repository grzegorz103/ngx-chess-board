import { AbstractPiece } from '../../piece-decorator/abstract-piece';
import { PieceConstant } from '../../utils/unicode-constants';
import { Board } from '../board';
import { Color } from './color';
import { Point } from './point';
export declare abstract class Piece implements AbstractPiece {
    point: Point;
    color: Color;
    constant: PieceConstant;
    checkPoints: Point[];
    relValue: number;
    board: Board;
    constructor(point: Point, color: Color, constant: PieceConstant, relValue: number, board: Board);
    abstract getPossibleMoves(): Point[];
    abstract getPossibleCaptures(): Point[];
    abstract getCoveredFields(): Point[];
}
