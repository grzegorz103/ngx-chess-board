import { Board } from '../../../../models/board';

export interface NotationProcessor {

    process: (notation: string, board: Board) => void;

}
