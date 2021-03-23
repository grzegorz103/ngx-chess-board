import { BehaviorSubject } from 'rxjs';
import { BoardState } from './board-state';
export declare class MoveStateProvider {
    statesSubject$: BehaviorSubject<BoardState[]>;
    get states(): BoardState[];
    set states(states: BoardState[]);
    addMove(state: BoardState): void;
    getStates(): BoardState[];
    pop(): BoardState;
    isEmpty(): boolean;
    clear(): void;
    getLastState(): BoardState;
    getLastStateIndex(): number;
}
