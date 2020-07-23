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
import {cloneDeep} from 'lodash';

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

  constructor() {

    this.board = [];
    for (var i: number = 0; i < 8; ++i) {
      this.board[i] = [];
      for (var j: number = 0; j < 8; ++j) {
        this.board[i][j] = 0;
      }
    }
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

  clone(): Board {
    return cloneDeep(this);
  }

  isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return this.pieces.some(e => e.point.col === col && e.point.row === row && e.color === enemyColor);
  }

  isFieldEmpty(row: number, col: number): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return !this.pieces.some(e => e.point.col === col && e.point.row === row);
  }

  isFieldUnderAttack(row: number, col: number, color: Color) {
    let found = false;
    return this.pieces.filter(e => e.color === color).some(e => e.getCoveredFields().some(f => f.col === col && f.row === row));
  }

  getPieceByField(row: number, col: number): Piece {
    if (this.isFieldEmpty(row, col)) {
      //   throw new Error('Piece not found');
      return undefined;
    }

    return this.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  isKingInCheck(color: Color, piece: Piece[]): boolean {
    let king = piece
      .find(e => e.color === color && e instanceof King);

    if (king) {
      return piece.some(e => e.getPossibleCaptures().some(e => e.col === king.point.col && e.row === king.point.row) && e.color !== color);
    }
    return false;
  }

}
