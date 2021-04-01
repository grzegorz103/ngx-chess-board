import { NotationProcessor } from './notation-processor';
export declare class NotationProcessorFactory {
    static getProcessor(type: NotationType): NotationProcessor;
    static getDefaultProcessor(): NotationProcessor;
}
export declare enum NotationType {
    FEN = 1,
    PGN = 2
}
