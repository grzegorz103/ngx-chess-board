import {Point} from './pieces/point';
import {Color} from './pieces/color';
import {King} from './pieces/king';
import {Piece} from './pieces/piece';
import {cloneDeep} from 'lodash';
import {Rook} from './pieces/rook';
import {Knight} from './pieces/knight';
import {Bishop} from './pieces/bishop';
import {Queen} from './pieces/queen';
import {Pawn} from './pieces/pawn';

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
  possibleMoves: Point[] = [];
  whiteKingChecked: boolean;

  currentWhitePlayer = true;
  reverted: boolean = false;
  fullMoveCount: number = 1;
  fen: string;

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
    this.fullMoveCount = 1;
    this.calculateFEN();
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

  getKingByColor(color: Color): King {
    return <King> this.pieces.find(e => (e instanceof King) && e.color === color);
  }

  getCastleFENString(color: Color) {
    let king = this.getKingByColor(color);

    if (king.isMovedAlready) {
      return '';
    }

    let fen = '';
    let leftRook = this.getPieceByField(king.point.row, 0);
    let rightRook = this.getPieceByField(king.point.row, 7);

    if (rightRook instanceof Rook && rightRook.color === color) {
      if (!rightRook.isMovedAlready) {
        fen += this.reverted ? 'q' : 'k';
      }
    }

    if (leftRook instanceof Rook && leftRook.color === color) {
      if (!leftRook.isMovedAlready) {
        fen += this.reverted ? 'k' : 'q';
      }
    }

    fen = fen.split('').sort().join("");
    return color === Color.BLACK ? fen : fen.toUpperCase();
  }

  getEnPassantFENString() {
    if (this.enPassantPoint) {
      if (this.reverted) {
        return String.fromCharCode(104 - this.enPassantPoint.col) + (this.enPassantPoint.row + 1);
      } else {
        return String.fromCharCode(97 + this.enPassantPoint.col) + (Math.abs(this.enPassantPoint.row - 7) + 1);
      }
    } else {
      return '-';
    }
  }


  calculateFEN() {
    let fen = '';
    for (let i = 0; i < 8; ++i) {
      let emptyFields = 0;
      for (let j = 0; j < 8; ++j) {
        let piece = this.pieces.find(e => e.point.col === j && e.point.row === i);
        if (piece) {
          if (emptyFields > 0) {
            fen += emptyFields;
            emptyFields = 0;
          }

          if (piece instanceof Rook) {
            fen += piece.color === Color.BLACK ? 'r' : 'R';
          } else if (piece instanceof Knight) {
            fen += piece.color === Color.BLACK ? 'n' : 'N';
          } else if (piece instanceof Bishop) {
            fen += piece.color === Color.BLACK ? 'b' : 'B';
          } else if (piece instanceof Queen) {
            fen += piece.color === Color.BLACK ? 'q' : 'Q';
          } else if (piece instanceof King) {
            fen += piece.color === Color.BLACK ? 'k' : 'K';
          } else if (piece instanceof Pawn) {
            fen += piece.color === Color.BLACK ? 'p' : 'P';
          }
        } else {
          ++emptyFields;
        }
      }

      if (emptyFields > 0) {
        fen += emptyFields;
      }

      fen += '/';
    }

    fen = fen.substr(0, fen.length - 1);

    if (this.reverted) {
      fen = fen.split('').reverse().join('');
    }

    fen += (' ' + (this.currentWhitePlayer ? 'w' : 'b'));
    let whiteEnPassant = this.getCastleFENString(Color.WHITE);
    let blackEnPassant = this.getCastleFENString(Color.BLACK);
    let concatedEnPassant = whiteEnPassant + blackEnPassant;
    if (!concatedEnPassant) {
      concatedEnPassant = '-';
    }

    fen += (' ' + concatedEnPassant);
    fen += (' ' + (this.getEnPassantFENString()));
    fen += ' ' + 0;
    fen += ' ' + this.fullMoveCount;
    this.fen = fen;
  }

}
