import { BehaviorSubject } from 'rxjs';
import { BoardState } from './board-state';

export class MoveStateProvider {
    statesSubject$ = new BehaviorSubject<BoardState[]>([]);

    get states(): BoardState[] {
        return this.statesSubject$.value;
    }

    set states(states: BoardState[]) {
        this.statesSubject$.next(states);
    }

    addMove(state: BoardState) {
        this.states = [...this.states, state];
    }

    getStates(): BoardState[] {
        return this.states;
    }

    pop(): BoardState {
        const lastState = this.getLastState();
        this.states = this.states.filter((state) => state !== lastState);
        return lastState;
    }

    isEmpty() {
        return this.states.length === 0;
    }

    clear() {
        this.states = [];
    }

    getLastState() {
        return this.states[this.getLastStateIndex()];
    }

    getLastStateIndex(): number {
        return this.states.length - 1;
    }
}
