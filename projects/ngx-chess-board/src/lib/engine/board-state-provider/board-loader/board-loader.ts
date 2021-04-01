import { Board } from '../../../models/board';
import { Bishop } from '../../../models/pieces/bishop';
import { Color } from '../../../models/pieces/color';
import { King } from '../../../models/pieces/king';
import { Knight } from '../../../models/pieces/knight';
import { Pawn } from '../../../models/pieces/pawn';
import { Point } from '../../../models/pieces/point';
import { Queen } from '../../../models/pieces/queen';
import { Rook } from '../../../models/pieces/rook';
import { UnicodeConstants } from '../../../utils/unicode-constants';
import { AbstractEngineFacade } from '../../abstract-engine-facade';
import { DefaultPiecesLoader } from './default-pieces-loader';
import { NotationProcessor } from './notation-processors/notation-processor';
import { NotationProcessorFactory } from './notation-processors/notation-processor-factory';

export class BoardLoader {

    private engineFacade: AbstractEngineFacade;
    private notationProcessor: NotationProcessor;

    constructor(engineFacade: AbstractEngineFacade, notationProcessor?: NotationProcessor) {
        this.engineFacade = engineFacade;

        if (notationProcessor) {
            this.notationProcessor = notationProcessor;
        } else {
            this.notationProcessor = NotationProcessorFactory.getDefaultProcessor();
        }

    }

    addPieces() {
        DefaultPiecesLoader.loadDefaultPieces(this.engineFacade.board);
    }

    loadFEN(fen: string) {
        this.notationProcessor.process(fen, this.engineFacade);
    }

    loadPGN(pgn: string) {
        this.notationProcessor.process(pgn, this.engineFacade)
    }

    setEngineFacade(engineFacade: AbstractEngineFacade) {
        this.engineFacade = engineFacade;
    }

    setNotationProcessor(notationProcessor: NotationProcessor) {
        this.notationProcessor = notationProcessor;
    }

}
