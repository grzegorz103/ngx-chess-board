import { Board } from '../../../../../models/board';
import { Piece } from '../../../../../models/pieces/piece';
import { AbstractEngineFacade } from '../../../../abstract-engine-facade';
import { NotationProcessor } from '../notation-processor';
export declare class DefaultPgnProcessor implements NotationProcessor {
    process(notation: string, engineFacade: AbstractEngineFacade): void;
    private processR1f2;
    protected extractMoves(notation: string): string[];
    protected movePiece(piece: Piece, board: Board, move: string): void;
    hasUpperCase(move: string): boolean;
    private resolvePieceByFirstChar;
    private isShortCastle;
    private removePiece;
    private isLongCastle;
    private resolveByCol;
    private resolveByRow;
    private replacePromotion;
    private resolvePromotion;
}
