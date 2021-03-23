import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MoveChange } from 'ngx-chess-board';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-moves',
    templateUrl: './moves.component.html',
    styleUrls: ['./moves.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovesComponent {
    @Output() public switchToMoveIndex = new EventEmitter<number>();

    private whiteMovesSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private blackMovesSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    public whiteMoves$ = this.whiteMovesSubject$.asObservable();
    public blackMoves$ = this.blackMovesSubject$.asObservable();

    public undo() {
        if (this.whiteMoves.length > this.blackMoves.length) {
            this.whiteMoves = this.whiteMoves.filter((_, index) => index < this.whiteMoves.length - 1);
        } else {
            this.blackMoves = this.blackMoves.filter((_, index) => index < this.blackMoves.length - 1);
        }
    }

    private get whiteMoves(): string[] {
        return this.whiteMovesSubject$.value;
    }

    private set whiteMoves(moves: string[]) {
        this.whiteMovesSubject$.next(moves);
    }

    private get blackMoves(): string[] {
        return this.blackMovesSubject$.value;
    }

    private set blackMoves(moves: string[]) {
        this.blackMovesSubject$.next(moves);
    }

    public clear() {
        this.whiteMoves = [];
        this.blackMoves = [];
    }

    public addWhiteMove(move: string) {
        this.whiteMoves = [...this.whiteMoves, move];
    }

    public addBlackMove(move: string) {
        this.blackMoves = [...this.blackMoves, move];
    }

    public addMove(historyMove: MoveChange): void {

    }
}
