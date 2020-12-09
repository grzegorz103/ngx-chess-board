import { Board } from '../models/board';
import { Color } from '../models/pieces/color';
import { Point } from '../models/pieces/point';
import { AbstractPiece } from './abstract-piece';
import { PieceAbstractDecorator } from './piece-abstract-decorator';
export declare class AvailableMoveDecorator extends PieceAbstractDecorator {
    private pointClicked;
    private color;
    private board;
    constructor(piece: AbstractPiece, pointClicked: Point, color: Color, board: Board);
    getPossibleCaptures(): Point[];
    getPossibleMoves(): Point[];
}
