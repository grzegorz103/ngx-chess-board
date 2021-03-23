import { Point } from '../../models/pieces/point';
import { AbstractPiece } from './abstract-piece';
export declare abstract class PieceAbstractDecorator implements AbstractPiece {
    piece: AbstractPiece;
    protected constructor(piece: AbstractPiece);
    abstract getPossibleCaptures(): Point[];
    abstract getPossibleMoves(): Point[];
}
