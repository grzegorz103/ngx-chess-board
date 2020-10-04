import { BehaviorSubject } from 'rxjs';
import { HistoryMove } from './history-move';

export class HistoryMoveProvider {
    historyMovesSubject$ = new BehaviorSubject<HistoryMove[]>([]);

    get historyMoves(): HistoryMove[] {
        return this.historyMovesSubject$.value;
    }

    set historyMoves(states: HistoryMove[]) {
        this.historyMovesSubject$.next(states);
    }

    addMove(historyMove: HistoryMove) {
        this.historyMoves = [...this.historyMoves, historyMove];
    }

    pop(): HistoryMove {
        const lastHistoryMove = this.getLastMove();
        this.historyMoves = this.historyMoves.filter(
            (state) => state !== lastHistoryMove
        );
        return lastHistoryMove;
    }

    getAll() {
        return this.historyMoves;
    }

    clear() {
        this.historyMoves = [];
    }

    getLastMove() {
        return this.historyMoves[this.getLastMoveIndex()];
    }

    getLastMoveIndex() {
        return this.historyMoves.length - 1;
    }
}
