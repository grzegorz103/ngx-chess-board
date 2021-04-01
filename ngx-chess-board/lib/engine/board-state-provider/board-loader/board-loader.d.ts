import { AbstractEngineFacade } from '../../abstract-engine-facade';
import { NotationProcessor } from './notation-processors/notation-processor';
export declare class BoardLoader {
    private engineFacade;
    private notationProcessor;
    constructor(engineFacade: AbstractEngineFacade, notationProcessor?: NotationProcessor);
    addPieces(): void;
    loadFEN(fen: string): void;
    loadPGN(pgn: string): void;
    setEngineFacade(engineFacade: AbstractEngineFacade): void;
    setNotationProcessor(notationProcessor: NotationProcessor): void;
}
