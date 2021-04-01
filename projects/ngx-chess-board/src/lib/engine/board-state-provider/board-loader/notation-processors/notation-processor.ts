import { AbstractEngineFacade } from '../../../abstract-engine-facade';

export interface NotationProcessor {

    process: (notation: string, engineFacade: AbstractEngineFacade) => void;

}
