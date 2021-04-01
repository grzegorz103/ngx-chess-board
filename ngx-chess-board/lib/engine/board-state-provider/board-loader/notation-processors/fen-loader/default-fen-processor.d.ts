import { AbstractEngineFacade } from '../../../../abstract-engine-facade';
import { NotationProcessor } from '../notation-processor';
export declare class DefaultFenProcessor implements NotationProcessor {
    process(notation: string, engineFacade: AbstractEngineFacade): void;
    private setCurrentPlayer;
    private setCastles;
    private setFullMoveCount;
    private setEnPassant;
    private setRookAlreadyMoved;
}
