import {Component, ViewChild} from '@angular/core';
import {NgxChessBoardService} from 'ngx-chess-board';
import {NgxChessBoardView} from 'ngx-chess-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-chess-board demo';

  darkTileColor: string = 'rgb(97, 84, 61)';
  lightTileColor: string = '#BAA378';
  size: number = 400;
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  @ViewChild('board', {static: false}) board: NgxChessBoardView;

  constructor(private ngxService: NgxChessBoardService) {
  }

  reset() {
    alert('Resetting game');
    this.board.reset();
  }

  reverse() {
    alert('Reverting board');
    this.board.reverse();
  }

  undo() {
    this.board.undo();
    this.fen = this.board.getFEN();
  }

  showMoveHistory() {
    alert(this.board.getMoveHistory());
  }

  setFen() {
    alert('Setting FEN');
    this.board.setFEN(this.fen);
  }

  getFEN() {
    let fen = this.board.getFEN();
    alert(fen);
  }

  moveCallback() {
    this.fen = this.board.getFEN();
  }

}
