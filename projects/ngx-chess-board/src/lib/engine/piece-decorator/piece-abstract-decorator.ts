import { Point } from '../../models/pieces/point';
import { AbstractPiece } from './abstract-piece';

export abstract class PieceAbstractDecorator implements AbstractPiece {

    piece: AbstractPiece;

    protected constructor(piece: AbstractPiece) {
        this.piece = piece;
    }

    abstract getPossibleCaptures(): Point[];

    abstract getPossibleMoves(): Point[];

}
