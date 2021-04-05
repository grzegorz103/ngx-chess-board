import { Board } from '../../models/board';
import { Piece } from '../../models/pieces/piece';
import { Point } from '../../models/pieces/point';

export abstract class AbstractPgnProcessor {

    protected pgn = '';
    protected currentIndex = 0.5;

    public abstract process(
        board: Board,
        sourcePiece: Piece,
        destPoint: Point,
        destPiece?: Piece
    ): void;

    public getPGN() {
        return this.pgn;
    }

}
