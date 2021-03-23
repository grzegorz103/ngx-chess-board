import { ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { PiecePromotionModalComponent } from '../piece-promotion/piece-promotion-modal/piece-promotion-modal.component';
import { HistoryMove } from '../history-move-provider/history-move';
import { ColorInput, PieceTypeInput } from '../utils/inputs/piece-type-input';

import { BoardLoader } from './board-state-provider/board-loader';
import { BoardState } from './board-state-provider/board-state';
import { BoardStateProvider } from './board-state-provider/board-state-provider';
import { MoveStateProvider } from './board-state-provider/move-state-provider';
import { CoordsProvider } from './coords/coords-provider';
import { ClickUtils } from './click/click-utils';
import { Arrow } from './drawing-tools/shapes/arrow';
import { Circle } from './drawing-tools/shapes/circle';
import { ColorStrategy } from './drawing-tools/colors/color-strategy';
import { DrawPoint } from './drawing-tools/draw-point';
import { DrawProvider } from './drawing-tools/draw-provider';
import { HistoryMoveProvider } from '../history-move-provider/history-move-provider';
import { Board } from '../models/board';
import { Color } from '../models/pieces/color';
import { King } from '../models/pieces/king';
import { Pawn } from '../models/pieces/pawn';
import { Piece } from '../models/pieces/piece';
import { Point } from '../models/pieces/point';
import { Rook } from '../models/pieces/rook';
import { AvailableMoveDecorator } from './piece-decorator/available-move-decorator';
import { PiecePromotionResolver } from '../piece-promotion/piece-promotion-resolver';
import { Constants } from '../utils/constants';
import { PieceIconInputManager } from '../utils/inputs/piece-icon-input-manager';
import { MoveUtils } from '../utils/move-utils';
import { DragEndStrategy } from './drag/end/drag-end-strategy';
import { DragStartStrategy } from './drag/start/drag-start-strategy';
import { MoveChange } from './move-change';
import { PieceFactory } from './utils/piece-factory';

export class EngineFacade {

    _board: Board;
    _selected = false;
    _freeMode = false;
    drawPoint: DrawPoint;
    drawProvider: DrawProvider;
    disabling = false;
    dragDisabled: boolean;
    drawDisabled: boolean;
    boardStateProvider: BoardStateProvider;
    moveStateProvider: MoveStateProvider;
    moveHistoryProvider: HistoryMoveProvider;
    heightAndWidth: number = Constants.DEFAULT_SIZE;
    lightDisabled: boolean;
    darkDisabled: boolean;
    moveChange: EventEmitter<MoveChange>;
    boardLoader: BoardLoader;
    coords: CoordsProvider = new CoordsProvider();
    pieceIconManager: PieceIconInputManager;

    dragStartStrategy: DragStartStrategy = new DragStartStrategy();
    dragEndStrategy: DragEndStrategy = new DragEndStrategy();
    colorStrategy: ColorStrategy = new ColorStrategy();

    modal: PiecePromotionModalComponent;

    constructor(
        board: Board,
        moveChange: EventEmitter<MoveChange>
    ) {
        this._board = board;
        this.moveChange = moveChange;
        this.boardLoader = new BoardLoader(this.board);
        this.boardLoader.addPieces();
        this.drawProvider = new DrawProvider();
        this.pieceIconManager = new PieceIconInputManager();
        this.boardStateProvider = new BoardStateProvider();
        this.moveHistoryProvider = new HistoryMoveProvider();
    }

    reset(): void {
        this.boardStateProvider.clear();
        this.moveHistoryProvider.clear();
        this.boardLoader.addPieces();
        this.board.reset();
        this.coords.reset();
        this.drawProvider.clear();
        this.freeMode = false;
    }

    undo(): void {
        if (!this.boardStateProvider.isEmpty()) {
            const lastBoard = this.boardStateProvider.pop().board;
            if (this.board.reverted) {
                lastBoard.reverse();
            }
            this.board = lastBoard;
            this.boardLoader.setBoard(this.board);
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
            this.moveHistoryProvider.pop();
        }
    }

    getMoveHistory(): HistoryMove[] {
        return this.moveHistoryProvider.getAll();
    }

    saveMoveClone() {
        const clone = this.board.clone();

        if (this.board.reverted) {
            clone.reverse();
        }
        this.moveStateProvider.addMove(new BoardState(clone));
    }

    move(coords: string) {
        if (coords) {
            const sourceIndexes = MoveUtils.translateCoordsToIndex(
                coords.substring(0, 2),
                this._board.reverted
            );

            const destIndexes = MoveUtils.translateCoordsToIndex(
                coords.substring(2, 4),
                this._board.reverted
            );

            const srcPiece = this._board.getPieceByPoint(
                sourceIndexes.yAxis,
                sourceIndexes.xAxis
            );

            if (srcPiece) {
                if (
                    (this._board.currentWhitePlayer &&
                        srcPiece.color === Color.BLACK) ||
                    (!this._board.currentWhitePlayer &&
                        srcPiece.color === Color.WHITE)
                ) {
                    return;
                }

                this.prepareActivePiece(srcPiece, srcPiece.point);

                if (
                    this._board.isPointInPossibleMoves(
                        new Point(destIndexes.yAxis, destIndexes.xAxis)
                    ) ||
                    this._board.isPointInPossibleCaptures(
                        new Point(destIndexes.yAxis, destIndexes.xAxis)
                    )
                ) {
                    this.saveClone();
                    this.movePiece(
                        srcPiece,
                        new Point(destIndexes.yAxis, destIndexes.xAxis),
                        coords.length === 5 ? +coords.substring(4, 5) : 0
                    );

                    this._board.lastMoveSrc = new Point(
                        sourceIndexes.yAxis,
                        sourceIndexes.xAxis
                    );
                    this._board.lastMoveDest = new Point(
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
        this._board.activePiece = pieceClicked;
        this._selected = true;
        this._board.possibleCaptures = new AvailableMoveDecorator(
            pieceClicked,
            pointClicked,
            this._board.currentWhitePlayer ? Color.WHITE : Color.BLACK,
            this._board
        ).getPossibleCaptures();
        this._board.possibleMoves = new AvailableMoveDecorator(
            pieceClicked,
            pointClicked,
            this._board.currentWhitePlayer ? Color.WHITE : Color.BLACK,
            this._board
        ).getPossibleMoves();
    }

    onPieceClicked(pieceClicked, pointClicked) {
        if (
            (this._board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
            (!this._board.currentWhitePlayer && pieceClicked.color === Color.WHITE)
        ) {
            return;
        }

        this.prepareActivePiece(pieceClicked, pointClicked);
    }

    public handleClickEvent(pointClicked: Point, isMouseDown: boolean) {
        let moving = false;

        if ((
            this._board.isPointInPossibleMoves(pointClicked) ||
            this._board.isPointInPossibleCaptures(pointClicked)
        ) || this._freeMode) {
            this.saveClone();
            this._board.lastMoveSrc = new Point(
                this._board.activePiece.point.row,
                this._board.activePiece.point.col
            );
            this._board.lastMoveDest = pointClicked;
            this.movePiece(this._board.activePiece, pointClicked);

            if (!this._board.activePiece.point.isEqual(this._board.lastMoveSrc)) {
                moving = true;
            }
        }

        if (isMouseDown || moving) {
            this.disableSelection();
        }
        this.disableSelection();
        const pieceClicked = this._board.getPieceByPoint(
            pointClicked.row,
            pointClicked.col
        );
        if (pieceClicked && !moving) {
            this.onFreeMode(pieceClicked);
            this.onPieceClicked(pieceClicked, pointClicked);
        }
    }

    onMouseDown(
        event: MouseEvent,
        pointClicked: Point,
        left?: number,
        top?: number
    ) {
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
            this._board.activePiece &&
            pointClicked.isEqual(this._board.activePiece.point)
        ) {
            this.disabling = true;
            return;
        }

        const pieceClicked = this._board.getPieceByPoint(
            pointClicked.row,
            pointClicked.col
        );

        if (this._freeMode) {
            if (pieceClicked) {
                if (event.ctrlKey) {
                    this.board.pieces = this.board.pieces.filter(e => e !== pieceClicked);
                    return;
                }
                this._board.currentWhitePlayer = (pieceClicked.color === Color.WHITE);
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
        if (event.button !== 0 && !this.drawDisabled) {
            this.addDrawPoint(
                event.x,
                event.y,
                event.ctrlKey,
                event.altKey,
                event.shiftKey,
                left, top
            );
            return;
        }

        this.drawProvider.clear();

        if (this.dragDisabled) {
            return;
        }

        if (
            this._board.activePiece &&
            pointClicked.isEqual(this._board.activePiece.point) &&
            this.disabling
        ) {
            this.disableSelection();
            this.disabling = false;
            return;
        }
        const pieceClicked = this._board.getPieceByPoint(
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
        const clone = this._board.clone();

        if (this._board.reverted) {
            clone.reverse();
        }
        this.boardStateProvider.addMove(new BoardState(clone));
    }

    movePiece(toMovePiece: Piece, newPoint: Point, promotionIndex?: number) {
        const destPiece = this._board.pieces.find(
            (piece) =>
                piece.point.col === newPoint.col &&
                piece.point.row === newPoint.row
        );

        if (destPiece && toMovePiece.color !== destPiece.color) {
            this._board.pieces = this._board.pieces.filter(
                (piece) => piece !== destPiece
            );
        } else {
            if (destPiece && toMovePiece.color === destPiece.color) {
                return;
            }
        }

        const move = new HistoryMove(
            MoveUtils.format(toMovePiece.point, newPoint, this._board.reverted),
            toMovePiece.constant.name,
            toMovePiece.color === Color.WHITE ? 'white' : 'black',
            !!destPiece
        );
        this.moveHistoryProvider.addMove(move);

        if (toMovePiece instanceof King) {
            const squaresMoved = Math.abs(newPoint.col - toMovePiece.point.col);
            if (squaresMoved > 1) {
                if (newPoint.col < 3) {
                    const leftRook = this._board.getPieceByField(
                        toMovePiece.point.row,
                        0
                    );
                    if (!this._freeMode) {
                        leftRook.point.col = this._board.reverted ? 2 : 3;
                    }
                } else {
                    const rightRook = this._board.getPieceByField(
                        toMovePiece.point.row,
                        7
                    );
                    if (!this._freeMode) {
                        rightRook.point.col = this._board.reverted ? 4 : 5;
                    }
                }
            }
        }

        if (toMovePiece instanceof Pawn) {
            this.board.checkIfPawnTakesEnPassant(newPoint);
            this.board.checkIfPawnEnpassanted(toMovePiece, newPoint);
        }

        toMovePiece.point = newPoint;
        this.increaseFullMoveCount();
        this._board.currentWhitePlayer = !this._board.currentWhitePlayer;

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

    checkIfPawnFirstMove(piece: Piece) {
        if (piece instanceof Pawn) {
            piece.isMovedAlready = true;
        }
    }

    checkIfRookMoved(piece: Piece) {
        if (piece instanceof Rook) {
            piece.isMovedAlready = true;
        }
    }

    checkIfKingMoved(piece: Piece) {
        if (piece instanceof King) {
            piece.isMovedAlready = true;
        }
    }

    afterMoveActions(promotionIndex?: number) {
        this.checkIfPawnFirstMove(this._board.activePiece);
        this.checkIfRookMoved(this._board.activePiece);
        this.checkIfKingMoved(this._board.activePiece);

        this._board.blackKingChecked = this._board.isKingInCheck(
            Color.BLACK,
            this._board.pieces
        );
        this._board.whiteKingChecked = this._board.isKingInCheck(
            Color.WHITE,
            this._board.pieces
        );
        const check =
            this._board.blackKingChecked || this._board.whiteKingChecked;
        const checkmate =
            this.checkForPossibleMoves(Color.BLACK) ||
            this.checkForPossibleMoves(Color.WHITE);
        const stalemate =
            this.checkForPat(Color.BLACK) || this.checkForPat(Color.WHITE);

        this.disabling = false;
        this._board.calculateFEN();

        const lastMove = this.moveHistoryProvider.getLastMove();
        if (lastMove && promotionIndex) {
            lastMove.move += promotionIndex;
        }

        this.moveChange.emit({
            ...lastMove,
            check,
            checkmate,
            stalemate,
            fen: this._board.fen,
            freeMode: this._freeMode
        });
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
        this.modal.open((index) => {
            PiecePromotionResolver.resolvePromotionChoice(
                this.board,
                piece,
                index
            );
            this.afterMoveActions(index);
        });
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
        this._board.possibleCaptures = [];
        this._board.activePiece = null;
        this._board.possibleMoves = [];
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

    get board(): Board {
        return this._board;
    }

    set board(value: Board) {
        this._board = value;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
    }

    get freeMode(): boolean {
        return this._freeMode;
    }

    set freeMode(value: boolean) {
        this._freeMode = value;
    }

    addPiece(
        pieceTypeInput: PieceTypeInput,
        colorInput: ColorInput,
        coords: string
    ) {
        if (this.freeMode && coords && pieceTypeInput > 0 && colorInput > 0) {
            let indexes = MoveUtils.translateCoordsToIndex(coords, this.board.reverted);
            let existing = this.board.getPieceByPoint(indexes.yAxis, indexes.xAxis);
            if(existing) {
                this.board.pieces = this.board.pieces.filter(e => e !== existing);
            }
            let createdPiece = PieceFactory.create(indexes, pieceTypeInput, colorInput, this.board);
            this.saveClone();
            this.board.pieces.push(createdPiece);
            this.afterMoveActions();
        }
    }
}
