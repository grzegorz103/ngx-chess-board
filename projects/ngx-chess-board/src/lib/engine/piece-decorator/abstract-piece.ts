import { Point } from '../../models/pieces/point';

export interface AbstractPiece {

    getPossibleMoves(): Point[];

    getPossibleCaptures(): Point[];

}
