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
import { AbstractEngineFacade } from '../../../../abstract-engine-facade';
import { DefaultPiecesLoader } from '../../default-pieces-loader';
import { NotationProcessor } from '../notation-processor';

export class DefaultPgnProcessor implements NotationProcessor {

    public process(notation: string, engineFacade: AbstractEngineFacade): void {
        if (notation) {
            engineFacade.board.reverted = false;
            engineFacade.board.pieces = [];
            engineFacade.reset();
            DefaultPiecesLoader.loadDefaultPieces(engineFacade.board);
            let moves = this.extractMoves(notation);
            let counter = -1;
            for (let move of moves) {
                ++counter;
                move = move.replace(/[+#]/g, '');
                let promotionIndex = '';

                if (move.includes('=')) {
                    promotionIndex = this.resolvePromotion(move.substring(move.length - 1));
                    move = move.substring(0, move.length - 2);
                }

                let color = (counter === 0 || counter % 2 === 0)
                    ? Color.WHITE
                    : Color.BLACK;

                if (/^[a-z]\d$/g.test(move)) { // zwykly ruch na wolne pole e4
                    let piece = MoveUtils.findPieceByPossibleMovesContaining(
                        move,
                        engineFacade.board,
                        color
                    ).find(piece => piece instanceof Pawn);

                    // en passant check
                    if (!piece) {
                        piece = MoveUtils.findPieceByPossibleCapturesContaining(
                            move, engineFacade.board, color
                        ).find(piece => piece instanceof Pawn);
                    }

                    // if piece is found for sure
                    if (piece) {
                        engineFacade.move(MoveUtils.formatSingle(
                            piece.point,
                            false
                        ) + move + promotionIndex);
                    }
                } else {
                    if (/^[A-Z][a-h]\d$/g.test(move)) {// jezeli ma wielka litere, czyli trzeba odszukac ktora figura Nf3
                        let pieces = MoveUtils.findPieceByPossibleMovesContaining(
                            move.substring(1),
                            engineFacade.board,
                            color
                        );
                        let piece = pieces.find(piece => this.resolvePieceByFirstChar(
                            move.charAt(0),
                            piece
                        ));
                        if (piece) {
                            engineFacade.move(MoveUtils.formatSingle(
                                piece.point,
                                false
                            ) + move.substring(1) + promotionIndex);
                        } else {
                        }
                    } else {
                        if ('O-O' === move) {
                            engineFacade.move(color === Color.WHITE ? 'e1g1' : 'e8g8');
                        } else {
                            if (/^[a-z]x[a-z]\d$/g.test(move)) { //exd5
                                let pieces = MoveUtils.findPieceByPossibleCapturesContaining(
                                    move.substring(move.indexOf('x') + 1),
                                    engineFacade.board,
                                    color
                                ).filter(piece => piece instanceof Pawn);

                                let piece;
                                if (pieces.length > 1) {
                                    piece = this.resolveByCol(
                                        pieces,
                                        move.substring(0, 1)
                                    );
                                } else {
                                    piece = pieces[0];
                                }

                                if (piece) {
                                    engineFacade.move(MoveUtils.formatSingle(
                                        piece.point,
                                        false
                                    ) + move.substring(move.indexOf('x') + 1) + promotionIndex);
                                } else {
                                }
                            } else {
                                if (/^[A-Z]x[a-z]\d$/g.test(move)) {
                                    let piece = MoveUtils.findPieceByPossibleCapturesContaining(
                                        move.substring(move.indexOf('x') + 1),
                                        engineFacade.board,
                                        color
                                    ).find(piece => this.resolvePieceByFirstChar(
                                        move.substring(0, 1),
                                        piece
                                    ));
                                    if (piece) {
                                        engineFacade.move(MoveUtils.formatSingle(
                                            piece.point,
                                            false
                                        ) + move.substring(move.indexOf('x') + 1) + promotionIndex);
                                    } else {
                                    }
                                } else {
                                    if (move === 'O-O-O') {
                                        engineFacade.move(color === Color.WHITE ? 'e1c1' : 'e8c8');
                                    } else {
                                        if (/^[A-Z]\dx[a-z]\d$/g.test(move)) {  //Ngxe4 sytuacja 2 skoczkow pion bicie
                                            let pieces = MoveUtils.findPieceByPossibleCapturesContaining(
                                                move.substring(move.indexOf('x') + 1),
                                                engineFacade.board,
                                                color
                                            ).filter(piece => this.resolvePieceByFirstChar(
                                                move.charAt(0),
                                                piece
                                            ));

                                            let piece = this.resolveByRow(
                                                pieces,
                                                move.substring(1, 2)
                                            );

                                            if (piece) {
                                                engineFacade.move(MoveUtils.formatSingle(
                                                    piece.point,
                                                    false
                                                ) + move.substring(move.indexOf(
                                                    'x') + 1) + promotionIndex);
                                            }
                                        } else {
                                            if (/^[A-Z][a-z][a-z]\d$/g.test(move)) { // dwie wieze bez bicia Rac1 pion
                                                let pieces = MoveUtils.findPieceByPossibleMovesContaining(
                                                    move.substring(2, 4),
                                                    engineFacade.board,
                                                    color
                                                ).filter(piece => this.resolvePieceByFirstChar(
                                                    move.charAt(0),
                                                    piece
                                                ));

                                                let piece = this.resolveByCol(
                                                    pieces,
                                                    move.substring(1, 2)
                                                );

                                                if (piece) {
                                                    engineFacade.move(MoveUtils.formatSingle(
                                                        piece.point,
                                                        false
                                                    ) + move.substring(
                                                        2,
                                                        4
                                                    ) + promotionIndex);
                                                }
                                            } else {
                                                if (/^[A-Z][a-z]x[a-z]\d$/g.test(
                                                    move)) {
                                                    let pieces = MoveUtils.findPieceByPossibleCapturesContaining(
                                                        move.substring(move.indexOf(
                                                            'x') + 1),
                                                        engineFacade.board,
                                                        color
                                                    ).filter(piece => this.resolvePieceByFirstChar(
                                                        move.charAt(0),
                                                        piece
                                                    ));

                                                    let piece = this.resolveByCol(
                                                        pieces,
                                                        move.substring(1, 2)
                                                    );

                                                    if (piece) {
                                                        engineFacade.move(
                                                            MoveUtils.formatSingle(
                                                                piece.point,
                                                                false
                                                            ) + move.substring(
                                                            move.indexOf(
                                                                'x') + 1) + promotionIndex);
                                                    }
                                                } else {
                                                    this.processR1f2(
                                                        move,
                                                        engineFacade,
                                                        color,
                                                        promotionIndex
                                                    );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private processR1f2(move, engineFacade, color, promotionIndex) {
        if (/^[A-Z]\d[a-z]\d$/g.test(move)) { // R1f2
            let pieces = MoveUtils.findPieceByPossibleMovesContaining(
                move.substring(2, 4),
                engineFacade.board,
                color
            ).filter(piece => this.resolvePieceByFirstChar(
                move.charAt(0),
                piece
            ));

            let piece = this.resolveByRow(
                pieces,
                move.substring(1, 2)
            );

            if (piece) {
                engineFacade.move(MoveUtils.formatSingle(
                    piece.point,
                    false
                ) + move.substring(
                    2,
                    4
                ) + promotionIndex);
            }
        }
    }

    protected extractMoves(notation: string) {
        return notation.substring(notation.lastIndexOf(']') + 1)
            .replace(/[0-9]+\./g, '')
            .replace(/\s+/g, ' ')
            .replace(/{[^}]*}/g, '')
            .trim()
            .split(' ')
            .filter(s => s);
    }

    protected movePiece(piece: Piece, board: Board, move: string) {
        let indexes = MoveUtils.translateCoordsToIndex(move, board.reverted);
        piece.point.col = indexes.xAxis;
        piece.point.row = indexes.yAxis;
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

    private resolveByCol(pieces: Piece[], char: string): Piece {
        let firstPieceFormat = MoveUtils.formatSingle(pieces[0].point, false);
        let secondPieceFormat = MoveUtils.formatSingle(pieces[1].point, false);
        return firstPieceFormat.substring(0, 1) === char
            ? pieces[0]
            : pieces[1];
    }

    private resolveByRow(pieces: Piece[], char: string) {
        let firstPieceFormat = MoveUtils.formatSingle(pieces[0].point, false);
        let secondPieceFormat = MoveUtils.formatSingle(pieces[1].point, false);
        return firstPieceFormat.substring(1, 2) === char
            ? pieces[0]
            : pieces[1];
    }

    private replacePromotion(move: string) {
        return move
            .replace('=Q', '1')
            .replace('=R', '2')
            .replace('=B', '3')
            .replace('=K', '4');
    }

    private resolvePromotion(promotionChar: string) {
        switch (promotionChar) {
            case 'Q':
                return '1';
            case 'R':
                return '2';
            case 'B':
                return '3';
            case 'N':
                return '4';
        }
        return '';
    }
}
