import { EventEmitter } from '@angular/core';
import { HistoryMove } from '../history-move-provider/history-move';
import { ColorInput, PieceTypeInput } from '../utils/inputs/piece-type-input';
import { AbstractEngineFacade } from './abstract-engine-facade';

import { BoardLoader } from './board-state-provider/board-loader/board-loader';
import { BoardState } from './board-state-provider/board-state/board-state';
import { BoardStateProvider } from './board-state-provider/board-state/board-state-provider';
import { MoveStateProvider } from './board-state-provider/board-state/move-state-provider';
import { ClickUtils } from './click/click-utils';
import { Arrow } from './drawing-tools/shapes/arrow';
import { Circle } from './drawing-tools/shapes/circle';
import { DrawPoint } from './drawing-tools/draw-point';
import { DrawProvider } from './drawing-tools/draw-provider';
import { Board } from '../models/board';
import { Color } from '../models/pieces/color';
import { King } from '../models/pieces/king';
import { Pawn } from '../models/pieces/pawn';
import { Piece } from '../models/pieces/piece';
import { Point } from '../models/pieces/point';
import { AvailableMoveDecorator } from './piece-decorator/available-move-decorator';
import { PiecePromotionResolver } from '../piece-promotion/piece-promotion-resolver';
import { MoveUtils } from '../utils/move-utils';
import { MoveChange } from './outputs/move-change/move-change';
import { PieceFactory } from './utils/piece-factory';

export class EngineFacade extends AbstractEngineFacade {

    _selected = false;
    drawPoint: DrawPoint;
    drawProvider: DrawProvider;
    boardStateProvider: BoardStateProvider;
    moveStateProvider: MoveStateProvider;
    moveChange: EventEmitter<MoveChange>;

    private historyMoveCandidate: HistoryMove;

    constructor(
        board: Board,
        moveChange: EventEmitter<MoveChange>
    ) {
        super(board);
        this.moveChange = moveChange;
        this.boardLoader = new BoardLoader(this);
        this.boardLoader.addPieces();
        this.boardStateProvider = new BoardStateProvider();
    }

    public reset(): void {
        this.boardStateProvider.clear();
        this.moveHistoryProvider.clear();
        this.boardLoader.addPieces();
        this.board.reset();
        this.coords.reset();
        this.drawProvider.clear();
        this.pgnProcessor.reset();
    }

    public undo(): void {
        if (!this.boardStateProvider.isEmpty()) {
            const lastBoard = this.boardStateProvider.pop().board;
            if (this.board.reverted) {
                lastBoard.reverse();
            }
            this.board = lastBoard;
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
            this.board.activePiece = null;
            this.moveHistoryProvider.pop();
            this.board.calculateFEN();
            this.pgnProcessor.removeLast();
        }
    }

    saveMoveClone() {
        const clone = this.board.clone();

        if (this.board.reverted) {
            clone.reverse();
        }
        this.moveStateProvider.addMove(new BoardState(clone));
    }

    public move(coords: string) {
        if (coords) {
            const sourceIndexes = MoveUtils.translateCoordsToIndex(
                coords.substring(0, 2),
                this.board.reverted
            );

            const destIndexes = MoveUtils.translateCoordsToIndex(
                coords.substring(2, 4),
                this.board.reverted
            );

            const srcPiece = this.board.getPieceByPoint(
                sourceIndexes.yAxis,
                sourceIndexes.xAxis
            );

            if (srcPiece) {
                if (
                    (this.board.currentWhitePlayer &&
                        srcPiece.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        srcPiece.color === Color.WHITE)
                ) {
                    return;
                }

                this.prepareActivePiece(srcPiece, srcPiece.point);

                if (
                    this.board.isPointInPossibleMoves(
                        new Point(destIndexes.yAxis, destIndexes.xAxis)
                    ) ||
                    this.board.isPointInPossibleCaptures(
                        new Point(destIndexes.yAxis, destIndexes.xAxis)
                    )
                ) {
                    this.saveClone();
                    this.movePiece(
                        srcPiece,
                        new Point(destIndexes.yAxis, destIndexes.xAxis),
                        coords.length === 5 ? +coords.substring(4, 5) : 0
                    );

                    this.board.lastMoveSrc = new Point(
                        sourceIndexes.yAxis,
                        sourceIndexes.xAxis
                    );
                    this.board.lastMoveDest = new Point(
                        destIndexes.yAxis,
                        destIndexes.xAxis
                    );

                    this.disableSelection();
                } else {
                    this.disableSelection();
                }
            }
        }

    }

    prepareActivePiece(pieceClicked: Piece, pointClicked: Point) {
        this.board.activePiece = pieceClicked;
        this._selected = true;
        this.board.possibleCaptures = new AvailableMoveDecorator(
            pieceClicked,
            pointClicked,
            this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK,
            this.board
        ).getPossibleCaptures();
        this.board.possibleMoves = new AvailableMoveDecorator(
            pieceClicked,
            pointClicked,
            this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK,
            this.board
        ).getPossibleMoves();
    }

    onPieceClicked(pieceClicked, pointClicked) {
        if (
            (this.board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
            (!this.board.currentWhitePlayer && pieceClicked.color === Color.WHITE)
        ) {
            return;
        }

        this.prepareActivePiece(pieceClicked, pointClicked);
    }

    public handleClickEvent(pointClicked: Point, isMouseDown: boolean) {
        let moving = false;
        if (((
            this.board.isPointInPossibleMoves(pointClicked) ||
            this.board.isPointInPossibleCaptures(pointClicked)
        ) || this.freeMode) && pointClicked.isInRange()) {
            this.saveClone();
            this.board.lastMoveSrc = new Point(
                this.board.activePiece.point.row,
                this.board.activePiece.point.col
            );
            this.board.lastMoveDest = pointClicked.clone();
            this.movePiece(this.board.activePiece, pointClicked);

            if (!this.board.activePiece.point.isEqual(this.board.lastMoveSrc)) {
                moving = true;
            }
        }

        if (isMouseDown || moving) {
            this.disableSelection();
        }
        this.disableSelection();
        const pieceClicked = this.board.getPieceByPoint(
            pointClicked.row,
            pointClicked.col
        );
        if (pieceClicked && !moving) {
            this.onFreeMode(pieceClicked);
            this.onPieceClicked(pieceClicked, pointClicked);
        }
    }

    public onContextMenu(
        event: MouseEvent,
    ): void {
        if (this.board.activePiece) {
            this.disableSelection();
        }
    }

    onMouseDown(
        event: MouseEvent,
        pointClicked: Point,
        left?: number,
        top?: number
    ) {
        this.moveDone = false;
        if (event.button !== 0) {
            this.drawPoint = ClickUtils.getDrawingPoint(
                this.heightAndWidth,
                this.colorStrategy,
                event.x,
                event.y,
                event.ctrlKey,
                event.altKey,
                event.shiftKey,
                left,
                top
            );
            return;
        }

        this.drawProvider.clear();

        if (
            this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point)
        ) {
            this.disabling = true;
            return;
        }

        const pieceClicked = this.board.getPieceByPoint(
            pointClicked.row,
            pointClicked.col
        );

        if (this.freeMode) {
            if (pieceClicked) {
                if (event.ctrlKey) {
                    this.board.pieces = this.board.pieces.filter(e => e !== pieceClicked);
                    return;
                }
                this.board.currentWhitePlayer = (pieceClicked.color === Color.WHITE);
            }
        }

        if (this.isPieceDisabled(pieceClicked)) {
            return;
        }

        if (this._selected) {
            this.handleClickEvent(pointClicked, true);
        } else {
            if (pieceClicked) {
                this.onFreeMode(pieceClicked);
                this.onPieceClicked(pieceClicked, pointClicked);
            }
        }
    }

    onMouseUp(
        event: MouseEvent,
        pointClicked: Point,
        left: number,
        top: number
    ) {
        this.moveDone = false;
        if (event.button !== 0) {
            if (!this.drawDisabled && this.drawPoint) {
                this.addDrawPoint(
                    event.x,
                    event.y,
                    event.ctrlKey,
                    event.altKey,
                    event.shiftKey,
                    left,
                    top
                );
                return;
            }
            return;
        }

        this.drawProvider.clear();

        if (this.dragDisabled) {
            return;
        }

        if (
            this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point) &&
            this.disabling
        ) {
            this.disableSelection();
            this.disabling = false;
            return;
        }
        const pieceClicked = this.board.getPieceByPoint(
            pointClicked.row,
            pointClicked.col
        );

        if (this.isPieceDisabled(pieceClicked)) {
            return;
        }

        if (this._selected) {
            this.handleClickEvent(pointClicked, false);
            //   this.possibleMoves = activePiece.getPossibleMoves();
        }
    }

    saveClone() {
        const clone = this.board.clone();

        if (this.board.reverted) {
            clone.reverse();
        }
        this.boardStateProvider.addMove(new BoardState(clone));
    }

    movePiece(toMovePiece: Piece, newPoint: Point, promotionIndex?: number) {
        const destPiece = this.board.pieces.find(
            (piece) =>
                piece.point.col === newPoint.col &&
                piece.point.row === newPoint.row
        );

        this.pgnProcessor.process(
            this.board,
            toMovePiece,
            newPoint,
            destPiece
        );

        if (destPiece && toMovePiece.color !== destPiece.color) {
            this.board.pieces = this.board.pieces.filter(
                (piece) => piece !== destPiece
            );
        } else {
            if (destPiece && toMovePiece.color === destPiece.color) {
                return;
            }
        }

        this.historyMoveCandidate = new HistoryMove(
            MoveUtils.format(toMovePiece.point, newPoint, this.board.reverted),
            toMovePiece.constant.name,
            toMovePiece.color === Color.WHITE ? 'white' : 'black',
            !!destPiece
        );
        this.moveHistoryProvider.addMove(this.historyMoveCandidate);

        if (toMovePiece instanceof King) {
            const squaresMoved = Math.abs(newPoint.col - toMovePiece.point.col);
            if (squaresMoved > 1) {
                if (newPoint.col < 3) {
                    const leftRook = this.board.getPieceByField(
                        toMovePiece.point.row,
                        0
                    );
                    if (!this.freeMode) {
                        leftRook.point.col = this.board.reverted ? 2 : 3;
                    }
                } else {
                    const rightRook = this.board.getPieceByField(
                        toMovePiece.point.row,
                        7
                    );
                    if (!this.freeMode) {
                        rightRook.point.col = this.board.reverted ? 4 : 5;
                    }
                }
            }
        }

        if (toMovePiece instanceof Pawn) {
            this.board.checkIfPawnTakesEnPassant(newPoint);
            this.board.checkIfPawnEnpassanted(toMovePiece, newPoint);
        } else {
            this.board.enPassantPoint = null;
            this.board.enPassantPiece = null;
        }

        toMovePiece.point = newPoint;
        this.increaseFullMoveCount();
        this.board.currentWhitePlayer = !this.board.currentWhitePlayer;

        if (!this.checkForPawnPromote(toMovePiece, promotionIndex)) {
            this.afterMoveActions();
        }
    }

    checkForPawnPromote(toPromotePiece: Piece, promotionIndex?: number) {
        if (!(toPromotePiece instanceof Pawn)) {
            return;
        }

        if (toPromotePiece.point.row === 0 || toPromotePiece.point.row === 7) {
            this.board.pieces = this.board.pieces.filter(
                (piece) => piece !== toPromotePiece
            );

            // When we make move manually, we pass promotion index already, so we don't need
            // to acquire it from promote dialog
            if (!promotionIndex) {
                this.openPromoteDialog(toPromotePiece);
            } else {
                PiecePromotionResolver.resolvePromotionChoice(
                    this.board,
                    toPromotePiece,
                    promotionIndex
                );
                this.afterMoveActions(promotionIndex);
            }

            return true;
        }
    }

    afterMoveActions(promotionIndex?: number) {
        this.checkIfPawnFirstMove(this.board.activePiece);
        this.checkIfRookMoved(this.board.activePiece);
        this.checkIfKingMoved(this.board.activePiece);

        this.board.blackKingChecked = this.board.isKingInCheck(
            Color.BLACK,
            this.board.pieces
        );
        this.board.whiteKingChecked = this.board.isKingInCheck(
            Color.WHITE,
            this.board.pieces
        );
        const check =
            this.board.blackKingChecked || this.board.whiteKingChecked;
        const checkmate =
            this.checkForPossibleMoves(Color.BLACK) ||
            this.checkForPossibleMoves(Color.WHITE);
        const stalemate =
            this.checkForPat(Color.BLACK) || this.checkForPat(Color.WHITE);

        this.historyMoveCandidate.setGameStates(check, stalemate, checkmate);
        this.pgnProcessor.processChecks(checkmate, check, stalemate);
        this.pgnProcessor.addPromotionChoice(promotionIndex);

        this.disabling = false;
        this.board.calculateFEN();

        const lastMove = this.moveHistoryProvider.getLastMove();
        if (lastMove && promotionIndex) {
            lastMove.move += promotionIndex;
        }

        this.moveChange.emit({
            ...lastMove,
            check,
            checkmate,
            stalemate,
            fen: this.board.fen,
            pgn: {
                pgn: this.pgnProcessor.getPGN()
            },
            freeMode: this.freeMode
        });

        this.moveDone = true;
    }

    checkForPat(color: Color) {
        if (color === Color.WHITE && !this.board.whiteKingChecked) {
            return this.checkForPossibleMoves(color);
        } else {
            if (color === Color.BLACK && !this.board.blackKingChecked) {
                return this.checkForPossibleMoves(color);
            }
        }
    }

    openPromoteDialog(piece: Piece) {
        if (piece.color === this.board.activePiece.color) {
            this.modal.open((index) => {
                PiecePromotionResolver.resolvePromotionChoice(
                    this.board,
                    piece,
                    index
                );
                this.afterMoveActions(index);
            });
        }
    }

    checkForPossibleMoves(color: Color): boolean {
        return !this.board.pieces
            .filter((piece) => piece.color === color)
            .some(
                (piece) =>
                    piece
                        .getPossibleMoves()
                        .some(
                            (move) =>
                                !MoveUtils.willMoveCauseCheck(
                                    color,
                                    piece.point.row,
                                    piece.point.col,
                                    move.row,
                                    move.col,
                                    this.board
                                )
                        ) ||
                    piece
                        .getPossibleCaptures()
                        .some(
                            (capture) =>
                                !MoveUtils.willMoveCauseCheck(
                                    color,
                                    piece.point.row,
                                    piece.point.col,
                                    capture.row,
                                    capture.col,
                                    this.board
                                )
                        )
            );
    }

    disableSelection() {
        this._selected = false;
        this.board.possibleCaptures = [];
        this.board.activePiece = null;
        this.board.possibleMoves = [];
    }

    /**
     * Processes logic to allow freeMode based logic processing
     */
    onFreeMode(pieceClicked) {
        if (
            !this.freeMode ||
            pieceClicked === undefined ||
            pieceClicked === null
        ) {
            return;
        }
        // sets player as white in-case white pieces are selected, and vice-versa when black is selected
        this.board.currentWhitePlayer = pieceClicked.color === Color.WHITE;
    }

    isPieceDisabled(pieceClicked: Piece) {
        if (pieceClicked && pieceClicked.point) {
            const foundCapture = this.board.possibleCaptures.find(
                (capture) =>
                    capture.col === pieceClicked.point.col &&
                    capture.row === pieceClicked.point.row
            );

            if (foundCapture) {
                return false;
            }
        }
        return (
            pieceClicked &&
            ((this.lightDisabled && pieceClicked.color === Color.WHITE) ||
                (this.darkDisabled && pieceClicked.color === Color.BLACK))
        );
    }

    addDrawPoint(
        x: number,
        y: number,
        crtl: boolean,
        alt: boolean,
        shift: boolean,
        left: number,
        top: number
    ) {
        const upPoint = ClickUtils.getDrawingPoint(
            this.heightAndWidth,
            this.colorStrategy,
            x,
            y,
            crtl,
            alt,
            shift,
            left,
            top
        );

        if (this.drawPoint.isEqual(upPoint)) {
            const circle = new Circle();
            circle.drawPoint = upPoint;
            if (!this.drawProvider.containsCircle(circle)) {
                this.drawProvider.addCircle(circle);
            } else {
                this.drawProvider.reomveCircle(circle);
            }
        } else {
            const arrow = new Arrow();
            arrow.start = this.drawPoint;
            arrow.end = upPoint;

            if (!this.drawProvider.containsArrow(arrow)) {
                this.drawProvider.addArrow(arrow);
            } else {
                this.drawProvider.removeArrow(arrow);
            }
        }
    }

    increaseFullMoveCount() {
        if (!this.board.currentWhitePlayer) {
            ++this.board.fullMoveCount;
        }
    }

    addPiece(
        pieceTypeInput: PieceTypeInput,
        colorInput: ColorInput,
        coords: string
    ) {
        if (this.freeMode && coords && pieceTypeInput > 0 && colorInput > 0) {
            let indexes = MoveUtils.translateCoordsToIndex(
                coords,
                this.board.reverted
            );
            let existing = this.board.getPieceByPoint(
                indexes.yAxis,
                indexes.xAxis
            );
            if (existing) {
                this.board.pieces = this.board.pieces.filter(e => e !== existing);
            }
            let createdPiece = PieceFactory.create(
                indexes,
                pieceTypeInput,
                colorInput,
                this.board
            );
            this.saveClone();
            this.board.pieces.push(createdPiece);
            this.afterMoveActions();
        }
    }
}
