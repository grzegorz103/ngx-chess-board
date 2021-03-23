import { Board } from '../../models/board';
import { Color } from '../../models/pieces/color';
import { Point } from '../../models/pieces/point';
import { MoveUtils } from '../../utils/move-utils';
import { AbstractPiece } from './abstract-piece';
import { PieceAbstractDecorator } from './piece-abstract-decorator';

export class AvailableMoveDecorator extends PieceAbstractDecorator {
    private pointClicked: Point;
    private color: Color;
    private board: Board;

    constructor(piece: AbstractPiece, pointClicked: Point, color: Color, board: Board) {
        super(piece);
        this.pointClicked = pointClicked;
        this.color = color;
        this.board = board;
    }

    getPossibleCaptures(): Point[] {
        return this.piece
            .getPossibleCaptures()
            .filter(
                (point) =>
                    !MoveUtils.willMoveCauseCheck(
                        this.color,
                        this.pointClicked.row,
                        this.pointClicked.col,
                        point.row,
                        point.col,
                        this.board
                    )
            );
    }

    getPossibleMoves(): Point[] {
        return this.piece
            .getPossibleMoves()
            .filter(
                (point) =>
                    !MoveUtils.willMoveCauseCheck(
                        this.color,
                        this.pointClicked.row,
                        this.pointClicked.col,
                        point.row,
                        point.col,
                        this.board
                    )
            );
    }
}
