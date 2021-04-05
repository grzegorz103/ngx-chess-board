import { Board } from '../../models/board';
import { Piece } from '../../models/pieces/piece';
import { Point } from '../../models/pieces/point';
import { AbstractPgnProcessor } from './pgn-processor';
export declare class DefaultPgnProcessor extends AbstractPgnProcessor {
    process(board: Board, sourcePiece: Piece, destPoint: Point, destPiece?: Piece): void;
    private resolvePieceByFirstChar;
    private isEqualByCol;
}
