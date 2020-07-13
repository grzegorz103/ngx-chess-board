import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Piece} from './models/pieces/piece';
import {Color} from './models/pieces/color';
import {King} from './models/pieces/king';
import {UnicodeConstants} from './utils/unicode-constants';
import {Point} from './models/pieces/point';
import {Rook} from './models/pieces/rook';
import {Queen} from './models/pieces/queen';
import {Pawn} from './models/pieces/pawn';
import {Board} from './models/board';
import {MoveUtils} from './utils/move-utils';
import {NgxChessBoardService} from './service/ngx-chess-board.service';
import {NgxChessBoardView} from './ngx-chess-board-view';
import {AvailableMoveDecorator} from './piece-decorator/available-move-decorator';

@Component({
  selector: 'ngx-chess-board',
  templateUrl: './ngx-chess-board.component.html',
  styleUrls: ['./ngx-chess-board.component.scss']
})
export class NgxChessBoardComponent implements OnInit, NgxChessBoardView {

  @Input('size')
  size: number = 400;

  @Input('darkTileColor')
  darkTileColor: string = 'rgb(97, 84, 61)';

  @Input('lightTileColor')
  lightTileColor: string = '#BAA378';

  @Output()
  onMove: EventEmitter<any> = new EventEmitter<any>();

  pieceSize: number;
  selected = false;

  @ViewChild('boardRef', {static: false})
  boardRef: ElementRef;

  board: Board;

  constructor(private ngxChessBoardService: NgxChessBoardService) {
    this.board = new Board(ngxChessBoardService, this);
  }

  ngOnInit() {
    this.ngxChessBoardService.componentMethodCalled$.subscribe(() => this.board.reset());
    this.pieceSize = this.size / 9;
  }

  async onMouseDown(event) {
    let pointClicked = this.getClickPoint(event);
    if (this.selected) {
      //   this.possibleMoves = activePiece.getPossibleMoves();
      if (this.board.isPointInPossibleMoves(pointClicked) || this.board.isPointInPossibleCaptures(pointClicked)) {
        this.board.lastMoveSrc = this.board.activePiece.point;
        this.board.lastMoveDest = pointClicked;
        await this.movePiece(this.board.activePiece, pointClicked);
        this.checkIfPawnFirstMove(this.board.activePiece);
        this.checkIfRookMoved(this.board.activePiece);
        this.checkIfKingMoved(this.board.activePiece);

        this.board.blackKingChecked = this.isKingInCheck(Color.BLACK, this.board.pieces);
        this.board.whiteKingChecked = this.isKingInCheck(Color.WHITE, this.board.pieces);

        this.checkForPossibleMoves(Color.BLACK, 'Checkmate!');
        this.checkForPossibleMoves(Color.WHITE, 'Checkmate!');

        this.checkForPat(Color.BLACK);
        this.checkForPat(Color.WHITE);
      }
      this.selected = false;
      this.board.possibleCaptures = [];
      this.board.activePiece = null;
      this.board.possibleMoves = [];
    } else {
      let pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
      if (pieceClicked) {

        if ((this.board.currentWhitePlayer && pieceClicked.color === Color.BLACK) || (!this.board.currentWhitePlayer && pieceClicked.color === Color.WHITE)) {
          return;
        }
        this.board.activePiece = pieceClicked;
        this.selected = true;
        this.board.possibleCaptures = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this).getPossibleCaptures();
        this.board.possibleMoves = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this).getPossibleMoves();
      }
    }
  }

  getPieceByPoint(row: number, col: number): Piece {
    row = Math.floor(row);
    col = Math.floor(col);
    return this.board.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  isKingChecked(piece: Piece) {
    if (piece instanceof King) {
      return piece.color === Color.WHITE ? this.board.whiteKingChecked : this.board.blackKingChecked;
    }
  }

  isFieldEmpty(row: number, col: number): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return !this.board.pieces.some(e => e.point.col === col && e.point.row === row);
  }

  isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return this.board.pieces.some(e => e.point.col === col && e.point.row === row && e.color === enemyColor);
  }


  isFieldUnderAttack(row: number, col: number, color: Color) {
    let found = false;
    return this.board.pieces.filter(e => e.color === color).some(e => e.getCoveredFields().some(f => f.col === col && f.row === row));
  }

  getPieceByField(row: number, col: number): Piece {
    if (this.isFieldEmpty(row, col)) {
      //   throw new Error('Piece not found');
      return undefined;
    }

    return this.board.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  getClickPoint(event) {
    return new Point(
      Math.floor((event.y - this.boardRef.nativeElement.getBoundingClientRect().top) / (this.boardRef.nativeElement.getBoundingClientRect().height / 8)),
      Math.floor((event.x - this.boardRef.nativeElement.getBoundingClientRect().left) / (this.boardRef.nativeElement.getBoundingClientRect().width / 8)));
  }

  async movePiece(piece: Piece, newPoint: Point) {
    let destPiece = this.board.pieces.find(e => e.point.col === newPoint.col && e.point.row === newPoint.row);

    if (destPiece && piece.color != destPiece.color) {
      this.board.pieces = this.board.pieces.filter(e => e !== destPiece);
    } else if (destPiece && piece.color === destPiece.color) {
      return;
    }
    if (piece instanceof King) {
      let squaresMoved = Math.abs(newPoint.col - piece.point.col);
      if (squaresMoved > 1) {
        if (newPoint.col < 3) {
          let leftRook = this.getPieceByField(piece.point.row, 0);
          leftRook.point.col = 3;
        } else {
          let rightRook = this.getPieceByField(piece.point.row, 7);
          rightRook.point.col = 5;
        }
      }
    }

    if (piece instanceof Pawn) {
      this.checkIfPawnTakesEnPassant(newPoint);
      this.checkIfPawnEnpassanted(piece, newPoint);
    }

    piece.point = newPoint;
    this.board.currentWhitePlayer = !this.board.currentWhitePlayer;
    this.onMove.emit();

    return this.checkForPawnPromote(piece);
  }

  checkIfPawnFirstMove(piece: Piece) {
    if (piece instanceof Pawn) {
      (piece as Pawn).isMovedAlready = true;
    }
  }

  private checkIfRookMoved(piece: Piece) {
    if (piece instanceof Rook) {
      piece.isMovedAlready = true;
    }
  }

  private checkIfKingMoved(piece: Piece) {
    if (piece instanceof King) {
      piece.isMovedAlready = true;
    }
  }

  isKingInCheck(color: Color, piece: Piece[]): boolean {
    let king = piece
      .find(e => e.color === color && e instanceof King);

    if (king) {
      return piece.some(e => e.getPossibleCaptures().some(e => e.col === king.point.col && e.row === king.point.row) && e.color !== color);
    }
    return false;
  }


  async checkForPawnPromote(piece: Piece) {
    if (!(piece instanceof Pawn)) {
      return;
    }

    if (piece.point.row === 0 || piece.point.row === 7) {
      this.board.pieces = this.board.pieces.filter(e => e !== piece);
      this.board.pieces.push(new Queen(piece.point, piece.color, piece.color === Color.WHITE ? UnicodeConstants.WHITE_QUEEN : UnicodeConstants.BLACK_QUEEN, this));
    }
  }

  async openPromoteDialog(piece: Piece) {

  }

  private checkForPossibleMoves(color: Color, text: string) {
    if (!this.board.pieces.filter(e => e.color === color)
      .some(e => e.getPossibleMoves().some(f => !MoveUtils.willMoveCauseCheck(color, e.point.row, e.point.col, f.row, f.col, this)
        || e.getPossibleCaptures().some(f => !MoveUtils.willMoveCauseCheck(color, e.point.row, e.point.col, f.row, f.col, this))))) {
      alert(text);
    }
  }

  private checkForPat(color: Color) {
    if (color === Color.WHITE && !this.board.whiteKingChecked) {
      this.checkForPossibleMoves(color, 'Stalemate!');
    } else if (color === Color.BLACK && !this.board.blackKingChecked) {
      this.checkForPossibleMoves(color, 'Stalemate!');
    }
  }

  private checkIfPawnEnpassanted(piece: Pawn, newPoint: Point) {
    if (Math.abs(piece.point.row - newPoint.row) > 1) {
      this.board.enPassantPiece = piece;
      this.board.enPassantPoint = new Point((piece.point.row + newPoint.row) / 2, piece.point.col);
    } else {
      this.board.enPassantPoint = null;
      this.board.enPassantPiece = null;
    }
  }

  private checkIfPawnTakesEnPassant(newPoint: Point) {
    if (newPoint.isEqual(this.board.enPassantPoint)) {
      this.board.pieces = this.board.pieces
        .filter(piece => piece !== this.board.enPassantPiece);
      this.board.enPassantPoint = null;
      this.board.enPassantPiece = null;
    }
  }

  reset() {
    this.board.reset();
  }

  reverse() {
    this.board.reverse();
  }

}
