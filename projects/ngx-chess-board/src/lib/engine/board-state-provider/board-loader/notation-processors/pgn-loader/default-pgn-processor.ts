import { count } from 'rxjs/operators';
import { Board } from '../../../../../models/board';
import { Bishop } from '../../../../../models/pieces/bishop';
import { Color } from '../../../../../models/pieces/color';
import { King } from '../../../../../models/pieces/king';
import { Knight } from '../../../../../models/pieces/knight';
import { Pawn } from '../../../../../models/pieces/pawn';
import { Piece } from '../../../../../models/pieces/piece';
import { Point } from '../../../../../models/pieces/point';
import { Queen } from '../../../../../models/pieces/queen';
import { Rook } from '../../../../../models/pieces/rook';
import { MoveUtils } from '../../../../../utils/move-utils';
import { UnicodeConstants } from '../../../../../utils/unicode-constants';
import { NotationProcessor } from '../notation-processor';

export class DefaultPgnProcessor implements NotationProcessor {

    public process(notation: string, board: Board): void {
        if (notation) {
            let moves = this.extractMoves(notation);
            console.log(moves);
            let counter = 0;
            for (let move of moves) {
                let color = (counter === 0 || counter % 2 === 0)
                    ? Color.WHITE
                    : Color.BLACK;

                if (!move.includes('x') && !this.hasUpperCase(move) && !this.isShortCastle(
                    move)) { // zwykly ruch na wolne pole
                    console.log('FIRST');
                    let piece = MoveUtils.findPieceByPossibleMovesContaining(
                        move,
                        board,
                        color
                    )[0];
                    if (piece) {
                        this.movePiece(piece, board, move);
                    } else {
                    }
                } else {
                    if (this.hasUpperCase(move) && !this.isShortCastle(move) && !move.includes(
                        'x')) {// jezeli ma wielka litere, czyli trzeba odszukac ktora figura
                        console.log('SECOND');
                        let pieces = MoveUtils.findPieceByPossibleMovesContaining(
                            move.substring(1),
                            board,
                            color
                        );
                        let piece = pieces.find(piece => this.resolvePieceByFirstChar(
                            move.charAt(0),
                            piece
                        ));
                        console.log(piece);
                        if (piece) {
                            this.movePiece(piece, board, move.substring(1));
                        } else {
                        }
                    } else {
                        if (this.isShortCastle(move) && !move.includes('x')) {
                            let pieces = MoveUtils.findPieceByPossibleMovesContaining(
                                color === Color.WHITE ? 'g1' : 'g8',
                                board,
                                color
                            );

                            if (color === Color.WHITE) {
                                const rook = board.getPieceByField(
                                    7,
                                    7
                                );
                                const king = board.getPieceByField(
                                    7,
                                    4
                                );

                                rook.point.col = 5;
                                king.point.col = 6;
                            } else {
                                const rook = board.getPieceByField(
                                    0,
                                    7
                                );
                                const king = board.getPieceByField(
                                    0,
                                    4
                                );
                                rook.point.col = 5;
                                king.point.col = 6;
                            }
                        } else {
                            if (move.includes('x') && !this.hasUpperCase(move)) {
                                console.log(move + ' moveXXX');
                                let piece = MoveUtils.findPieceByPossibleCapturesContaining(
                                    move.substring(move.indexOf('x') + 1),
                                    board,
                                    color
                                )[0];
                                console.log(piece);
                                if (piece) {
                                    this.removePiece(move.substring(move.indexOf(
                                        'x') + 1), board);
                                    this.movePiece(piece, board, move.substring(move.indexOf('x') + 1));
                                } else {
                                    console.log('not found ' + move);
                                }
                            } else if (move.includes('x') && this.hasUpperCase(move)) {
                                console.log('ostatni' + move);
                                let piece = MoveUtils.findPieceByPossibleCapturesContaining(
                                    move.substring(move.indexOf('x') + 1),
                                    board,
                                    color
                                ).find(piece => this.resolvePieceByFirstChar(move[0], piece));
                                console.log(piece);
                                if (piece) {
                                    this.removePiece(move.substring(move.indexOf(
                                        'x') + 1), board);
                                    this.movePiece(piece, board, move.substring(move.indexOf('x') + 1));
                                } else {
                                    console.log('not found ' + move);
                                }
                            } else if (this.isLongCastle(move)) {
                                let pieces = MoveUtils.findPieceByPossibleMovesContaining(
                                    color === Color.WHITE ? 'c1' : 'c8',
                                    board,
                                    color
                                );

                                if (color === Color.WHITE) {
                                    const rook = board.getPieceByField(
                                        7,
                                        0
                                    );
                                    const king = board.getPieceByField(
                                        7,
                                        4
                                    );

                                    rook.point.col = 3;
                                    king.point.col = 2;
                                } else {
                                    const rook = board.getPieceByField(
                                        0,
                                        0
                                    );
                                    const king = board.getPieceByField(
                                        0,
                                        4
                                    );
                                    rook.point.col = 3;
                                    king.point.col = 2;
                                }

                            }
                        }
                    }
                }

                ++counter;
            }
        }
    }

    protected extractMoves(notation: string) {
        return notation.substring(notation.lastIndexOf(']') + 1)
            .replace(/[0-9]+\./g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ');
    }

    protected movePiece(piece: Piece, board: Board, move: string) {
        console.log(move);
        let indexes = MoveUtils.translateCoordsToIndex(move, board.reverted);
        piece.point.col = indexes.xAxis;
        piece.point.row = indexes.yAxis;
        console.log(indexes);
    }

    hasUpperCase(move: string) {
        return /[A-Z]/.test(move);
    }

    private resolvePieceByFirstChar(move: string, piece: Piece) {
        let piecesFirstChar = '';
        if (piece instanceof King) {
            piecesFirstChar = 'K';
        } else {
            if (piece instanceof Queen) {
                piecesFirstChar = 'Q';
            } else {
                if (piece instanceof Rook) {
                    piecesFirstChar = 'R';
                } else {
                    if (piece instanceof Bishop) {
                        piecesFirstChar = 'B';
                    } else {
                        if (piece instanceof Knight) {
                            piecesFirstChar = 'N';
                        } else {
                            if (piece instanceof Pawn) {
                                piecesFirstChar = 'P';
                            }
                        }
                    }
                }
            }
        }
        return move === piecesFirstChar;
    }

    private isShortCastle(move: string) {
        return move === 'O-O';
    }

    private removePiece(coords: string, board: Board) {
        let indexes = MoveUtils.translateCoordsToIndex(coords, board.reverted);

        board.pieces = board.pieces.filter(e => !e.point.isEqual(new Point(
            indexes.yAxis,
            indexes.xAxis
        )));
    }

    private isLongCastle(move: string) {
        return move === 'O-O-O';
    }
}
