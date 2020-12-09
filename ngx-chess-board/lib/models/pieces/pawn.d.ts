import { PieceConstant } from '../../utils/unicode-constants';
import { Board } from '../board';
import { Color } from './color';
import { Piece } from './piece';
import { Point } from './point';
export declare class Pawn extends Piece {
    isMovedAlready: boolean;
    constructor(point: Point, color: Color, constant: PieceConstant, board: Board);
    getPossibleMoves(): Point[];
    getPossibleCaptures(): Point[];
    getCoveredFields(): Point[];
}
