import {Pawn} from '../models/pieces/pawn';
import {Point} from '../models/pieces/point';
import {Color} from '../models/pieces/color';
import {UnicodeConstants} from '../utils/unicode-constants';
import {Rook} from '../models/pieces/rook';
import {Knight} from '../models/pieces/knight';
import {Bishop} from '../models/pieces/bishop';
import {Queen} from '../models/pieces/queen';
import {King} from '../models/pieces/king';
import {Board} from '../models/board';

export class BoardLoader {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  addPieces() {
    this.board.pieces = [];
    // piony czarne
    for (let i = 0; i < 8; ++i) {
      this.board.pieces.push(new Pawn(new Point(1, i), Color.BLACK, UnicodeConstants.BLACK_PAWN, this.board));
    }
    this.board.pieces.push(new Rook(new Point(0, 0), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.board));
    this.board.pieces.push(new Knight(new Point(0, 1), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.board));
    this.board.pieces.push(new Bishop(new Point(0, 2), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.board));
    this.board.pieces.push(new Queen(new Point(0, 3), Color.BLACK, UnicodeConstants.BLACK_QUEEN, this.board));
    this.board.pieces.push(new King(new Point(0, 4), Color.BLACK, UnicodeConstants.BLACK_KING, this.board));
    this.board.pieces.push(new Bishop(new Point(0, 5), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.board));
    this.board.pieces.push(new Knight(new Point(0, 6), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.board));
    this.board.pieces.push(new Rook(new Point(0, 7), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.board));


    // piony biale
    for (let i = 0; i < 8; ++i) {
      this.board.pieces.push(new Pawn(new Point(6, i), Color.WHITE, UnicodeConstants.WHITE_PAWN, this.board));
    }
    this.board.pieces.push(new Rook(new Point(7, 0), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.board));
    this.board.pieces.push(new Knight(new Point(7, 1), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.board));
    this.board.pieces.push(new Bishop(new Point(7, 2), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.board));
    this.board.pieces.push(new Queen(new Point(7, 3), Color.WHITE, UnicodeConstants.WHITE_QUEEN, this.board));
    this.board.pieces.push(new King(new Point(7, 4), Color.WHITE, UnicodeConstants.WHITE_KING, this.board));
    this.board.pieces.push(new Bishop(new Point(7, 5), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.board));
    this.board.pieces.push(new Knight(new Point(7, 6), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.board));
    this.board.pieces.push(new Rook(new Point(7, 7), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.board));
  }

  loadFEN(fen: string) {
    if (fen) {
      this.board.pieces = [];
      let split = fen.split('/');
      console.log(split.length);
      for (let i = 0; i < split.length; ++i) {
        let pointer = 0;
        console.log(split[i].length);
        for (let j = 0; j < split[i].length; ++j) {
          let chunk = split[i].charAt(j);
          if (chunk.match(/[0-9]/)) {
            pointer += Number(chunk);
          } else {
            switch (chunk) {
              case 'r':
                this.board.pieces.push(new Rook(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.board));
                break;
              case 'n':
                this.board.pieces.push(new Knight(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.board));

                break;
              case 'b':
                this.board.pieces.push(new Bishop(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.board));
                break;
              case 'q':
                this.board.pieces.push(new Queen(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_QUEEN, this.board));
                break;
              case 'k':
                this.board.pieces.push(new King(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_KING, this.board));
                break;
              case 'p':
                this.board.pieces.push(new Pawn(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_PAWN, this.board));
                break;
              case 'R':
                this.board.pieces.push(new Rook(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.board));

                break;
              case 'N':
                this.board.pieces.push(new Knight(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.board));
                break;

              case 'B':
                this.board.pieces.push(new Bishop(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.board));
                break;

              case 'Q':
                this.board.pieces.push(new Queen(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_QUEEN, this.board));
                break;

              case 'K':
                this.board.pieces.push(new King(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_KING, this.board));
                break;

              case 'P':
                this.board.pieces.push(new Pawn(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_PAWN, this.board));
                break;
            }
            ++pointer;
          }
        }
      }
    }
  }

}
