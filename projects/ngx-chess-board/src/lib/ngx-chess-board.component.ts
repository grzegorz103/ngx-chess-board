import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Piece} from './pieces/piece';
import {Color} from './pieces/color';
import {King} from './pieces/king';
import {UnicodeConstants} from './utils/unicode-constants';
import {Point} from './pieces/point';
import {Bishop} from './pieces/bishop';
import {Knight} from './pieces/knight';
import {Rook} from './pieces/rook';
import {Queen} from './pieces/queen';
import {Pawn} from './pieces/pawn';


@Component({
  selector: 'ngx-chess-board',
  templateUrl: './ngx-chess-board.component.html',
  styleUrls: ['./ngx-chess-board.component.scss']
})
export class NgxChessBoardComponent implements OnInit {

  @Input('size')
  size: number = 400;

  board: number[][];
  pieceSize: number;
  static pieces: Piece[] = [];
  selected = false;

  @ViewChild('boardRef', {static: false}) boardRef: ElementRef;
  private activePiece: Piece;
  private blackKingChecked: boolean;
  private possibleCaptures: any[] = [];
  private possibleMoves: any[] = [];
  private whiteKingChecked: boolean;

  private currentWhitePlayer = true;

  constructor() {
    this.board = [];
    for (var i: number = 0; i < 8; ++i) {
      this.board[i] = [];
      for (var j: number = 0; j < 8; ++j) {
        this.board[i][j] = 0;
      }
    }

    this.addPieces();
  }

  ngOnInit() {
    this.pieceSize = this.size / 8;
  }

  async onMouseDown(event) {

    let pointClicked = this.getClickPoint(event);
    if (this.selected) {
      //   this.possibleMoves = activePiece.getPossibleMoves();
      if (this.isPointInPossibleMoves(pointClicked) || this.isPointInPossibleCaptures(pointClicked)) {
        await this.movePiece(this.activePiece, pointClicked);
        this.checkIfPawnFirstMove(this.activePiece);
        this.checkIfRookMoved(this.activePiece);
        this.checkIfKingMoved(this.activePiece);

        if (!this.currentWhitePlayer && this.isKingInCheck(Color.BLACK, NgxChessBoardComponent.pieces)) {
          this.blackKingChecked = true;
        }

        if (this.currentWhitePlayer && this.isKingInCheck(Color.WHITE, NgxChessBoardComponent.pieces)) {
          this.whiteKingChecked = true;
        }

      }
      this.selected = false;
      this.possibleCaptures = [];
      this.possibleMoves = [];
    } else {
      let pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
      if (pieceClicked) {

        if ((this.currentWhitePlayer && pieceClicked.color === Color.BLACK) || (!this.currentWhitePlayer && pieceClicked.color === Color.WHITE)) {
          return;
        }
        this.activePiece = pieceClicked;
        this.selected = true;
        this.possibleCaptures = pieceClicked.getPossibleCaptures().filter(e => !this.willMoveCauseCheck(this.currentWhitePlayer ? Color.WHITE : Color.BLACK, pieceClicked.point.row, pieceClicked.point.col, e.row, e.col));
        this.possibleMoves = pieceClicked.getPossibleMoves().filter(e => !this.willMoveCauseCheck(this.currentWhitePlayer ? Color.WHITE : Color.BLACK, pieceClicked.point.row, pieceClicked.point.col, e.row, e.col));
      }
    }
  }

  getPieceByPoint(row: number, col: number): Piece {
    row = Math.floor(row);
    col = Math.floor(col);
    return NgxChessBoardComponent.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  isKingChecked(piece: Piece) {
    if (piece instanceof King) {
      return piece.color === Color.WHITE ? this.whiteKingChecked : this.blackKingChecked;
    }
  }

  isXYInPossibleMoves(row: number, col: number): boolean {
    return this.possibleMoves.some(e => e.row === row && e.col === col);
  }

  isXYInPossibleCaptures(row: number, col: number): boolean {
    return this.possibleCaptures.some(e => e.row === row && e.col === col);
  }

  static isFieldEmpty(row: number, col: number): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return !NgxChessBoardComponent.pieces.some(e => e.point.col === col && e.point.row === row);
  }

  static isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return NgxChessBoardComponent.pieces.some(e => e.point.col === col && e.point.row === row && e.color === enemyColor);
  }


  static isFieldUnderAttack(row: number, col: number, color: Color) {
    let found = false;
    return NgxChessBoardComponent.pieces.filter(e => e.color === color).some(e => e.getCoveredFields().some(f => f.col === col && f.row === row));
  }

  static getPieceByField(row: number, col: number): Piece {
    if (NgxChessBoardComponent.isFieldEmpty(row, col)) {
      //   throw new Error('Piece not found');
      return undefined;
    }

    return NgxChessBoardComponent.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  private addPieces() {
    NgxChessBoardComponent.pieces = [];
    // piony czarne
    for (let i = 0; i < 8; ++i) {
      NgxChessBoardComponent.pieces.push(new Pawn(new Point(1, i), Color.BLACK, UnicodeConstants.BLACK_PAWN));
    }
    NgxChessBoardComponent.pieces.push(new Rook(new Point(0, 0), Color.BLACK, UnicodeConstants.BLACK_ROOK));
    NgxChessBoardComponent.pieces.push(new Knight(new Point(0, 1), Color.BLACK, UnicodeConstants.BLACK_KNIGHT));
    NgxChessBoardComponent.pieces.push(new Bishop(new Point(0, 2), Color.BLACK, UnicodeConstants.BLACK_BISHOP));
    NgxChessBoardComponent.pieces.push(new Queen(new Point(0, 3), Color.BLACK, UnicodeConstants.BLACK_QUEEN));
    NgxChessBoardComponent.pieces.push(new King(new Point(0, 4), Color.BLACK, UnicodeConstants.BLACK_KING));
    NgxChessBoardComponent.pieces.push(new Bishop(new Point(0, 5), Color.BLACK, UnicodeConstants.BLACK_BISHOP));
    NgxChessBoardComponent.pieces.push(new Knight(new Point(0, 6), Color.BLACK, UnicodeConstants.BLACK_KNIGHT));
    NgxChessBoardComponent.pieces.push(new Rook(new Point(0, 7), Color.BLACK, UnicodeConstants.BLACK_ROOK));


    // piony biale
    for (let i = 0; i < 8; ++i) {
      NgxChessBoardComponent.pieces.push(new Pawn(new Point(6, i), Color.WHITE, UnicodeConstants.WHITE_PAWN));
    }
    NgxChessBoardComponent.pieces.push(new Rook(new Point(7, 0), Color.WHITE, UnicodeConstants.WHITE_ROOK));
    NgxChessBoardComponent.pieces.push(new Knight(new Point(7, 1), Color.WHITE, UnicodeConstants.WHITE_KNIGHT));
    NgxChessBoardComponent.pieces.push(new Bishop(new Point(7, 2), Color.WHITE, UnicodeConstants.WHITE_BISHOP));
    NgxChessBoardComponent.pieces.push(new Queen(new Point(7, 3), Color.WHITE, UnicodeConstants.WHITE_QUEEN));
    NgxChessBoardComponent.pieces.push(new King(new Point(7, 4), Color.WHITE, UnicodeConstants.WHITE_KING));
    NgxChessBoardComponent.pieces.push(new Bishop(new Point(7, 5), Color.WHITE, UnicodeConstants.WHITE_BISHOP));
    NgxChessBoardComponent.pieces.push(new Knight(new Point(7, 6), Color.WHITE, UnicodeConstants.WHITE_KNIGHT));
    NgxChessBoardComponent.pieces.push(new Rook(new Point(7, 7), Color.WHITE, UnicodeConstants.WHITE_ROOK));


  }

  getClickPoint(event) {
    return new Point(
      Math.floor((event.y - this.boardRef.nativeElement.getBoundingClientRect().top) / (this.boardRef.nativeElement.getBoundingClientRect().height / 8)),
      Math.floor((event.x - this.boardRef.nativeElement.getBoundingClientRect().left) / (this.boardRef.nativeElement.getBoundingClientRect().width / 8)));
  }

  isPointInPossibleMoves(point: Point): boolean {
    return this.possibleMoves.some(e => e.row === point.row && e.col === point.col);
  }

  isPointInPossibleCaptures(point: Point): boolean {
    return this.possibleCaptures.some(e => e.row === point.row && e.col === point.col);
  }

  async movePiece(piece: Piece, newPoint: Point) {
    let destPiece = NgxChessBoardComponent.pieces.find(e => e.point.col === newPoint.col && e.point.row === newPoint.row);

    if (destPiece && piece.color != destPiece.color) {
      NgxChessBoardComponent.pieces = NgxChessBoardComponent.pieces.filter(e => e !== destPiece);
    } else if (destPiece && piece.color === destPiece.color) {
      return;
    }
    if (piece instanceof King) {
      let squaresMoved = Math.abs(newPoint.col - piece.point.col);
      if (squaresMoved > 1) {
        if (newPoint.col < 3) {
          let leftRook = NgxChessBoardComponent.getPieceByField(piece.point.row, 0);
          leftRook.point.col = 3;
        } else {
          let rightRook = NgxChessBoardComponent.getPieceByField(piece.point.row, 7);
          rightRook.point.col = 5;
        }
      }
    }
    piece.point = newPoint;
    this.currentWhitePlayer = !this.currentWhitePlayer;
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

  public willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number) {
    let tempBoard = NgxChessBoardComponent.pieces;
    /*  NgxChessBoardComponent.pieces = NgxChessBoardComponent.pieces.filter(piece =>
        (piece.point.col !== col) || (piece.point.row !== row)
      );*/
    let srcPiece = NgxChessBoardComponent.getPieceByField(row, col);
    let destPiece = NgxChessBoardComponent.getPieceByField(destRow, destCol);

    if (srcPiece) {
      srcPiece.point.row = destRow;
      srcPiece.point.col = destCol;
    }

    if (destPiece) {
      NgxChessBoardComponent.pieces = NgxChessBoardComponent.pieces.filter(e => e !== destPiece);
    }
    let isBound = this.isKingInCheck(currentColor, NgxChessBoardComponent.pieces);

    if (srcPiece) {
      srcPiece.point.col = col;
      srcPiece.point.row = row;
    }

    if (destPiece) {
      NgxChessBoardComponent.pieces.push(destPiece);
    }

    return isBound;
  }

  async checkForPawnPromote(piece: Piece) {
    if (!(piece instanceof Pawn)) {
      return;
    }

    if (piece.color === Color.WHITE && piece.point.row === 0) {
      return this.openPromoteDialog(piece);
    } else if (piece.color === Color.BLACK && piece.point.row === 7) {
      NgxChessBoardComponent.pieces = NgxChessBoardComponent.pieces.filter(e => e !== piece);
      NgxChessBoardComponent.pieces.push(new Queen(piece.point, Color.BLACK, 'queen-black.png'));
    }
  }

  async openPromoteDialog(piece: Piece) {

  }

}
