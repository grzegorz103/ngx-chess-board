import {Pawn} from './pieces/pawn';
import {Point} from './pieces/point';
import {Color} from './pieces/color';
import {UnicodeConstants} from '../utils/unicode-constants';
import {Rook} from './pieces/rook';
import {Knight} from './pieces/knight';
import {Bishop} from './pieces/bishop';
import {Queen} from './pieces/queen';
import {King} from './pieces/king';
import {Piece} from './pieces/piece';
import {NgxChessBoardService} from '../service/ngx-chess-board.service';
import {NgxChessBoardComponent} from '../ngx-chess-board.component';

export class Board {

  board: number[][];

  pieces: Piece[] = [];
  enPassantPoint: Point = null;
  enPassantPiece: Piece = null;
  lastMoveSrc: Point = null;
  lastMoveDest: Point = null;
  activePiece: Piece;

  blackKingChecked: boolean;
  possibleCaptures: any[] = [];
  possibleMoves: any[] = [];
  whiteKingChecked: boolean;

  currentWhitePlayer = true;
  reverted: boolean = false;

  constructor(private ngxChessBoardService: NgxChessBoardService,
              private ngxChessBoardComponent: NgxChessBoardComponent) {

    this.board = [];
    for (var i: number = 0; i < 8; ++i) {
      this.board[i] = [];
      for (var j: number = 0; j < 8; ++j) {
        this.board[i][j] = 0;
      }
    }

    this.addPieces();
  }

  private addPieces() {
    this.pieces = [];
    // piony czarne
    for (let i = 0; i < 8; ++i) {
      this.pieces.push(new Pawn(new Point(1, i), Color.BLACK, UnicodeConstants.BLACK_PAWN, this.ngxChessBoardComponent));
    }
    this.pieces.push(new Rook(new Point(0, 0), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.ngxChessBoardComponent));
    this.pieces.push(new Knight(new Point(0, 1), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.ngxChessBoardComponent));
    this.pieces.push(new Bishop(new Point(0, 2), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.ngxChessBoardComponent));
    this.pieces.push(new Queen(new Point(0, 3), Color.BLACK, UnicodeConstants.BLACK_QUEEN, this.ngxChessBoardComponent));
    this.pieces.push(new King(new Point(0, 4), Color.BLACK, UnicodeConstants.BLACK_KING, this.ngxChessBoardComponent));
    this.pieces.push(new Bishop(new Point(0, 5), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.ngxChessBoardComponent));
    this.pieces.push(new Knight(new Point(0, 6), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.ngxChessBoardComponent));
    this.pieces.push(new Rook(new Point(0, 7), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.ngxChessBoardComponent));


    // piony biale
    for (let i = 0; i < 8; ++i) {
      this.pieces.push(new Pawn(new Point(6, i), Color.WHITE, UnicodeConstants.WHITE_PAWN, this.ngxChessBoardComponent));
    }
    this.pieces.push(new Rook(new Point(7, 0), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.ngxChessBoardComponent));
    this.pieces.push(new Knight(new Point(7, 1), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.ngxChessBoardComponent));
    this.pieces.push(new Bishop(new Point(7, 2), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.ngxChessBoardComponent));
    this.pieces.push(new Queen(new Point(7, 3), Color.WHITE, UnicodeConstants.WHITE_QUEEN, this.ngxChessBoardComponent));
    this.pieces.push(new King(new Point(7, 4), Color.WHITE, UnicodeConstants.WHITE_KING, this.ngxChessBoardComponent));
    this.pieces.push(new Bishop(new Point(7, 5), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.ngxChessBoardComponent));
    this.pieces.push(new Knight(new Point(7, 6), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.ngxChessBoardComponent));
    this.pieces.push(new Rook(new Point(7, 7), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.ngxChessBoardComponent));
  }

  isXYInPossibleMoves(row: number, col: number): boolean {
    return this.possibleMoves.some(e => e.row === row && e.col === col);
  }

  isXYInPossibleCaptures(row: number, col: number): boolean {
    return this.possibleCaptures.some(e => e.row === row && e.col === col);
  }

  isXYInSourceMove(i: number, j: number) {
    return this.lastMoveSrc && this.lastMoveSrc.row === i && this.lastMoveSrc.col === j;
  }

  isXYInDestMove(i: number, j: number) {
    return this.lastMoveDest && this.lastMoveDest.row === i && this.lastMoveDest.col === j;
  }

  isXYInActiveMove(i: number, j: number) {
    return this.activePiece && this.activePiece.point.row === i && this.activePiece.point.col === j;
  }

  isPointInPossibleMoves(point: Point): boolean {
    return this.possibleMoves.some(e => e.row === point.row && e.col === point.col);
  }

  isPointInPossibleCaptures(point: Point): boolean {
    return this.possibleCaptures.some(e => e.row === point.row && e.col === point.col);
  }

  reset() {
    this.addPieces();
    this.lastMoveDest = null;
    this.lastMoveSrc = null;
    this.whiteKingChecked = false;
    this.blackKingChecked = false;
    this.possibleCaptures = [];
    this.possibleMoves = [];
    this.activePiece = null;
    this.reverted = false;
    this.currentWhitePlayer = true;
    this.enPassantPoint = null;
    this.enPassantPiece = null;
  }

  reverse() {
    this.reverted = !this.reverted;
    this.ngxChessBoardComponent.selected = false;
    this.activePiece = null;
    this.possibleMoves = [];
    this.possibleCaptures = [];
    for (let i = 0; i < this.pieces.length; ++i) {
      this.reversePoint(this.pieces[i].point);
    }

    this.reversePoint(this.lastMoveSrc);

    if (this.enPassantPoint && this.enPassantPiece) {
      this.reversePoint(this.enPassantPoint);
    }
  }

  private reversePoint(point: Point) {
    if (point) {
      point.row = Math.abs(point.row - 7);
      point.col = Math.abs(point.col - 7);
    }
  }

}
