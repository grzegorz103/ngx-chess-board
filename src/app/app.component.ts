import { Component, ViewChild } from '@angular/core';
import { MoveChange, NgxChessBoardComponent } from 'ngx-chess-board';
import { PieceIconInput } from 'ngx-chess-board';
import { FenComponent } from './components/fen/fen.component';
import { MovesComponent } from './components/moves/moves.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @ViewChild('boardManager', { static: false })
    boardManager: NgxChessBoardComponent;
    @ViewChild('movesManager', { static: false }) movesManager: MovesComponent;
    @ViewChild('fenManager', { static: false }) fenManager: FenComponent;
    public fen: string;
    private currentStateIndex: number;
    manualMove = 'd2d4';
    icons: PieceIconInput = {
        blackBishopUrl: '',
        blackKingUrl: '',
        blackKnightUrl: '',
        blackPawnUrl: '',
        blackQueenUrl: '',
        blackRookUrl: '',
        whiteBishopUrl: '',
        whiteKingUrl: '',
        whiteKnightUrl: '',
        whitePawnUrl: '',
        whiteQueenUrl: '',
        whiteRookUrl: ''
    };

    public reset(): void {
        this.movesManager.clear();
        this.boardManager.reset();
        this.fen = this.boardManager.getFEN();
    }

    public reverse(): void {
        this.boardManager.reverse();
    }

    public undo(): void {
        console.log('UNDO');
        this.movesManager.undo();
        this.boardManager.undo();
        this.fen = this.boardManager.getFEN();
    }

    public setFen(fen: string): void {
        if (this.fen !== fen) {
            this.boardManager.setFEN(fen);
        }
    }

    public switchBoard(stateIndex: number): void {
        if (this.currentStateIndex !== stateIndex) {
            this.currentStateIndex = stateIndex;
            this.boardManager.updateBoard(
                this.boardManager.moveHistoryProvider.historyMoves[stateIndex]
                    .board
            );
        }
    }

    public setLatestBoard(): void {
        this.switchBoard(
            this.boardManager.moveHistoryProvider.getLastMoveIndex()
        );
    }

    public moveCallback(move: MoveChange): void {
        this.fen = this.boardManager.getFEN();
        this.movesManager.addMove(move);
    }

    public moveManual(): void {
        this.boardManager.move(this.manualMove);
    }
}
