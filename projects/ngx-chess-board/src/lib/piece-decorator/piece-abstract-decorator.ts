import {AbstractPiece} from './abstract-piece';
import {Point} from '../models/pieces/point';

export abstract class PieceAbstractDecorator implements AbstractPiece{

  piece: AbstractPiece;

  protected constructor(piece: AbstractPiece) {
    this.piece = piece;
  }

  abstract getPossibleCaptures(): Point[];

  abstract getPossibleMoves(): Point[];

}
