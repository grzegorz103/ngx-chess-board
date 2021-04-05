import { Board } from '../../models/board';
import { King } from '../../models/pieces/king';
import { Pawn } from '../../models/pieces/pawn';
import { Piece } from '../../models/pieces/piece';
import { Point } from '../../models/pieces/point';
import { MoveUtils } from '../../utils/move-utils';
import { AbstractPgnProcessor } from './pgn-processor';

export class DefaultPgnProcessor extends AbstractPgnProcessor {

    public process(
        board: Board,
        sourcePiece: Piece,
        destPoint: Point,
        destPiece?: Piece
    ): void {
        this.currentIndex += 0.5;
        this.pgn += (this.currentIndex % Math.floor(this.currentIndex) === 0) ? (' ' + this.currentIndex + '. ') : ' ';

        let possibleCaptures = [];
        let possibleMoves = [];

        if (destPiece) {
            console.log('dest');
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

        console.log(possibleCaptures);
        // zwykly ruch pionem
        if (sourcePiece instanceof Pawn && !destPiece && possibleCaptures.length === 0) {
            this.pgn += MoveUtils.formatSingle(destPoint, board.reverted);
        } else {
            if (sourcePiece instanceof King && (Math.abs(sourcePiece.point.col - destPoint.col) === 2)) {   // O-O
                this.pgn += 'O-O';
            } else {
                if (!(sourcePiece instanceof Pawn) && possibleCaptures.length === 0 && possibleMoves.length < 2) {     // Nf3
                    this.pgn += MoveUtils.getFirstLetterPiece(sourcePiece) + MoveUtils.formatSingle(
                        destPoint,
                        board.reverted
                    );
                } else {
                    if (possibleMoves && possibleMoves.length === 2 && possibleCaptures.length === 0) {    // Nbd7
                        console.log(possibleCaptures);
                        if (this.isEqualByCol(
                            possibleMoves[0],
                            possibleMoves[1]
                        )) {
                            this.pgn += MoveUtils.getFirstLetterPiece(
                                sourcePiece) + sourcePiece.point.row + MoveUtils.formatSingle(
                                destPoint,
                                board.reverted
                            );
                        } else {
                            this.pgn += MoveUtils.getFirstLetterPiece(
                                sourcePiece) + sourcePiece.point.col + MoveUtils.formatSingle(
                                destPoint,
                                board.reverted
                            );
                        }
                    } else {
                        if (possibleCaptures.length > 1) {
                            if (this.isEqualByCol(
                                possibleCaptures[0],
                                possibleCaptures[1]
                            )) {
                                this.pgn += MoveUtils.getFirstLetterPiece(
                                    sourcePiece) + sourcePiece.point.row + 'x' + MoveUtils.formatSingle(
                                    destPoint,
                                    board.reverted
                                );
                            } else {
                                this.pgn += MoveUtils.getFirstLetterPiece(
                                    sourcePiece) + sourcePiece.point.col + 'x' + MoveUtils.formatSingle(
                                    destPoint,
                                    board.reverted
                                );
                            }
                        } else {
                            this.pgn += MoveUtils.getFirstLetterPiece(
                                sourcePiece) + 'x' + MoveUtils.formatSingle(
                                destPoint, board.reverted
                            );
                        }
                    }
                }
            }
        }

        this.pgn = this.pgn.trim();
        console.log(this.pgn);
    }

    private resolvePieceByFirstChar(move: string, piece: Piece) {
        return MoveUtils.getFirstLetterPiece(piece) === move;
    }

    private isEqualByCol(aPiece: Piece, bPiece: Piece) {
        return aPiece.point.col === bPiece.point.col;
    }

}
