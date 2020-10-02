import { Board } from '../models/board';
import { Bishop } from '../models/pieces/bishop';
import { Color } from '../models/pieces/color';
import { King } from '../models/pieces/king';
import { Knight } from '../models/pieces/knight';
import { Pawn } from '../models/pieces/pawn';
import { Point } from '../models/pieces/point';
import { Queen } from '../models/pieces/queen';
import { Rook } from '../models/pieces/rook';
import { UnicodeConstants } from '../utils/unicode-constants';

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

        this.board.calculateFEN();
    }

    loadFEN(fen: string) {
        if (fen) {
            this.board.reverted = false;
            this.board.pieces = [];
            const split = fen.split('/');
            for (let i = 0; i < 8; ++i) {
                let pointer = 0;
                for (let j = 0; j < 8; ++j) {
                    const chunk = split[i].charAt(j);
                    if (chunk.match(/[0-9]/)) {
                        pointer += Number(chunk);
                    } else {
                        switch (chunk) {
                            case 'r':
                                this.board.pieces.push(
                                    new Rook(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_ROOK,
                                        this.board
                                    )
                                );
                                break;
                            case 'n':
                                this.board.pieces.push(
                                    new Knight(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_KNIGHT,
                                        this.board
                                    )
                                );

                                break;
                            case 'b':
                                this.board.pieces.push(
                                    new Bishop(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_BISHOP,
                                        this.board
                                    )
                                );
                                break;
                            case 'q':
                                this.board.pieces.push(
                                    new Queen(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_QUEEN,
                                        this.board
                                    )
                                );
                                break;
                            case 'k':
                                this.board.pieces.push(
                                    new King(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_KING,
                                        this.board
                                    )
                                );
                                break;
                            case 'p': {
                                const pawn = new Pawn(
                                    new Point(i, pointer),
                                    Color.BLACK,
                                    UnicodeConstants.BLACK_PAWN,
                                    this.board
                                );
                                if (
                                    (pawn.color === Color.BLACK && pawn.point.row !== 1) ||
                                    (pawn.color === Color.WHITE && pawn.point.row !== 6)
                                ) {
                                    pawn.isMovedAlready = true;
                                }
                                this.board.pieces.push(pawn);
                                break;
                            }
                            case 'R':
                                this.board.pieces.push(
                                    new Rook(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_ROOK,
                                        this.board
                                    )
                                );

                                break;
                            case 'N':
                                this.board.pieces.push(
                                    new Knight(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_KNIGHT,
                                        this.board
                                    )
                                );
                                break;

                            case 'B':
                                this.board.pieces.push(
                                    new Bishop(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_BISHOP,
                                        this.board
                                    )
                                );
                                break;

                            case 'Q':
                                this.board.pieces.push(
                                    new Queen(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_QUEEN,
                                        this.board
                                    )
                                );
                                break;

                            case 'K':
                                this.board.pieces.push(
                                    new King(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_KING,
                                        this.board
                                    )
                                );
                                break;

                            case 'P': {
                                const pawn = new Pawn(
                                    new Point(i, pointer),
                                    Color.WHITE,
                                    UnicodeConstants.WHITE_PAWN,
                                    this.board
                                );
                                if (
                                    (pawn.color === Color.BLACK && pawn.point.row !== 1) ||
                                    (pawn.color === Color.WHITE && pawn.point.row !== 6)
                                ) {
                                    pawn.isMovedAlready = true;
                                }
                                this.board.pieces.push(pawn);
                                break;
                            }
                        }
                        ++pointer;
                    }
                }
            }

            this.setCurrentPlayer(fen);
            this.setCastles(fen);
            this.setEnPassant(fen);
            this.setFullMoveCount(fen);
        } else {
            throw Error('Incorrect FEN provided');
        }
    }

    setBoard(board: Board) {
        this.board = board;
    }

    private setCurrentPlayer(fen: string) {
        if (fen) {
            const split = fen.split(' ');
            this.board.currentWhitePlayer = split[1] === 'w';
        }
    }

    private setCastles(fen: string) {
        if (fen) {
            const split = fen.split(' ');
            const castleChunk = split[2];

            if (!castleChunk.includes('K')) {
                this.setRookAlreadyMoved(Color.WHITE, 7);
            }

            if (!castleChunk.includes('Q')) {
                this.setRookAlreadyMoved(Color.WHITE, 0);
            }

            if (!castleChunk.includes('k')) {
                this.setRookAlreadyMoved(Color.BLACK, 7);
            }

            if (!castleChunk.includes('q')) {
                this.setRookAlreadyMoved(Color.BLACK, 0);
            }
        }
    }

    private setFullMoveCount(fen: string) {}

    private setEnPassant(fen: string) {
        if (fen) {
            const split = fen.split(' ');
            const enPassantPoint = split[3];

            if (enPassantPoint === '-') {
                return;
            }

            // if()
        }
    }

    private setRookAlreadyMoved(color: Color, col: number) {
        const rook = this.board.pieces.find(
            (piece) => piece.color === color && piece instanceof Rook && piece.point.col === col
        ) as Rook;
        rook.isMovedAlready = true;
    }
}
