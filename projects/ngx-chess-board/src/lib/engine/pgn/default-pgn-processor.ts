import { Board } from '../../models/board';
import { King } from '../../models/pieces/king';
import { Pawn } from '../../models/pieces/pawn';
import { Piece } from '../../models/pieces/piece';
import { Point } from '../../models/pieces/point';
import { MoveUtils } from '../../utils/move-utils';
import { AbstractPgnProcessor } from './abstract-pgn-processor';

export class DefaultPgnProcessor extends AbstractPgnProcessor {

    public process(
        board: Board,
        sourcePiece: Piece,
        destPoint: Point,
        destPiece?: Piece
    ): void {
        this.currentIndex += 0.5;
        let currentMove = '';
        if(this.currentIndex % Math.floor(this.currentIndex) === 0) {
            currentMove = this.currentIndex + '. ';
        }
        let possibleCaptures = [];
        let possibleMoves = [];

        if (destPiece) {
            possibleCaptures = MoveUtils.findPieceByPossibleCapturesContaining(
                MoveUtils.formatSingle(destPoint, board.reverted),
                board,
                sourcePiece.color
            ).filter(piece => piece.constructor.name === sourcePiece.constructor.name);
        }
        possibleMoves = MoveUtils.findPieceByPossibleMovesContaining(
            MoveUtils.formatSingle(destPoint, board.reverted),
            board,
            sourcePiece.color
        ).filter(piece => piece.constructor.name === sourcePiece.constructor.name);

        if (sourcePiece instanceof Pawn && !destPiece && possibleCaptures.length === 0) {
            currentMove += MoveUtils.formatSingle(destPoint, board.reverted);
        } else {
            if (sourcePiece instanceof Pawn && destPiece) {
                currentMove += (MoveUtils.formatSingle(
                    sourcePiece.point,
                    board.reverted
                ).substring(0, 1) + 'x' + MoveUtils.formatSingle(
                    destPoint,
                    board.reverted
                ));
            } else {
                if (sourcePiece instanceof King && (Math.abs(sourcePiece.point.col - destPoint.col) === 2)) {
                    if (board.reverted) {
                        currentMove += (destPoint.col < 2
                            ? 'O-O'
                            : 'O-O-O');
                    } else {
                        currentMove += destPoint.col < 3
                            ? 'O-O-O'
                            : 'O-O';
                    }
                } else {
                    if (!(sourcePiece instanceof Pawn) && possibleCaptures.length === 0 && possibleMoves.length < 2) {     // Nf3
                        currentMove += MoveUtils.getFirstLetterPiece(sourcePiece) + MoveUtils.formatSingle(
                            destPoint,
                            board.reverted
                        );
                    } else {
                        if (possibleMoves && possibleMoves.length === 2 && possibleCaptures.length === 0) {    // Nbd7
                            if (this.isEqualByCol(
                                possibleMoves[0],
                                possibleMoves[1]
                            )) {
                                currentMove +=  MoveUtils.getFirstLetterPiece(
                                    sourcePiece) + MoveUtils.reverse(
                                    board,
                                    sourcePiece.point.row
                                ) + MoveUtils.formatSingle(
                                    destPoint,
                                    board.reverted
                                );
                            } else {
                                currentMove += MoveUtils.getFirstLetterPiece(
                                    sourcePiece) + MoveUtils.formatCol(
                                    board,
                                    sourcePiece.point.col
                                ) + MoveUtils.formatSingle(
                                    destPoint,
                                    board.reverted
                                );
                            }
                        } else {
                            if (possibleCaptures.length > 1) {
                                if ((this.isEqualByCol(
                                    possibleCaptures[0],
                                    possibleCaptures[1]
                                ))) {
                                    currentMove += MoveUtils.getFirstLetterPiece(
                                        sourcePiece) + MoveUtils.reverse(
                                        board,
                                        sourcePiece.point.row
                                    ) + 'x' + MoveUtils.formatSingle(
                                        destPoint,
                                        board.reverted
                                    );
                                } else {
                                    currentMove += MoveUtils.getFirstLetterPiece(
                                        sourcePiece) + MoveUtils.formatCol(
                                        board,
                                        sourcePiece.point.col
                                    ) + 'x' + MoveUtils.formatSingle(
                                        destPoint,
                                        board.reverted
                                    );
                                }
                            } else {
                                currentMove += MoveUtils.getFirstLetterPiece(
                                    sourcePiece) + 'x' + MoveUtils.formatSingle(
                                    destPoint, board.reverted
                                );
                            }
                        }
                    }
                }
            }
        }
        this.pgn.push(currentMove);
    }

    private resolvePieceByFirstChar(move: string, piece: Piece) {
        return MoveUtils.getFirstLetterPiece(piece) === move;
    }

    private isEqualByCol(aPiece: Piece, bPiece: Piece) {
        return aPiece.point.col === bPiece.point.col;
    }

}
