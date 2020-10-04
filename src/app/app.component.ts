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
    @ViewChild('board', { static: false })
    boardManager: NgxChessBoardComponent;
    @ViewChild('movesManager', { static: false }) movesManager: MovesComponent;
    @ViewChild('fenManager', { static: false }) fenManager: FenComponent;
    public fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
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

    public darkTileColor = 'rgb(97, 84, 61)';
    public lightTileColor = '#BAA378';
    public size = 400;
    public dragDisabled = false;
    public drawDisabled = false;
    public lightDisabled = false;
    public darkDisabled = false;

    public reset(): void {
        this.movesManager.clear();
        this.boardManager.reset();
        this.fen = this.boardManager.getFEN();
    }

    public reverse(): void {
        this.boardManager.reverse();
    }

    public undo(): void {
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
    }

    public moveManual(): void {
        this.boardManager.move(this.manualMove);
    }

    getFEN() {
        let fen = this.boardManager.getFEN();
        alert(fen);
    }

    showMoveHistory() {
        alert(this.boardManager.getMoveHistory())
    }

    switchDrag() {
        this.dragDisabled = !this.dragDisabled;
    }

    switchDraw() {
        this.drawDisabled = !this.drawDisabled;
    }

    switchDarkDisabled() {
        this.darkDisabled = !this.darkDisabled;
    }

    switchLightDisabled() {
        this.lightDisabled = !this.lightDisabled;
    }
}
