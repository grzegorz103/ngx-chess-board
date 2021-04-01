import { NotationProcessor } from './notation-processor';
import {
    DefaultFenProcessor,
} from './fen-loader/default-fen-processor';
import { DefaultPgnProcessor } from './pgn-loader/default-pgn-processor';

export class NotationProcessorFactory {

    static getProcessor(type: NotationType): NotationProcessor {
        switch (type) {
            case NotationType.FEN:
                return new DefaultFenProcessor();

            case NotationType.PGN:
                return new DefaultPgnProcessor();

        }
    }

    static getDefaultProcessor(): NotationProcessor {
        return new DefaultFenProcessor();
    }

}

export enum NotationType {
    FEN = 1,
    PGN = 2
}
