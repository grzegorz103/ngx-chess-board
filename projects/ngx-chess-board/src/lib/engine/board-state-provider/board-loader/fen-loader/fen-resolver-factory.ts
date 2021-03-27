import { Board } from '../../../../models/board';
import { AbstractFenResolver } from './abstract-fen-resolver';
import { DefaultFenResolver } from './default-fen-resolver';

export class FenResolverFactory {

    static getFenResolver(board: Board): AbstractFenResolver {
        return new DefaultFenResolver(board);
    }

}
