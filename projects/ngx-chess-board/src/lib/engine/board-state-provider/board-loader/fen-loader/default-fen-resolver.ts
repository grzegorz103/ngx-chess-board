import { Board } from '../../../../models/board';
import { Bishop } from '../../../../models/pieces/bishop';
import { Color } from '../../../../models/pieces/color';
import { King } from '../../../../models/pieces/king';
import { Knight } from '../../../../models/pieces/knight';
import { Pawn } from '../../../../models/pieces/pawn';
import { Point } from '../../../../models/pieces/point';
import { Queen } from '../../../../models/pieces/queen';
import { Rook } from '../../../../models/pieces/rook';
import { UnicodeConstants } from '../../../../utils/unicode-constants';
import { AbstractFenResolver } from './abstract-fen-resolver';

export class DefaultFenResolver extends AbstractFenResolver {

    constructor(board: Board) {
        super(board);
    }

    public resolve(fen: string): void {
        console.log(fen);
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

        if(rook) {
            rook.isMovedAlready = true;
        }
    }

}
