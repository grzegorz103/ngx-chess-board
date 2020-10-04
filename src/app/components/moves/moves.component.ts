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
        const source = historyMove.move.substring(0, 2);
        const target = historyMove.move.substring(2, 4);

        let sourceLetter = source.charAt(0);
        let move: string;
        const piece = historyMove.piece;
        const isPawn = piece === 'Pawn';
        const isRook = piece === 'Rook';
        const isBishop = piece === 'Bishop';
        const isKing = piece === 'King';
        const isQueen = piece === 'Queen';
        const isKnight = piece === 'Knight';
        if (isPawn) {
            sourceLetter = historyMove.x ? sourceLetter : '';
        }
        if (isRook) {
            sourceLetter = historyMove.color === 'black' ? '&#x2656;' : '&#x265C;';
        }
        if (isBishop) {
            sourceLetter = historyMove.color === 'black' ? '&#x2657;' : '&#x265D;';
        }
        if (isKing) {
            sourceLetter = historyMove.color === 'black' ? '&#x2654;' : '&#x265A;';
        }
        if (isQueen) {
            sourceLetter = historyMove.color === 'black' ? '&#x2655;' : '&#x265B;';
        }
        if (isKnight) {
            sourceLetter = historyMove.color === 'black' ? '&#x2658;' : '&#x265E;';
        }
        if (historyMove.x) {
            move = sourceLetter + 'x' + target;
        } else {
            move = sourceLetter + target;
        }

        if (isKing) {
            if (historyMove.move === 'e1g1' || historyMove.move === 'e8g8') {
                move = 'O-O';
            }
            if (historyMove.move === 'e1c1' || historyMove.move === 'e8c8') {
                move = 'O-O-O';
            }
        }

        if (historyMove.check) {
            move += '+';
        }
        if (historyMove.checkmate) {
            move += '#';
        }
        historyMove.color === 'white' ? this.addWhiteMove(move) : this.addBlackMove(move);
    }
}
