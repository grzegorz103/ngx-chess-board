import { Board } from '../../../models/board';
import { Bishop } from '../../../models/pieces/bishop';
import { Color } from '../../../models/pieces/color';
import { King } from '../../../models/pieces/king';
import { Knight } from '../../../models/pieces/knight';
import { Pawn } from '../../../models/pieces/pawn';
import { Point } from '../../../models/pieces/point';
import { Queen } from '../../../models/pieces/queen';
import { Rook } from '../../../models/pieces/rook';
import { UnicodeConstants } from '../../../utils/unicode-constants';
import { AbstractFenResolver } from './fen-loader/abstract-fen-resolver';
import { FenResolverFactory } from './fen-loader/fen-resolver-factory';

export class BoardLoader {

    private board: Board;
    private fenResolver: AbstractFenResolver;

    constructor(board: Board, fenResolver?: AbstractFenResolver) {
        this.board = board;

        if (fenResolver) {
            this.fenResolver = fenResolver;
        } else {
            this.fenResolver = FenResolverFactory.getFenResolver(board);
        }
    }

    addPieces() {
        this.board.pieces = [];
        // piony czarne
        for (let i = 0; i < 8; ++i) {
            this.board.pieces.push(new Pawn(
                new Point(1, i),
                Color.BLACK,
                UnicodeConstants.BLACK_PAWN,
                this.board
            ));
        }
        this.board.pieces.push(new Rook(
            new Point(0, 0),
            Color.BLACK,
            UnicodeConstants.BLACK_ROOK,
            this.board
        ));
        this.board.pieces.push(new Knight(
            new Point(0, 1),
            Color.BLACK,
            UnicodeConstants.BLACK_KNIGHT,
            this.board
        ));
        this.board.pieces.push(new Bishop(
            new Point(0, 2),
            Color.BLACK,
            UnicodeConstants.BLACK_BISHOP,
            this.board
        ));
        this.board.pieces.push(new Queen(
            new Point(0, 3),
            Color.BLACK,
            UnicodeConstants.BLACK_QUEEN,
            this.board
        ));
        this.board.pieces.push(new King(
            new Point(0, 4),
            Color.BLACK,
            UnicodeConstants.BLACK_KING,
            this.board
        ));
        this.board.pieces.push(new Bishop(
            new Point(0, 5),
            Color.BLACK,
            UnicodeConstants.BLACK_BISHOP,
            this.board
        ));
        this.board.pieces.push(new Knight(
            new Point(0, 6),
            Color.BLACK,
            UnicodeConstants.BLACK_KNIGHT,
            this.board
        ));
        this.board.pieces.push(new Rook(
            new Point(0, 7),
            Color.BLACK,
            UnicodeConstants.BLACK_ROOK,
            this.board
        ));

        // piony biale
        for (let i = 0; i < 8; ++i) {
            this.board.pieces.push(new Pawn(
                new Point(6, i),
                Color.WHITE,
                UnicodeConstants.WHITE_PAWN,
                this.board
            ));
        }
        this.board.pieces.push(new Rook(
            new Point(7, 0),
            Color.WHITE,
            UnicodeConstants.WHITE_ROOK,
            this.board
        ));
        this.board.pieces.push(new Knight(
            new Point(7, 1),
            Color.WHITE,
            UnicodeConstants.WHITE_KNIGHT,
            this.board
        ));
        this.board.pieces.push(new Bishop(
            new Point(7, 2),
            Color.WHITE,
            UnicodeConstants.WHITE_BISHOP,
            this.board
        ));
        this.board.pieces.push(new Queen(
            new Point(7, 3),
            Color.WHITE,
            UnicodeConstants.WHITE_QUEEN,
            this.board
        ));
        this.board.pieces.push(new King(
            new Point(7, 4),
            Color.WHITE,
            UnicodeConstants.WHITE_KING,
            this.board
        ));
        this.board.pieces.push(new Bishop(
            new Point(7, 5),
            Color.WHITE,
            UnicodeConstants.WHITE_BISHOP,
            this.board
        ));
        this.board.pieces.push(new Knight(
            new Point(7, 6),
            Color.WHITE,
            UnicodeConstants.WHITE_KNIGHT,
            this.board
        ));
        this.board.pieces.push(new Rook(
            new Point(7, 7),
            Color.WHITE,
            UnicodeConstants.WHITE_ROOK,
            this.board
        ));

        this.board.calculateFEN();
    }

    loadFEN(fen: string) {
        this.fenResolver.resolve(fen);
    }

    setBoard(board: Board) {
        this.board = board;
    }

    setFenResolver(fenResolver: AbstractFenResolver) {
        this.fenResolver = fenResolver;
    }

}
