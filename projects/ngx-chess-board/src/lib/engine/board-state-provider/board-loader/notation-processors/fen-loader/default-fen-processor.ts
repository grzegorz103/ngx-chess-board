import { Board } from '../../../../../models/board';
import { Bishop } from '../../../../../models/pieces/bishop';
import { Color } from '../../../../../models/pieces/color';
import { King } from '../../../../../models/pieces/king';
import { Knight } from '../../../../../models/pieces/knight';
import { Pawn } from '../../../../../models/pieces/pawn';
import { Point } from '../../../../../models/pieces/point';
import { Queen } from '../../../../../models/pieces/queen';
import { Rook } from '../../../../../models/pieces/rook';
import { UnicodeConstants } from '../../../../../utils/unicode-constants';
import { NotationProcessor } from '../notation-processor';

export class DefaultFenProcessor implements NotationProcessor {

    public process(notation: string, board: Board): void {
        let fen = notation;
        if (notation) {
            board.reverted = false;
            board.pieces = [];
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
                                board.pieces.push(
                                    new Rook(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_ROOK,
                                        board
                                    )
                                );
                                break;
                            case 'n':
                                board.pieces.push(
                                    new Knight(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_KNIGHT,
                                        board
                                    )
                                );

                                break;
                            case 'b':
                                board.pieces.push(
                                    new Bishop(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_BISHOP,
                                        board
                                    )
                                );
                                break;
                            case 'q':
                                board.pieces.push(
                                    new Queen(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_QUEEN,
                                        board
                                    )
                                );
                                break;
                            case 'k':
                                board.pieces.push(
                                    new King(
                                        new Point(i, pointer),
                                        Color.BLACK,
                                        UnicodeConstants.BLACK_KING,
                                        board
                                    )
                                );
                                break;
                            case 'p': {
                                const pawn = new Pawn(
                                    new Point(i, pointer),
                                    Color.BLACK,
                                    UnicodeConstants.BLACK_PAWN,
                                    board
                                );
                                if (
                                    (pawn.color === Color.BLACK && pawn.point.row !== 1) ||
                                    (pawn.color === Color.WHITE && pawn.point.row !== 6)
                                ) {
                                    pawn.isMovedAlready = true;
                                }
                                board.pieces.push(pawn);
                                break;
                            }
                            case 'R':
                                board.pieces.push(
                                    new Rook(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_ROOK,
                                        board
                                    )
                                );

                                break;
                            case 'N':
                                board.pieces.push(
                                    new Knight(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_KNIGHT,
                                        board
                                    )
                                );
                                break;

                            case 'B':
                                board.pieces.push(
                                    new Bishop(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_BISHOP,
                                        board
                                    )
                                );
                                break;

                            case 'Q':
                                board.pieces.push(
                                    new Queen(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_QUEEN,
                                        board
                                    )
                                );
                                break;

                            case 'K':
                                board.pieces.push(
                                    new King(
                                        new Point(i, pointer),
                                        Color.WHITE,
                                        UnicodeConstants.WHITE_KING,
                                        board
                                    )
                                );
                                break;

                            case 'P': {
                                const pawn = new Pawn(
                                    new Point(i, pointer),
                                    Color.WHITE,
                                    UnicodeConstants.WHITE_PAWN,
                                    board
                                );
                                if (
                                    (pawn.color === Color.BLACK && pawn.point.row !== 1) ||
                                    (pawn.color === Color.WHITE && pawn.point.row !== 6)
                                ) {
                                    pawn.isMovedAlready = true;
                                }
                                board.pieces.push(pawn);
                                break;
                            }
                        }
                        ++pointer;
                    }
                }
            }

            this.setCurrentPlayer(board, fen);
            this.setCastles(board, fen);
            this.setEnPassant(fen);
            this.setFullMoveCount(fen);
            board.fen = fen;
        } else {
            throw Error('Incorrect FEN provided');
        }
    }


    private setCurrentPlayer(board: Board, fen: string) {
        if (fen) {
            const split = fen.split(' ');
            board.currentWhitePlayer = split[1] === 'w';
        }
    }

    private setCastles(board: Board, fen: string) {
        if (fen) {
            const split = fen.split(' ');
            const castleChunk = split[2];

            if (!castleChunk.includes('K')) {
                this.setRookAlreadyMoved(board, Color.WHITE, 7);
            }

            if (!castleChunk.includes('Q')) {
                this.setRookAlreadyMoved(board, Color.WHITE, 0);
            }

            if (!castleChunk.includes('k')) {
                this.setRookAlreadyMoved(board, Color.BLACK, 7);
            }

            if (!castleChunk.includes('q')) {
                this.setRookAlreadyMoved(board, Color.BLACK, 0);
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

    private setRookAlreadyMoved(board: Board, color: Color, col: number) {
        const rook = board.pieces.find(
            (piece) => piece.color === color && piece instanceof Rook && piece.point.col === col
        ) as Rook;

        if (rook) {
            rook.isMovedAlready = true;
        }
    }

}
