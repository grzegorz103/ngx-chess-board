import { Component, EventEmitter, HostListener, Input, Output, ViewChild, } from '@angular/core';
import { BoardLoader } from './board-state-provider/board-loader';
import { BoardState } from './board-state-provider/board-state';
import { BoardStateProvider } from './board-state-provider/board-state-provider';
import { CoordsProvider } from './coords/coords-provider';
import { Arrow } from './drawing-tools/arrow';
import { Circle } from './drawing-tools/circle';
import { DrawPoint } from './drawing-tools/draw-point';
import { DrawProvider } from './drawing-tools/draw-provider';
import { HistoryMove } from './history-move-provider/history-move';
import { HistoryMoveProvider } from './history-move-provider/history-move-provider';
import { Board } from './models/board';
import { Bishop } from './models/pieces/bishop';
import { Color } from './models/pieces/color';
import { King } from './models/pieces/king';
import { Knight } from './models/pieces/knight';
import { Pawn } from './models/pieces/pawn';
import { Point } from './models/pieces/point';
import { Queen } from './models/pieces/queen';
import { Rook } from './models/pieces/rook';
import { AvailableMoveDecorator } from './piece-decorator/available-move-decorator';
import { Constants } from './utils/constants';
import { PieceIconInputManager } from './utils/inputs/piece-icon-input-manager';
import { MoveUtils } from './utils/move-utils';
import { UnicodeConstants } from './utils/unicode-constants';
import * as i0 from "@angular/core";
import * as i1 from "./service/ngx-chess-board.service";
import * as i2 from "@angular/common";
import * as i3 from "./piece-promotion-modal/piece-promotion-modal.component";
import * as i4 from "@angular/cdk/drag-drop";
const _c0 = ["boardRef"];
const _c1 = ["modal"];
function NgxChessBoardComponent_div_3_div_1_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r7 = i0.ɵɵnextContext(2).index;
    const ctx_r11 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("color", i_r7 % 2 === 0 ? ctx_r11.lightTileColor : ctx_r11.darkTileColor)("font-size", ctx_r11.pieceSize / 4, "px");
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", ctx_r11.coords.yCoords[i_r7], " ");
} }
function NgxChessBoardComponent_div_3_div_1_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = i0.ɵɵnextContext().index;
    const ctx_r12 = i0.ɵɵnextContext(2);
    i0.ɵɵstyleProp("color", j_r10 % 2 === 0 ? ctx_r12.lightTileColor : ctx_r12.darkTileColor)("font-size", ctx_r12.pieceSize / 4, "px");
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", ctx_r12.coords.xCoords[j_r10], " ");
} }
function NgxChessBoardComponent_div_3_div_1_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17);
    i0.ɵɵelementStart(1, "div", 18);
    i0.ɵɵlistener("cdkDragEnded", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragEnded_1_listener($event) { i0.ɵɵrestoreView(_r18); const ctx_r17 = i0.ɵɵnextContext(3); return ctx_r17.dragEnded($event); })("cdkDragStarted", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragStarted_1_listener($event) { i0.ɵɵrestoreView(_r18); const ctx_r19 = i0.ɵɵnextContext(3); return ctx_r19.dragStart($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = i0.ɵɵnextContext().index;
    const i_r7 = i0.ɵɵnextContext().index;
    const ctx_r13 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵstyleProp("font-size", ctx_r13.pieceSize + "px");
    i0.ɵɵproperty("cdkDragDisabled", ctx_r13.dragDisabled)("innerHTML", ctx_r13.pieceIconManager.isDefaultIcons() ? ctx_r13.getPieceByPoint(i_r7, j_r10).constant.icon : "", i0.ɵɵsanitizeHtml)("ngClass", "piece")("ngStyle", ctx_r13.pieceIconManager.isDefaultIcons() ? "" : ctx_r13.getCustomPieceIcons(ctx_r13.getPieceByPoint(i_r7, j_r10)));
} }
function NgxChessBoardComponent_div_3_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_span_1_Template, 2, 5, "span", 12);
    i0.ɵɵtemplate(2, NgxChessBoardComponent_div_3_div_1_span_2_Template, 2, 5, "span", 13);
    i0.ɵɵtemplate(3, NgxChessBoardComponent_div_3_div_1_div_3_Template, 2, 6, "div", 14);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = ctx.index;
    const i_r7 = i0.ɵɵnextContext().index;
    const ctx_r8 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("background-color", (i_r7 + j_r10) % 2 === 0 ? ctx_r8.lightTileColor : ctx_r8.darkTileColor);
    i0.ɵɵclassProp("current-selection", ctx_r8.board.isXYInActiveMove(i_r7, j_r10))("dest-move", ctx_r8.board.isXYInDestMove(i_r7, j_r10))("king-check", ctx_r8.isKingChecked(ctx_r8.getPieceByPoint(i_r7, j_r10)))("point-circle", ctx_r8.board.isXYInPointSelection(i_r7, j_r10))("possible-capture", ctx_r8.board.isXYInPossibleCaptures(i_r7, j_r10))("possible-point", ctx_r8.board.isXYInPossibleMoves(i_r7, j_r10))("source-move", ctx_r8.board.isXYInSourceMove(i_r7, j_r10));
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r8.showCoords && j_r10 === 7);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r8.showCoords && i_r7 === 7);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r8.getPieceByPoint(i_r7, j_r10));
} }
function NgxChessBoardComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_Template, 4, 19, "div", 10);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r6 = ctx.$implicit;
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngForOf", row_r6);
} }
function NgxChessBoardComponent__svg_defs_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(0, "defs");
    i0.ɵɵelementStart(1, "marker", 19);
    i0.ɵɵelement(2, "path", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const color_r23 = ctx.$implicit;
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("id", color_r23 + "Arrow");
    i0.ɵɵadvance(1);
    i0.ɵɵstyleProp("fill", color_r23);
} }
function NgxChessBoardComponent__svg_line_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelement(0, "line", 21);
} if (rf & 2) {
    const arrow_r24 = ctx.$implicit;
    i0.ɵɵattribute("marker-end", "url(#" + arrow_r24.end.color + "Arrow)")("stroke", arrow_r24.end.color)("x1", arrow_r24.start.x)("x2", arrow_r24.end.x)("y1", arrow_r24.start.y)("y2", arrow_r24.end.y);
} }
function NgxChessBoardComponent__svg_circle_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelement(0, "circle", 22);
} if (rf & 2) {
    const circle_r25 = ctx.$implicit;
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵattribute("cx", circle_r25.drawPoint.x)("cy", circle_r25.drawPoint.y)("r", ctx_r4.heightAndWidth / 18)("stroke", circle_r25.drawPoint.color);
} }
const _c2 = function () { return ["red", "green", "blue", "orange"]; };
export class NgxChessBoardComponent {
    constructor(ngxChessBoardService) {
        this.ngxChessBoardService = ngxChessBoardService;
        this.darkTileColor = Constants.DEFAULT_DARK_TILE_COLOR;
        this.lightTileColor = Constants.DEFAULT_LIGHT_TILE_COLOR;
        this.showCoords = true;
        this.dragDisabled = false;
        this.drawDisabled = false;
        this.lightDisabled = false;
        this.darkDisabled = false;
        /**
         * Enabling free mode removes turn-based restriction and allows to move any piece freely!
         */
        this.freeMode = false;
        this.moveChange = new EventEmitter();
        this.checkmate = new EventEmitter();
        this.stalemate = new EventEmitter();
        this.selected = false;
        this.coords = new CoordsProvider();
        this.disabling = false;
        this.heightAndWidth = Constants.DEFAULT_SIZE;
        this.board = new Board();
        this.boardLoader = new BoardLoader(this.board);
        this.boardLoader.addPieces();
        this.boardStateProvider = new BoardStateProvider();
        this.moveHistoryProvider = new HistoryMoveProvider();
        this.drawProvider = new DrawProvider();
        this.pieceIconManager = new PieceIconInputManager();
    }
    set size(size) {
        if (size &&
            size >= Constants.MIN_BOARD_SIZE &&
            size <= Constants.MAX_BOARD_SIZE) {
            this.heightAndWidth = size;
        }
        else {
            this.heightAndWidth = Constants.DEFAULT_SIZE;
        }
        this.drawProvider.clear();
        this.calculatePieceSize();
    }
    set pieceIcons(pieceIcons) {
        this.pieceIconManager.pieceIconInput = pieceIcons;
    }
    onRightClick(event) {
        event.preventDefault();
    }
    ngOnChanges(changes) {
        if ((changes.lightDisabled &&
            this.lightDisabled &&
            this.board.currentWhitePlayer) ||
            (changes.darkDisabled &&
                this.darkDisabled &&
                !this.board.currentWhitePlayer)) {
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
        }
    }
    ngOnInit() {
        this.ngxChessBoardService.componentMethodCalled$.subscribe(() => {
            this.board.reset();
        });
        this.calculatePieceSize();
    }
    onMouseUp(event) {
        if (event.button !== 0 && !this.drawDisabled) {
            this.addDrawPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey);
            return;
        }
        this.drawProvider.clear();
        if (this.dragDisabled) {
            return;
        }
        const pointClicked = this.getClickPoint(event);
        if (this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point) &&
            this.disabling) {
            this.disableSelection();
            this.disabling = false;
            return;
        }
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (this.isPieceDisabled(pieceClicked)) {
            return;
        }
        if (this.selected) {
            this.handleClickEvent(pointClicked, false);
            //   this.possibleMoves = activePiece.getPossibleMoves();
        }
    }
    onPieceClicked(pieceClicked, pointClicked) {
        if ((this.board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
            (!this.board.currentWhitePlayer && pieceClicked.color === Color.WHITE)) {
            return;
        }
        this.prepareActivePiece(pieceClicked, pointClicked);
    }
    /**
     * Validates whether freemode is turned on!
     */
    isFreeMode() {
        return this.freeMode;
    }
    /**
     * Processes logic to allow freeMode based logic processing
     */
    onFreeMode(pieceClicked) {
        if (!this.isFreeMode() ||
            pieceClicked === undefined ||
            pieceClicked === null) {
            return;
        }
        // sets player as white in-case white pieces are selected, and vice-versa when black is selected
        this.board.currentWhitePlayer = pieceClicked.color === Color.WHITE;
    }
    afterMoveActions(promotionIndex) {
        this.checkIfPawnFirstMove(this.board.activePiece);
        this.checkIfRookMoved(this.board.activePiece);
        this.checkIfKingMoved(this.board.activePiece);
        this.board.blackKingChecked = this.board.isKingInCheck(Color.BLACK, this.board.pieces);
        this.board.whiteKingChecked = this.board.isKingInCheck(Color.WHITE, this.board.pieces);
        const check = this.board.blackKingChecked || this.board.whiteKingChecked;
        const checkmate = this.checkForPossibleMoves(Color.BLACK) ||
            this.checkForPossibleMoves(Color.WHITE);
        const stalemate = this.checkForPat(Color.BLACK) || this.checkForPat(Color.WHITE);
        this.disabling = false;
        this.board.calculateFEN();
        const lastMove = this.moveHistoryProvider.getLastMove();
        if (lastMove && promotionIndex) {
            lastMove.move += promotionIndex;
        }
        this.moveChange.emit(Object.assign(Object.assign({}, lastMove), { check,
            checkmate,
            stalemate, fen: this.board.fen, freeMode: this.freeMode }));
    }
    disableSelection() {
        this.selected = false;
        this.board.possibleCaptures = [];
        this.board.activePiece = null;
        this.board.possibleMoves = [];
    }
    prepareActivePiece(pieceClicked, pointClicked) {
        this.board.activePiece = pieceClicked;
        this.selected = true;
        this.board.possibleCaptures = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleCaptures();
        this.board.possibleMoves = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleMoves();
    }
    getPieceByPoint(row, col) {
        row = Math.floor(row);
        col = Math.floor(col);
        return this.board.pieces.find((piece) => piece.point.col === col && piece.point.row === row);
    }
    isKingChecked(piece) {
        if (piece instanceof King) {
            return piece.color === Color.WHITE
                ? this.board.whiteKingChecked
                : this.board.blackKingChecked;
        }
    }
    getClickPoint(event) {
        return new Point(Math.floor((event.y -
            this.boardRef.nativeElement.getBoundingClientRect().top) /
            (this.boardRef.nativeElement.getBoundingClientRect()
                .height /
                8)), Math.floor((event.x -
            this.boardRef.nativeElement.getBoundingClientRect().left) /
            (this.boardRef.nativeElement.getBoundingClientRect().width /
                8)));
    }
    movePiece(toMovePiece, newPoint, promotionIndex) {
        const destPiece = this.board.pieces.find((piece) => piece.point.col === newPoint.col &&
            piece.point.row === newPoint.row);
        if (destPiece && toMovePiece.color !== destPiece.color) {
            this.board.pieces = this.board.pieces.filter((piece) => piece !== destPiece);
        }
        else {
            if (destPiece && toMovePiece.color === destPiece.color) {
                return;
            }
        }
        const move = new HistoryMove(MoveUtils.format(toMovePiece.point, newPoint, this.board.reverted), toMovePiece.constant.name, toMovePiece.color === Color.WHITE ? 'white' : 'black', !!destPiece);
        this.moveHistoryProvider.addMove(move);
        if (toMovePiece instanceof King) {
            const squaresMoved = Math.abs(newPoint.col - toMovePiece.point.col);
            if (squaresMoved > 1) {
                if (newPoint.col < 3) {
                    const leftRook = this.board.getPieceByField(toMovePiece.point.row, 0);
                    if (!this.freeMode) {
                        leftRook.point.col = this.board.reverted ? 2 : 3;
                    }
                }
                else {
                    const rightRook = this.board.getPieceByField(toMovePiece.point.row, 7);
                    if (!this.freeMode) {
                        rightRook.point.col = this.board.reverted ? 4 : 5;
                    }
                }
            }
        }
        if (toMovePiece instanceof Pawn) {
            this.checkIfPawnTakesEnPassant(newPoint);
            this.checkIfPawnEnpassanted(toMovePiece, newPoint);
        }
        toMovePiece.point = newPoint;
        this.increaseFullMoveCount();
        this.board.currentWhitePlayer = !this.board.currentWhitePlayer;
        if (!this.checkForPawnPromote(toMovePiece, promotionIndex)) {
            this.afterMoveActions();
        }
    }
    checkIfPawnFirstMove(piece) {
        if (piece instanceof Pawn) {
            piece.isMovedAlready = true;
        }
    }
    checkForPawnPromote(toPromotePiece, promotionIndex) {
        if (!(toPromotePiece instanceof Pawn)) {
            return;
        }
        if (toPromotePiece.point.row === 0 || toPromotePiece.point.row === 7) {
            this.board.pieces = this.board.pieces.filter((piece) => piece !== toPromotePiece);
            // When we make move manually, we pass promotion index already, so we don't need
            // to acquire it from promote dialog
            if (!promotionIndex) {
                this.openPromoteDialog(toPromotePiece);
            }
            else {
                this.resolvePromotionChoice(toPromotePiece, promotionIndex);
                this.afterMoveActions(promotionIndex);
            }
            return true;
        }
    }
    openPromoteDialog(piece) {
        this.modal.open((index) => {
            this.resolvePromotionChoice(piece, index);
            this.afterMoveActions(index);
        });
    }
    resolvePromotionChoice(piece, index) {
        const isWhite = piece.color === Color.WHITE;
        switch (index) {
            case 1:
                this.board.pieces.push(new Queen(piece.point, piece.color, isWhite
                    ? UnicodeConstants.WHITE_QUEEN
                    : UnicodeConstants.BLACK_QUEEN, this.board));
                break;
            case 2:
                this.board.pieces.push(new Rook(piece.point, piece.color, isWhite
                    ? UnicodeConstants.WHITE_ROOK
                    : UnicodeConstants.BLACK_ROOK, this.board));
                break;
            case 3:
                this.board.pieces.push(new Bishop(piece.point, piece.color, isWhite
                    ? UnicodeConstants.WHITE_BISHOP
                    : UnicodeConstants.BLACK_BISHOP, this.board));
                break;
            case 4:
                this.board.pieces.push(new Knight(piece.point, piece.color, isWhite
                    ? UnicodeConstants.WHITE_KNIGHT
                    : UnicodeConstants.BLACK_KNIGHT, this.board));
                break;
        }
    }
    reset() {
        this.boardStateProvider.clear();
        this.moveHistoryProvider.clear();
        this.boardLoader.addPieces();
        this.board.reset();
        this.coords.reset();
        this.drawProvider.clear();
        this.freeMode = false;
    }
    reverse() {
        this.selected = false;
        this.board.reverse();
        this.coords.reverse();
    }
    updateBoard(board) {
        this.board = board;
        this.boardLoader.setBoard(this.board);
        this.board.possibleCaptures = [];
        this.board.possibleMoves = [];
    }
    undo() {
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
    getMoveHistory() {
        return this.moveHistoryProvider.getAll();
    }
    setFEN(fen) {
        try {
            this.boardLoader.loadFEN(fen);
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
            this.coords.reset();
        }
        catch (exception) {
            this.boardLoader.addPieces();
        }
    }
    getFEN() {
        return this.board.fen;
    }
    dragEnded(event) {
        event.source.reset();
        event.source.element.nativeElement.style.zIndex = '0';
        event.source.element.nativeElement.style.pointerEvents = 'auto';
        event.source.element.nativeElement.style.touchAction = 'auto';
    }
    dragStart(event) {
        const style = event.source.element.nativeElement.style;
        style.position = 'relative';
        style.zIndex = '1000';
        style.touchAction = 'none';
        style.pointerEvents = 'none';
    }
    onMouseDown(event) {
        if (event.button !== 0) {
            this.drawPoint = this.getDrawingPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey);
            return;
        }
        const pointClicked = this.getClickPoint(event);
        this.drawProvider.clear();
        if (this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point)) {
            this.disabling = true;
            return;
        }
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (this.freeMode) {
            if (pieceClicked) {
                this.board.currentWhitePlayer = (pieceClicked.color === Color.WHITE);
            }
        }
        if (this.isPieceDisabled(pieceClicked)) {
            return;
        }
        if (this.selected) {
            this.handleClickEvent(pointClicked, true);
        }
        else {
            if (pieceClicked) {
                this.onFreeMode(pieceClicked);
                this.onPieceClicked(pieceClicked, pointClicked);
            }
        }
    }
    getDrawingPoint(x, y, crtl, alt, shift) {
        const squareSize = this.heightAndWidth / 8;
        const xx = Math.floor((x - this.boardRef.nativeElement.getBoundingClientRect().left) /
            squareSize);
        const yy = Math.floor((y - this.boardRef.nativeElement.getBoundingClientRect().top) /
            squareSize);
        let color = 'green';
        if (crtl || shift) {
            color = 'red';
        }
        if (alt) {
            color = 'blue';
        }
        if ((shift || crtl) && alt) {
            color = 'orange';
        }
        return new DrawPoint(Math.floor(xx * squareSize + squareSize / 2), Math.floor(yy * squareSize + squareSize / 2), color);
    }
    checkIfRookMoved(piece) {
        if (piece instanceof Rook) {
            piece.isMovedAlready = true;
        }
    }
    checkIfKingMoved(piece) {
        if (piece instanceof King) {
            piece.isMovedAlready = true;
        }
    }
    checkForPossibleMoves(color) {
        if (!this.board.pieces
            .filter((piece) => piece.color === color)
            .some((piece) => piece
            .getPossibleMoves()
            .some((move) => !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, move.row, move.col, this.board)) ||
            piece
                .getPossibleCaptures()
                .some((capture) => !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, capture.row, capture.col, this.board)))) {
            return true;
        }
        else {
            return false;
        }
    }
    checkForPat(color) {
        if (color === Color.WHITE && !this.board.whiteKingChecked) {
            return this.checkForPossibleMoves(color);
        }
        else {
            if (color === Color.BLACK && !this.board.blackKingChecked) {
                return this.checkForPossibleMoves(color);
            }
        }
    }
    checkIfPawnEnpassanted(piece, newPoint) {
        if (Math.abs(piece.point.row - newPoint.row) > 1) {
            this.board.enPassantPiece = piece;
            this.board.enPassantPoint = new Point((piece.point.row + newPoint.row) / 2, piece.point.col);
        }
        else {
            this.board.enPassantPoint = null;
            this.board.enPassantPiece = null;
        }
    }
    checkIfPawnTakesEnPassant(newPoint) {
        if (newPoint.isEqual(this.board.enPassantPoint)) {
            this.board.pieces = this.board.pieces.filter((piece) => piece !== this.board.enPassantPiece);
            this.board.enPassantPoint = null;
            this.board.enPassantPiece = null;
        }
    }
    saveClone() {
        const clone = this.board.clone();
        if (this.board.reverted) {
            clone.reverse();
        }
        this.boardStateProvider.addMove(new BoardState(clone));
    }
    saveMoveClone() {
        const clone = this.board.clone();
        if (this.board.reverted) {
            clone.reverse();
        }
        this.moveStateProvider.addMove(new BoardState(clone));
    }
    calculatePieceSize() {
        this.pieceSize = this.heightAndWidth / 10;
    }
    increaseFullMoveCount() {
        if (!this.board.currentWhitePlayer) {
            ++this.board.fullMoveCount;
        }
    }
    handleClickEvent(pointClicked, isMouseDown) {
        let moving = false;
        if ((this.board.isPointInPossibleMoves(pointClicked) ||
            this.board.isPointInPossibleCaptures(pointClicked)) || this.freeMode) {
            this.saveClone();
            this.board.lastMoveSrc = new Point(this.board.activePiece.point.row, this.board.activePiece.point.col);
            this.board.lastMoveDest = pointClicked;
            this.movePiece(this.board.activePiece, pointClicked);
            if (!this.board.activePiece.point.isEqual(this.board.lastMoveSrc)) {
                moving = true;
            }
        }
        if (isMouseDown || moving) {
            this.disableSelection();
        }
        this.disableSelection();
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (pieceClicked && !moving) {
            this.onFreeMode(pieceClicked);
            this.onPieceClicked(pieceClicked, pointClicked);
        }
    }
    addDrawPoint(x, y, crtl, alt, shift) {
        const upPoint = this.getDrawingPoint(x, y, crtl, alt, shift);
        if (this.drawPoint.isEqual(upPoint)) {
            const circle = new Circle();
            circle.drawPoint = upPoint;
            if (!this.drawProvider.containsCircle(circle)) {
                this.drawProvider.addCircle(circle);
            }
            else {
                this.drawProvider.reomveCircle(circle);
            }
        }
        else {
            const arrow = new Arrow();
            arrow.start = this.drawPoint;
            arrow.end = upPoint;
            if (!this.drawProvider.containsArrow(arrow)) {
                this.drawProvider.addArrow(arrow);
            }
            else {
                this.drawProvider.removeArrow(arrow);
            }
        }
    }
    move(coords) {
        if (coords) {
            const sourceIndexes = MoveUtils.translateCoordsToIndex(coords.substring(0, 2), this.board.reverted);
            const destIndexes = MoveUtils.translateCoordsToIndex(coords.substring(2, 4), this.board.reverted);
            const srcPiece = this.getPieceByPoint(sourceIndexes.yAxis, sourceIndexes.xAxis);
            if (srcPiece) {
                if ((this.board.currentWhitePlayer &&
                    srcPiece.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        srcPiece.color === Color.WHITE)) {
                    return;
                }
                this.prepareActivePiece(srcPiece, srcPiece.point);
                if (this.board.isPointInPossibleMoves(new Point(destIndexes.yAxis, destIndexes.xAxis)) ||
                    this.board.isPointInPossibleCaptures(new Point(destIndexes.yAxis, destIndexes.xAxis))) {
                    this.saveClone();
                    this.movePiece(srcPiece, new Point(destIndexes.yAxis, destIndexes.xAxis), coords.length === 5 ? +coords.substring(4, 5) : 0);
                    this.board.lastMoveSrc = new Point(sourceIndexes.yAxis, sourceIndexes.xAxis);
                    this.board.lastMoveDest = new Point(destIndexes.yAxis, destIndexes.xAxis);
                    this.disableSelection();
                }
                else {
                    this.disableSelection();
                }
            }
        }
    }
    getCustomPieceIcons(piece) {
        return JSON.parse(`{ "background-image": "url('${this.pieceIconManager.getPieceIcon(piece)}')"}`);
    }
    isPieceDisabled(pieceClicked) {
        if (pieceClicked && pieceClicked.point) {
            const foundCapture = this.board.possibleCaptures.find((capture) => capture.col === pieceClicked.point.col &&
                capture.row === pieceClicked.point.row);
            if (foundCapture) {
                return false;
            }
        }
        return (pieceClicked &&
            ((this.lightDisabled && pieceClicked.color === Color.WHITE) ||
                (this.darkDisabled && pieceClicked.color === Color.BLACK)));
    }
}
NgxChessBoardComponent.ɵfac = function NgxChessBoardComponent_Factory(t) { return new (t || NgxChessBoardComponent)(i0.ɵɵdirectiveInject(i1.NgxChessBoardService)); };
NgxChessBoardComponent.ɵcmp = i0.ɵɵdefineComponent({ type: NgxChessBoardComponent, selectors: [["ngx-chess-board"]], viewQuery: function NgxChessBoardComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, true);
        i0.ɵɵviewQuery(_c1, true);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.boardRef = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.modal = _t.first);
    } }, hostBindings: function NgxChessBoardComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("contextmenu", function NgxChessBoardComponent_contextmenu_HostBindingHandler($event) { return ctx.onRightClick($event); });
    } }, inputs: { darkTileColor: "darkTileColor", lightTileColor: "lightTileColor", showCoords: "showCoords", dragDisabled: "dragDisabled", drawDisabled: "drawDisabled", lightDisabled: "lightDisabled", darkDisabled: "darkDisabled", freeMode: "freeMode", size: "size", pieceIcons: "pieceIcons" }, outputs: { moveChange: "moveChange", checkmate: "checkmate", stalemate: "stalemate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 12, vars: 15, consts: [["id", "board", 3, "pointerdown", "pointerup"], ["boardRef", ""], ["id", "drag"], ["class", "board-row", 4, "ngFor", "ngForOf"], [2, "position", "absolute", "top", "0", "pointer-events", "none"], [4, "ngFor", "ngForOf"], ["class", "arrow", 4, "ngFor", "ngForOf"], ["fill-opacity", "0.0", "stroke-width", "2", 4, "ngFor", "ngForOf"], ["modal", ""], [1, "board-row"], ["class", "board-col", 3, "current-selection", "dest-move", "king-check", "point-circle", "possible-capture", "possible-point", "source-move", "background-color", 4, "ngFor", "ngForOf"], [1, "board-col"], ["class", "yCoord", 3, "color", "font-size", 4, "ngIf"], ["class", "xCoord", 3, "color", "font-size", 4, "ngIf"], ["style", "height:100%; width:100%", 4, "ngIf"], [1, "yCoord"], [1, "xCoord"], [2, "height", "100%", "width", "100%"], ["cdkDrag", "", 3, "cdkDragDisabled", "innerHTML", "ngClass", "ngStyle", "cdkDragEnded", "cdkDragStarted"], ["markerHeight", "13", "markerWidth", "13", "orient", "auto", "refX", "9", "refY", "6", 3, "id"], ["d", "M2,2 L2,11 L10,6 L2,2"], [1, "arrow"], ["fill-opacity", "0.0", "stroke-width", "2"]], template: function NgxChessBoardComponent_Template(rf, ctx) { if (rf & 1) {
        const _r26 = i0.ɵɵgetCurrentView();
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵlistener("pointerdown", function NgxChessBoardComponent_Template_div_pointerdown_0_listener($event) { i0.ɵɵrestoreView(_r26); const _r5 = i0.ɵɵreference(11); return !_r5.opened && ctx.onMouseDown($event); })("pointerup", function NgxChessBoardComponent_Template_div_pointerup_0_listener($event) { i0.ɵɵrestoreView(_r26); const _r5 = i0.ɵɵreference(11); return !_r5.opened && ctx.onMouseUp($event); });
        i0.ɵɵelementStart(2, "div", 2);
        i0.ɵɵtemplate(3, NgxChessBoardComponent_div_3_Template, 2, 1, "div", 3);
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(4, "svg", 4);
        i0.ɵɵtemplate(5, NgxChessBoardComponent__svg_defs_5_Template, 3, 3, "defs", 5);
        i0.ɵɵtemplate(6, NgxChessBoardComponent__svg_line_6_Template, 1, 6, "line", 6);
        i0.ɵɵpipe(7, "async");
        i0.ɵɵtemplate(8, NgxChessBoardComponent__svg_circle_8_Template, 1, 4, "circle", 7);
        i0.ɵɵpipe(9, "async");
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelement(10, "app-piece-promotion-modal", null, 8);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵstyleProp("height", ctx.heightAndWidth, "px")("width", ctx.heightAndWidth, "px");
        i0.ɵɵadvance(3);
        i0.ɵɵproperty("ngForOf", ctx.board.board);
        i0.ɵɵadvance(1);
        i0.ɵɵattribute("height", ctx.heightAndWidth)("width", ctx.heightAndWidth);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", i0.ɵɵpureFunction0(14, _c2));
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind1(7, 10, ctx.drawProvider.arrows$));
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind1(9, 12, ctx.drawProvider.circles$));
    } }, directives: [i2.NgForOf, i3.PiecePromotionModalComponent, i2.NgIf, i4.CdkDrag, i2.NgClass, i2.NgStyle], pipes: [i2.AsyncPipe], styles: ["@charset \"UTF-8\";#board[_ngcontent-%COMP%]{font-family:Courier New,serif;position:relative}.board-row[_ngcontent-%COMP%]{display:block;height:12.5%;position:relative;width:100%}.board-col[_ngcontent-%COMP%]{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece[_ngcontent-%COMP%], .piece[_ngcontent-%COMP%]:after{box-sizing:border-box}.piece[_ngcontent-%COMP%]:after{content:\"\u200B\"}#drag[_ngcontent-%COMP%]{height:100%;width:100%}.possible-point[_ngcontent-%COMP%]{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture[_ngcontent-%COMP%]:hover, .possible-point[_ngcontent-%COMP%]:hover{opacity:.4}.possible-capture[_ngcontent-%COMP%]{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check[_ngcontent-%COMP%]{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move[_ngcontent-%COMP%]{background-color:rgba(146,111,26,.79)!important}.dest-move[_ngcontent-%COMP%]{background-color:#b28e1a!important}.current-selection[_ngcontent-%COMP%]{background-color:#72620b!important}.yCoord[_ngcontent-%COMP%]{right:.2em}.xCoord[_ngcontent-%COMP%], .yCoord[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord[_ngcontent-%COMP%]{bottom:0;left:.2em}.hovering[_ngcontent-%COMP%]{background-color:red!important}.arrow[_ngcontent-%COMP%]{stroke-width:2}svg[_ngcontent-%COMP%]{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}[_nghost-%COMP%]{display:inline-block!important}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxChessBoardComponent, [{
        type: Component,
        args: [{
                selector: 'ngx-chess-board',
                templateUrl: './ngx-chess-board.component.html',
                styleUrls: ['./ngx-chess-board.component.scss'],
            }]
    }], function () { return [{ type: i1.NgxChessBoardService }]; }, { darkTileColor: [{
            type: Input
        }], lightTileColor: [{
            type: Input
        }], showCoords: [{
            type: Input
        }], dragDisabled: [{
            type: Input
        }], drawDisabled: [{
            type: Input
        }], lightDisabled: [{
            type: Input
        }], darkDisabled: [{
            type: Input
        }], freeMode: [{
            type: Input
        }], moveChange: [{
            type: Output
        }], checkmate: [{
            type: Output
        }], stalemate: [{
            type: Output
        }], boardRef: [{
            type: ViewChild,
            args: ['boardRef']
        }], modal: [{
            type: ViewChild,
            args: ['modal']
        }], size: [{
            type: Input,
            args: ['size']
        }], pieceIcons: [{
            type: Input,
            args: ['pieceIcons']
        }], onRightClick: [{
            type: HostListener,
            args: ['contextmenu', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyIsImxpYi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUNILFNBQVMsRUFFVCxZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRU4sU0FBUyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDaEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFakYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbkUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDcEYsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sdUJBQXVC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O2tCQURkLEtBQUs7bUJBQUMsTUFBTTtZQWdCRixVQUFVO2tCQURwQixLQUFLO21CQUFDLFlBQVk7WUFNbkIsWUFBWTtrQkFEWCxZQUFZO21CQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENka0RyYWdFbmQsIENka0RyYWdTdGFydCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG4gICAgRWxlbWVudFJlZixcclxuICAgIEV2ZW50RW1pdHRlcixcclxuICAgIEhvc3RMaXN0ZW5lcixcclxuICAgIElucHV0LFxyXG4gICAgT25DaGFuZ2VzLFxyXG4gICAgT25Jbml0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgU2ltcGxlQ2hhbmdlcyxcclxuICAgIFZpZXdDaGlsZCxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQm9hcmRMb2FkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLWxvYWRlcic7XHJcbmltcG9ydCB7IEJvYXJkU3RhdGUgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlJztcclxuaW1wb3J0IHsgQm9hcmRTdGF0ZVByb3ZpZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1zdGF0ZS1wcm92aWRlcic7XHJcbmltcG9ydCB7IE1vdmVTdGF0ZVByb3ZpZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9tb3ZlLXN0YXRlLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgQ29vcmRzUHJvdmlkZXIgfSBmcm9tICcuL2Nvb3Jkcy9jb29yZHMtcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBBcnJvdyB9IGZyb20gJy4vZHJhd2luZy10b29scy9hcnJvdyc7XHJcbmltcG9ydCB7IENpcmNsZSB9IGZyb20gJy4vZHJhd2luZy10b29scy9jaXJjbGUnO1xyXG5pbXBvcnQgeyBEcmF3UG9pbnQgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvZHJhdy1wb2ludCc7XHJcbmltcG9ydCB7IERyYXdQcm92aWRlciB9IGZyb20gJy4vZHJhd2luZy10b29scy9kcmF3LXByb3ZpZGVyJztcclxuaW1wb3J0IHsgSGlzdG9yeU1vdmUgfSBmcm9tICcuL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUnO1xyXG5pbXBvcnQgeyBIaXN0b3J5TW92ZVByb3ZpZGVyIH0gZnJvbSAnLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuL21vZGVscy9ib2FyZCc7XHJcbmltcG9ydCB7IEJpc2hvcCB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9iaXNob3AnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9jb2xvcic7XHJcbmltcG9ydCB7IEtpbmcgfSBmcm9tICcuL21vZGVscy9waWVjZXMva2luZyc7XHJcbmltcG9ydCB7IEtuaWdodCB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9rbmlnaHQnO1xyXG5pbXBvcnQgeyBQYXduIH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL3Bhd24nO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9waWVjZSc7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL3BvaW50JztcclxuaW1wb3J0IHsgUXVlZW4gfSBmcm9tICcuL21vZGVscy9waWVjZXMvcXVlZW4nO1xyXG5pbXBvcnQgeyBSb29rIH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL3Jvb2snO1xyXG5pbXBvcnQgeyBOZ3hDaGVzc0JvYXJkVmlldyB9IGZyb20gJy4vbmd4LWNoZXNzLWJvYXJkLXZpZXcnO1xyXG5pbXBvcnQgeyBBdmFpbGFibGVNb3ZlRGVjb3JhdG9yIH0gZnJvbSAnLi9waWVjZS1kZWNvcmF0b3IvYXZhaWxhYmxlLW1vdmUtZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4vcGllY2UtcHJvbW90aW9uLW1vZGFsL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hDaGVzc0JvYXJkU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9uZ3gtY2hlc3MtYm9hcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbnN0YW50cyB9IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgUGllY2VJY29uSW5wdXQgfSBmcm9tICcuL3V0aWxzL2lucHV0cy9waWVjZS1pY29uLWlucHV0JztcclxuaW1wb3J0IHsgUGllY2VJY29uSW5wdXRNYW5hZ2VyIH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtaWNvbi1pbnB1dC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgTW92ZVV0aWxzIH0gZnJvbSAnLi91dGlscy9tb3ZlLXV0aWxzJztcclxuaW1wb3J0IHsgVW5pY29kZUNvbnN0YW50cyB9IGZyb20gJy4vdXRpbHMvdW5pY29kZS1jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNb3ZlQ2hhbmdlIGV4dGVuZHMgSGlzdG9yeU1vdmUge1xyXG4gICAgY2hlY2s6IGJvb2xlYW47XHJcbiAgICBzdGFsZW1hdGU6IGJvb2xlYW47XHJcbiAgICBjaGVja21hdGU6IGJvb2xlYW47XHJcbiAgICBmZW46IHN0cmluZztcclxuICAgIGZyZWVNb2RlOiBib29sZWFuO1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbmd4LWNoZXNzLWJvYXJkJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hDaGVzc0JvYXJkQ29tcG9uZW50XHJcbiAgICBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBOZ3hDaGVzc0JvYXJkVmlldyB7XHJcbiAgICBASW5wdXQoKSBkYXJrVGlsZUNvbG9yID0gQ29uc3RhbnRzLkRFRkFVTFRfREFSS19USUxFX0NPTE9SO1xyXG4gICAgQElucHV0KCkgbGlnaHRUaWxlQ29sb3I6IHN0cmluZyA9IENvbnN0YW50cy5ERUZBVUxUX0xJR0hUX1RJTEVfQ09MT1I7XHJcbiAgICBASW5wdXQoKSBzaG93Q29vcmRzID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIGRyYWdEaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgQElucHV0KCkgZHJhd0Rpc2FibGVkID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBsaWdodERpc2FibGVkID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBkYXJrRGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogRW5hYmxpbmcgZnJlZSBtb2RlIHJlbW92ZXMgdHVybi1iYXNlZCByZXN0cmljdGlvbiBhbmQgYWxsb3dzIHRvIG1vdmUgYW55IHBpZWNlIGZyZWVseSFcclxuICAgICAqL1xyXG4gICAgQElucHV0KCkgZnJlZU1vZGUgPSBmYWxzZTtcclxuICAgIEBPdXRwdXQoKSBtb3ZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNb3ZlQ2hhbmdlPigpO1xyXG4gICAgQE91dHB1dCgpIGNoZWNrbWF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICAgIEBPdXRwdXQoKSBzdGFsZW1hdGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcblxyXG4gICAgcGllY2VTaXplOiBudW1iZXI7XHJcbiAgICBzZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgQFZpZXdDaGlsZCgnYm9hcmRSZWYnKVxyXG4gICAgYm9hcmRSZWY6IEVsZW1lbnRSZWY7XHJcbiAgICBAVmlld0NoaWxkKCdtb2RhbCcpIG1vZGFsOiBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50O1xyXG4gICAgYm9hcmQ6IEJvYXJkO1xyXG4gICAgYm9hcmRTdGF0ZVByb3ZpZGVyOiBCb2FyZFN0YXRlUHJvdmlkZXI7XHJcbiAgICBtb3ZlU3RhdGVQcm92aWRlcjogTW92ZVN0YXRlUHJvdmlkZXI7XHJcbiAgICBtb3ZlSGlzdG9yeVByb3ZpZGVyOiBIaXN0b3J5TW92ZVByb3ZpZGVyO1xyXG4gICAgYm9hcmRMb2FkZXI6IEJvYXJkTG9hZGVyO1xyXG4gICAgY29vcmRzOiBDb29yZHNQcm92aWRlciA9IG5ldyBDb29yZHNQcm92aWRlcigpO1xyXG4gICAgZGlzYWJsaW5nID0gZmFsc2U7XHJcbiAgICBkcmF3UHJvdmlkZXI6IERyYXdQcm92aWRlcjtcclxuICAgIGRyYXdQb2ludDogRHJhd1BvaW50O1xyXG4gICAgcGllY2VJY29uTWFuYWdlcjogUGllY2VJY29uSW5wdXRNYW5hZ2VyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbmd4Q2hlc3NCb2FyZFNlcnZpY2U6IE5neENoZXNzQm9hcmRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IG5ldyBCb2FyZCgpO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIgPSBuZXcgQm9hcmRMb2FkZXIodGhpcy5ib2FyZCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcclxuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlciA9IG5ldyBCb2FyZFN0YXRlUHJvdmlkZXIoKTtcclxuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIgPSBuZXcgSGlzdG9yeU1vdmVQcm92aWRlcigpO1xyXG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyID0gbmV3IERyYXdQcm92aWRlcigpO1xyXG4gICAgICAgIHRoaXMucGllY2VJY29uTWFuYWdlciA9IG5ldyBQaWVjZUljb25JbnB1dE1hbmFnZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoZWlnaHRBbmRXaWR0aDogbnVtYmVyID0gQ29uc3RhbnRzLkRFRkFVTFRfU0laRTtcclxuXHJcbiAgICBASW5wdXQoJ3NpemUnKVxyXG4gICAgcHVibGljIHNldCBzaXplKHNpemU6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgc2l6ZSAmJlxyXG4gICAgICAgICAgICBzaXplID49IENvbnN0YW50cy5NSU5fQk9BUkRfU0laRSAmJlxyXG4gICAgICAgICAgICBzaXplIDw9IENvbnN0YW50cy5NQVhfQk9BUkRfU0laRVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodEFuZFdpZHRoID0gc2l6ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodEFuZFdpZHRoID0gQ29uc3RhbnRzLkRFRkFVTFRfU0laRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBpZWNlU2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgncGllY2VJY29ucycpXHJcbiAgICBwdWJsaWMgc2V0IHBpZWNlSWNvbnMocGllY2VJY29uczogUGllY2VJY29uSW5wdXQpIHtcclxuICAgICAgICB0aGlzLnBpZWNlSWNvbk1hbmFnZXIucGllY2VJY29uSW5wdXQgPSBwaWVjZUljb25zO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgWyckZXZlbnQnXSlcclxuICAgIG9uUmlnaHRDbGljayhldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgKGNoYW5nZXMubGlnaHREaXNhYmxlZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5saWdodERpc2FibGVkICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcikgfHxcclxuICAgICAgICAgICAgKGNoYW5nZXMuZGFya0Rpc2FibGVkICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhcmtEaXNhYmxlZCAmJlxyXG4gICAgICAgICAgICAgICAgIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMubmd4Q2hlc3NCb2FyZFNlcnZpY2UuY29tcG9uZW50TWV0aG9kQ2FsbGVkJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnJlc2V0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQaWVjZVNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwICYmICF0aGlzLmRyYXdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZERyYXdQb2ludChcclxuICAgICAgICAgICAgICAgIGV2ZW50LngsXHJcbiAgICAgICAgICAgICAgICBldmVudC55LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRyYWdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBvaW50Q2xpY2tlZCA9IHRoaXMuZ2V0Q2xpY2tQb2ludChldmVudCk7XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSAmJlxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuaXNFcXVhbCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50KSAmJlxyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZ1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwaWVjZUNsaWNrZWQgPSB0aGlzLmdldFBpZWNlQnlQb2ludChcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLnJvdyxcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmNvbFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzUGllY2VEaXNhYmxlZChwaWVjZUNsaWNrZWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2tFdmVudChwb2ludENsaWNrZWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gICB0aGlzLnBvc3NpYmxlTW92ZXMgPSBhY3RpdmVQaWVjZS5nZXRQb3NzaWJsZU1vdmVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUGllY2VDbGlja2VkKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAodGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5CTEFDSykgfHxcclxuICAgICAgICAgICAgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnByZXBhcmVBY3RpdmVQaWVjZShwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFsaWRhdGVzIHdoZXRoZXIgZnJlZW1vZGUgaXMgdHVybmVkIG9uIVxyXG4gICAgICovXHJcbiAgICBpc0ZyZWVNb2RlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZyZWVNb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvY2Vzc2VzIGxvZ2ljIHRvIGFsbG93IGZyZWVNb2RlIGJhc2VkIGxvZ2ljIHByb2Nlc3NpbmdcclxuICAgICAqL1xyXG4gICAgb25GcmVlTW9kZShwaWVjZUNsaWNrZWQpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICF0aGlzLmlzRnJlZU1vZGUoKSB8fFxyXG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQgPT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQgPT09IG51bGxcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXRzIHBsYXllciBhcyB3aGl0ZSBpbi1jYXNlIHdoaXRlIHBpZWNlcyBhcmUgc2VsZWN0ZWQsIGFuZCB2aWNlLXZlcnNhIHdoZW4gYmxhY2sgaXMgc2VsZWN0ZWRcclxuICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA9IHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNoZWNrSWZQYXduRmlyc3RNb3ZlKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tJZlJvb2tNb3ZlZCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlKTtcclxuICAgICAgICB0aGlzLmNoZWNrSWZLaW5nTW92ZWQodGhpcy5ib2FyZC5hY3RpdmVQaWVjZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCA9IHRoaXMuYm9hcmQuaXNLaW5nSW5DaGVjayhcclxuICAgICAgICAgICAgQ29sb3IuQkxBQ0ssXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQgPSB0aGlzLmJvYXJkLmlzS2luZ0luQ2hlY2soXHJcbiAgICAgICAgICAgIENvbG9yLldISVRFLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgY2hlY2sgPVxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQgfHwgdGhpcy5ib2FyZC53aGl0ZUtpbmdDaGVja2VkO1xyXG4gICAgICAgIGNvbnN0IGNoZWNrbWF0ZSA9XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLkJMQUNLKSB8fFxyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3ZlcyhDb2xvci5XSElURSk7XHJcbiAgICAgICAgY29uc3Qgc3RhbGVtYXRlID1cclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBhdChDb2xvci5CTEFDSykgfHwgdGhpcy5jaGVja0ZvclBhdChDb2xvci5XSElURSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzYWJsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFzdE1vdmUgPSB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0TGFzdE1vdmUoKTtcclxuICAgICAgICBpZiAobGFzdE1vdmUgJiYgcHJvbW90aW9uSW5kZXgpIHtcclxuICAgICAgICAgICAgbGFzdE1vdmUubW92ZSArPSBwcm9tb3Rpb25JbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubW92ZUNoYW5nZS5lbWl0KHtcclxuICAgICAgICAgICAgLi4ubGFzdE1vdmUsXHJcbiAgICAgICAgICAgIGNoZWNrLFxyXG4gICAgICAgICAgICBjaGVja21hdGUsXHJcbiAgICAgICAgICAgIHN0YWxlbWF0ZSxcclxuICAgICAgICAgICAgZmVuOiB0aGlzLmJvYXJkLmZlbixcclxuICAgICAgICAgICAgZnJlZU1vZGU6IHRoaXMuZnJlZU1vZGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNhYmxlU2VsZWN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlQWN0aXZlUGllY2UocGllY2VDbGlja2VkOiBQaWVjZSwgcG9pbnRDbGlja2VkOiBQb2ludCkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgPSBwaWVjZUNsaWNrZWQ7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gbmV3IEF2YWlsYWJsZU1vdmVEZWNvcmF0b3IoXHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCxcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA/IENvbG9yLldISVRFIDogQ29sb3IuQkxBQ0ssXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICApLmdldFBvc3NpYmxlQ2FwdHVyZXMoKTtcclxuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBuZXcgQXZhaWxhYmxlTW92ZURlY29yYXRvcihcclxuICAgICAgICAgICAgcGllY2VDbGlja2VkLFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID8gQ29sb3IuV0hJVEUgOiBDb2xvci5CTEFDSyxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFxyXG4gICAgICAgICkuZ2V0UG9zc2libGVNb3ZlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBpZWNlQnlQb2ludChyb3c6IG51bWJlciwgY29sOiBudW1iZXIpOiBQaWVjZSB7XHJcbiAgICAgICAgcm93ID0gTWF0aC5mbG9vcihyb3cpO1xyXG4gICAgICAgIGNvbCA9IE1hdGguZmxvb3IoY29sKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib2FyZC5waWVjZXMuZmluZChcclxuICAgICAgICAgICAgKHBpZWNlKSA9PiBwaWVjZS5wb2ludC5jb2wgPT09IGNvbCAmJiBwaWVjZS5wb2ludC5yb3cgPT09IHJvd1xyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNLaW5nQ2hlY2tlZChwaWVjZTogUGllY2UpIHtcclxuICAgICAgICBpZiAocGllY2UgaW5zdGFuY2VvZiBLaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEVcclxuICAgICAgICAgICAgICAgID8gdGhpcy5ib2FyZC53aGl0ZUtpbmdDaGVja2VkXHJcbiAgICAgICAgICAgICAgICA6IHRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2xpY2tQb2ludChldmVudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoXHJcbiAgICAgICAgICAgIE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgICAoZXZlbnQueSAtXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCkgL1xyXG4gICAgICAgICAgICAgICAgKHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGVpZ2h0IC9cclxuICAgICAgICAgICAgICAgICAgICA4KVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAgICAgKGV2ZW50LnggLVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSAvXHJcbiAgICAgICAgICAgICAgICAodGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC9cclxuICAgICAgICAgICAgICAgICAgICA4KVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlUGllY2UodG9Nb3ZlUGllY2U6IFBpZWNlLCBuZXdQb2ludDogUG9pbnQsIHByb21vdGlvbkluZGV4PzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGVzdFBpZWNlID0gdGhpcy5ib2FyZC5waWVjZXMuZmluZChcclxuICAgICAgICAgICAgKHBpZWNlKSA9PlxyXG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sID09PSBuZXdQb2ludC5jb2wgJiZcclxuICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyA9PT0gbmV3UG9pbnQucm93XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKGRlc3RQaWVjZSAmJiB0b01vdmVQaWVjZS5jb2xvciAhPT0gZGVzdFBpZWNlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxyXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PiBwaWVjZSAhPT0gZGVzdFBpZWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRlc3RQaWVjZSAmJiB0b01vdmVQaWVjZS5jb2xvciA9PT0gZGVzdFBpZWNlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1vdmUgPSBuZXcgSGlzdG9yeU1vdmUoXHJcbiAgICAgICAgICAgIE1vdmVVdGlscy5mb3JtYXQodG9Nb3ZlUGllY2UucG9pbnQsIG5ld1BvaW50LCB0aGlzLmJvYXJkLnJldmVydGVkKSxcclxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UuY29uc3RhbnQubmFtZSxcclxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UuY29sb3IgPT09IENvbG9yLldISVRFID8gJ3doaXRlJyA6ICdibGFjaycsXHJcbiAgICAgICAgICAgICEhZGVzdFBpZWNlXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuYWRkTW92ZShtb3ZlKTtcclxuXHJcbiAgICAgICAgaWYgKHRvTW92ZVBpZWNlIGluc3RhbmNlb2YgS2luZykge1xyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzTW92ZWQgPSBNYXRoLmFicyhuZXdQb2ludC5jb2wgLSB0b01vdmVQaWVjZS5wb2ludC5jb2wpO1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlc01vdmVkID4gMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1BvaW50LmNvbCA8IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b01vdmVQaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5mcmVlTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Um9vay5wb2ludC5jb2wgPSB0aGlzLmJvYXJkLnJldmVydGVkID8gMiA6IDM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodFJvb2sgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlGaWVsZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQucm93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA3XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZnJlZU1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyA0IDogNTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b01vdmVQaWVjZSBpbnN0YW5jZW9mIFBhd24pIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0lmUGF3blRha2VzRW5QYXNzYW50KG5ld1BvaW50KTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0lmUGF3bkVucGFzc2FudGVkKHRvTW92ZVBpZWNlLCBuZXdQb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b01vdmVQaWVjZS5wb2ludCA9IG5ld1BvaW50O1xyXG4gICAgICAgIHRoaXMuaW5jcmVhc2VGdWxsTW92ZUNvdW50KCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSAhdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXI7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jaGVja0ZvclBhd25Qcm9tb3RlKHRvTW92ZVBpZWNlLCBwcm9tb3Rpb25JbmRleCkpIHtcclxuICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrSWZQYXduRmlyc3RNb3ZlKHBpZWNlOiBQaWVjZSkge1xyXG4gICAgICAgIGlmIChwaWVjZSBpbnN0YW5jZW9mIFBhd24pIHtcclxuICAgICAgICAgICAgcGllY2UuaXNNb3ZlZEFscmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVja0ZvclBhd25Qcm9tb3RlKHRvUHJvbW90ZVBpZWNlOiBQaWVjZSwgcHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoISh0b1Byb21vdGVQaWVjZSBpbnN0YW5jZW9mIFBhd24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b1Byb21vdGVQaWVjZS5wb2ludC5yb3cgPT09IDAgfHwgdG9Qcm9tb3RlUGllY2UucG9pbnQucm93ID09PSA3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxyXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PiBwaWVjZSAhPT0gdG9Qcm9tb3RlUGllY2VcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgbWFrZSBtb3ZlIG1hbnVhbGx5LCB3ZSBwYXNzIHByb21vdGlvbiBpbmRleCBhbHJlYWR5LCBzbyB3ZSBkb24ndCBuZWVkXHJcbiAgICAgICAgICAgIC8vIHRvIGFjcXVpcmUgaXQgZnJvbSBwcm9tb3RlIGRpYWxvZ1xyXG4gICAgICAgICAgICBpZiAoIXByb21vdGlvbkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Qcm9tb3RlRGlhbG9nKHRvUHJvbW90ZVBpZWNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVByb21vdGlvbkNob2ljZSh0b1Byb21vdGVQaWVjZSwgcHJvbW90aW9uSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKHByb21vdGlvbkluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5Qcm9tb3RlRGlhbG9nKHBpZWNlOiBQaWVjZSkge1xyXG4gICAgICAgIHRoaXMubW9kYWwub3BlbigoaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlUHJvbW90aW9uQ2hvaWNlKHBpZWNlLCBpbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJNb3ZlQWN0aW9ucyhpbmRleCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZVByb21vdGlvbkNob2ljZShwaWVjZTogUGllY2UsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBpc1doaXRlID0gcGllY2UuY29sb3IgPT09IENvbG9yLldISVRFO1xyXG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgUXVlZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5jb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNXaGl0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBVbmljb2RlQ29uc3RhbnRzLldISVRFX1FVRUVOXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFVuaWNvZGVDb25zdGFudHMuQkxBQ0tfUVVFRU4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJvb2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5jb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNXaGl0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBVbmljb2RlQ29uc3RhbnRzLldISVRFX1JPT0tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogVW5pY29kZUNvbnN0YW50cy5CTEFDS19ST09LLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaXNob3AoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5jb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNXaGl0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBVbmljb2RlQ29uc3RhbnRzLldISVRFX0JJU0hPUFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBVbmljb2RlQ29uc3RhbnRzLkJMQUNLX0JJU0hPUCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgS25pZ2h0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UuY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzV2hpdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVW5pY29kZUNvbnN0YW50cy5XSElURV9LTklHSFRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogVW5pY29kZUNvbnN0YW50cy5CTEFDS19LTklHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcclxuICAgICAgICB0aGlzLmJvYXJkLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5jb29yZHMucmVzZXQoKTtcclxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuZnJlZU1vZGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXZlcnNlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJvYXJkLnJldmVyc2UoKTtcclxuICAgICAgICB0aGlzLmNvb3Jkcy5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQm9hcmQoYm9hcmQ6IEJvYXJkKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuc2V0Qm9hcmQodGhpcy5ib2FyZCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgdW5kbygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0Qm9hcmQgPSB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5wb3AoKS5ib2FyZDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RCb2FyZC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ib2FyZCA9IGxhc3RCb2FyZDtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZExvYWRlci5zZXRCb2FyZCh0aGlzLmJvYXJkKTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldE1vdmVIaXN0b3J5KCk6IEhpc3RvcnlNb3ZlW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0QWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RkVOKGZlbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZExvYWRlci5sb2FkRkVOKGZlbik7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5jb29yZHMucmVzZXQoKTtcclxuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RkVOKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmQuZmVuO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWdFbmRlZChldmVudDogQ2RrRHJhZ0VuZCk6IHZvaWQge1xyXG4gICAgICAgIGV2ZW50LnNvdXJjZS5yZXNldCgpO1xyXG4gICAgICAgIGV2ZW50LnNvdXJjZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzAnO1xyXG4gICAgICAgIGV2ZW50LnNvdXJjZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcclxuICAgICAgICBldmVudC5zb3VyY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvdWNoQWN0aW9uID0gJ2F1dG8nO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWdTdGFydChldmVudDogQ2RrRHJhZ1N0YXJ0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBldmVudC5zb3VyY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlO1xyXG4gICAgICAgIHN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuICAgICAgICBzdHlsZS56SW5kZXggPSAnMTAwMCc7XHJcbiAgICAgICAgc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XHJcbiAgICAgICAgc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3UG9pbnQgPSB0aGlzLmdldERyYXdpbmdQb2ludChcclxuICAgICAgICAgICAgICAgIGV2ZW50LngsXHJcbiAgICAgICAgICAgICAgICBldmVudC55LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcG9pbnRDbGlja2VkID0gdGhpcy5nZXRDbGlja1BvaW50KGV2ZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlICYmXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5pc0VxdWFsKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGllY2VDbGlja2VkID0gdGhpcy5nZXRQaWVjZUJ5UG9pbnQoXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5jb2xcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5mcmVlTW9kZSkge1xyXG4gICAgICAgICAgICBpZiAocGllY2VDbGlja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA9IChwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGllY2VDbGlja2VkKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXREcmF3aW5nUG9pbnQoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICBjcnRsOiBib29sZWFuLFxyXG4gICAgICAgIGFsdDogYm9vbGVhbixcclxuICAgICAgICBzaGlmdDogYm9vbGVhblxyXG4gICAgKSB7XHJcbiAgICAgICAgY29uc3Qgc3F1YXJlU2l6ZSA9IHRoaXMuaGVpZ2h0QW5kV2lkdGggLyA4O1xyXG4gICAgICAgIGNvbnN0IHh4ID0gTWF0aC5mbG9vcihcclxuICAgICAgICAgICAgKHggLSB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkgL1xyXG4gICAgICAgICAgICBzcXVhcmVTaXplXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCB5eSA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICh5IC0gdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCkgL1xyXG4gICAgICAgICAgICBzcXVhcmVTaXplXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbG9yID0gJ2dyZWVuJztcclxuXHJcbiAgICAgICAgaWYgKGNydGwgfHwgc2hpZnQpIHtcclxuICAgICAgICAgICAgY29sb3IgPSAncmVkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFsdCkge1xyXG4gICAgICAgICAgICBjb2xvciA9ICdibHVlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChzaGlmdCB8fCBjcnRsKSAmJiBhbHQpIHtcclxuICAgICAgICAgICAgY29sb3IgPSAnb3JhbmdlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEcmF3UG9pbnQoXHJcbiAgICAgICAgICAgIE1hdGguZmxvb3IoeHggKiBzcXVhcmVTaXplICsgc3F1YXJlU2l6ZSAvIDIpLFxyXG4gICAgICAgICAgICBNYXRoLmZsb29yKHl5ICogc3F1YXJlU2l6ZSArIHNxdWFyZVNpemUgLyAyKSxcclxuICAgICAgICAgICAgY29sb3JcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tJZlJvb2tNb3ZlZChwaWVjZTogUGllY2UpIHtcclxuICAgICAgICBpZiAocGllY2UgaW5zdGFuY2VvZiBSb29rKSB7XHJcbiAgICAgICAgICAgIHBpZWNlLmlzTW92ZWRBbHJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0lmS2luZ01vdmVkKHBpZWNlOiBQaWVjZSkge1xyXG4gICAgICAgIGlmIChwaWVjZSBpbnN0YW5jZW9mIEtpbmcpIHtcclxuICAgICAgICAgICAgcGllY2UuaXNNb3ZlZEFscmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcjogQ29sb3IpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICF0aGlzLmJvYXJkLnBpZWNlc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigocGllY2UpID0+IHBpZWNlLmNvbG9yID09PSBjb2xvcilcclxuICAgICAgICAgICAgICAgIC5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgIChwaWVjZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGllY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRQb3NzaWJsZU1vdmVzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3ZlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhTW92ZVV0aWxzLndpbGxNb3ZlQ2F1c2VDaGVjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQucm93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92ZS5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlLmNvbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldFBvc3NpYmxlQ2FwdHVyZXMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNhcHR1cmUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFNb3ZlVXRpbHMud2lsbE1vdmVDYXVzZUNoZWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5jb2wsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUuY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0ZvclBhdChjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLldISVRFICYmICF0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLkJMQUNLICYmICF0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0lmUGF3bkVucGFzc2FudGVkKHBpZWNlOiBQYXduLCBuZXdQb2ludDogUG9pbnQpIHtcclxuICAgICAgICBpZiAoTWF0aC5hYnMocGllY2UucG9pbnQucm93IC0gbmV3UG9pbnQucm93KSA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQaWVjZSA9IHBpZWNlO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBvaW50ID0gbmV3IFBvaW50KFxyXG4gICAgICAgICAgICAgICAgKHBpZWNlLnBvaW50LnJvdyArIG5ld1BvaW50LnJvdykgLyAyLFxyXG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuZW5QYXNzYW50UGllY2UgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrSWZQYXduVGFrZXNFblBhc3NhbnQobmV3UG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgaWYgKG5ld1BvaW50LmlzRXF1YWwodGhpcy5ib2FyZC5lblBhc3NhbnRQb2ludCkpIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAocGllY2UpID0+IHBpZWNlICE9PSB0aGlzLmJvYXJkLmVuUGFzc2FudFBpZWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuZW5QYXNzYW50UG9pbnQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBpZWNlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzYXZlQ2xvbmUoKSB7XHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLmJvYXJkLmNsb25lKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJvYXJkLnJldmVydGVkKSB7XHJcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIuYWRkTW92ZShuZXcgQm9hcmRTdGF0ZShjbG9uZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZU1vdmVDbG9uZSgpIHtcclxuICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuYm9hcmQuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcclxuICAgICAgICAgICAgY2xvbmUucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vdmVTdGF0ZVByb3ZpZGVyLmFkZE1vdmUobmV3IEJvYXJkU3RhdGUoY2xvbmUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbGN1bGF0ZVBpZWNlU2l6ZSgpIHtcclxuICAgICAgICB0aGlzLnBpZWNlU2l6ZSA9IHRoaXMuaGVpZ2h0QW5kV2lkdGggLyAxMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluY3JlYXNlRnVsbE1vdmVDb3VudCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKSB7XHJcbiAgICAgICAgICAgICsrdGhpcy5ib2FyZC5mdWxsTW92ZUNvdW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUNsaWNrRXZlbnQocG9pbnRDbGlja2VkOiBQb2ludCwgaXNNb3VzZURvd246IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgbW92aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICgoXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuaXNQb2ludEluUG9zc2libGVNb3Zlcyhwb2ludENsaWNrZWQpIHx8XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuaXNQb2ludEluUG9zc2libGVDYXB0dXJlcyhwb2ludENsaWNrZWQpXHJcbiAgICAgICAgKSB8fCB0aGlzLmZyZWVNb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZUNsb25lKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQubGFzdE1vdmVTcmMgPSBuZXcgUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LnJvdyxcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQuY29sXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQubGFzdE1vdmVEZXN0ID0gcG9pbnRDbGlja2VkO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVQaWVjZSh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLCBwb2ludENsaWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmlzRXF1YWwodGhpcy5ib2FyZC5sYXN0TW92ZVNyYykpIHtcclxuICAgICAgICAgICAgICAgIG1vdmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdXNlRG93biB8fCBtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAocGllY2VDbGlja2VkICYmICFtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgIHRoaXMub25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZERyYXdQb2ludChcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIGNydGw6IGJvb2xlYW4sXHJcbiAgICAgICAgYWx0OiBib29sZWFuLFxyXG4gICAgICAgIHNoaWZ0OiBib29sZWFuXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB1cFBvaW50ID0gdGhpcy5nZXREcmF3aW5nUG9pbnQoeCwgeSwgY3J0bCwgYWx0LCBzaGlmdCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhd1BvaW50LmlzRXF1YWwodXBQb2ludCkpIHtcclxuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gbmV3IENpcmNsZSgpO1xyXG4gICAgICAgICAgICBjaXJjbGUuZHJhd1BvaW50ID0gdXBQb2ludDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYXdQcm92aWRlci5jb250YWluc0NpcmNsZShjaXJjbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRDaXJjbGUoY2lyY2xlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlb212ZUNpcmNsZShjaXJjbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyb3cgPSBuZXcgQXJyb3coKTtcclxuICAgICAgICAgICAgYXJyb3cuc3RhcnQgPSB0aGlzLmRyYXdQb2ludDtcclxuICAgICAgICAgICAgYXJyb3cuZW5kID0gdXBQb2ludDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kcmF3UHJvdmlkZXIuY29udGFpbnNBcnJvdyhhcnJvdykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmFkZEFycm93KGFycm93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlbW92ZUFycm93KGFycm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlKGNvb3Jkczogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvb3Jkcykge1xyXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VJbmRleGVzID0gTW92ZVV0aWxzLnRyYW5zbGF0ZUNvb3Jkc1RvSW5kZXgoXHJcbiAgICAgICAgICAgICAgICBjb29yZHMuc3Vic3RyaW5nKDAsIDIpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVzdEluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcclxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMiwgNCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnJldmVydGVkXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcmNQaWVjZSA9IHRoaXMuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4ZXMueEF4aXNcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzcmNQaWVjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQWN0aXZlUGllY2Uoc3JjUGllY2UsIHNyY1BpZWNlLnBvaW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZU1vdmVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoZGVzdEluZGV4ZXMueUF4aXMsIGRlc3RJbmRleGVzLnhBeGlzKVxyXG4gICAgICAgICAgICAgICAgICAgICkgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlQ2FwdHVyZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVQaWVjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGllY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yZHMubGVuZ3RoID09PSA1ID8gK2Nvb3Jkcy5zdWJzdHJpbmcoNCwgNSkgOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZVNyYyA9IG5ldyBQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZURlc3QgPSBuZXcgUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RJbmRleGVzLnlBeGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0SW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDdXN0b21QaWVjZUljb25zKHBpZWNlOiBQaWVjZSkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKFxyXG4gICAgICAgICAgICBgeyBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoJyR7dGhpcy5waWVjZUljb25NYW5hZ2VyLmdldFBpZWNlSWNvbihcclxuICAgICAgICAgICAgICAgIHBpZWNlXHJcbiAgICAgICAgICAgICl9JylcIn1gXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzUGllY2VEaXNhYmxlZChwaWVjZUNsaWNrZWQ6IFBpZWNlKSB7XHJcbiAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCAmJiBwaWVjZUNsaWNrZWQucG9pbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgZm91bmRDYXB0dXJlID0gdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAoY2FwdHVyZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLmNvbCA9PT0gcGllY2VDbGlja2VkLnBvaW50LmNvbCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmUucm93ID09PSBwaWVjZUNsaWNrZWQucG9pbnQucm93XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm91bmRDYXB0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcGllY2VDbGlja2VkICYmXHJcbiAgICAgICAgICAgICgodGhpcy5saWdodERpc2FibGVkICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5kYXJrRGlzYWJsZWQgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5CTEFDSykpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCI8ZGl2XHJcbiAgICBpZD1cImJvYXJkXCJcclxuICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiaGVpZ2h0QW5kV2lkdGhcIlxyXG4gICAgW3N0eWxlLndpZHRoLnB4XT1cImhlaWdodEFuZFdpZHRoXCJcclxuICAgIChwb2ludGVyZG93bik9XCIhbW9kYWwub3BlbmVkICYmIG9uTW91c2VEb3duKCRldmVudClcIlxyXG4gICAgKHBvaW50ZXJ1cCk9XCIhbW9kYWwub3BlbmVkICYmIG9uTW91c2VVcCgkZXZlbnQpXCJcclxuICAgICNib2FyZFJlZlxyXG4+XHJcbiAgICA8ZGl2IGlkPVwiZHJhZ1wiPlxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3M9XCJib2FyZC1yb3dcIlxyXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgcm93IG9mIGJvYXJkLmJvYXJkOyBsZXQgaSA9IGluZGV4XCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYm9hcmQtY29sXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5jdXJyZW50LXNlbGVjdGlvbl09XCJib2FyZC5pc1hZSW5BY3RpdmVNb3ZlKGksailcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmRlc3QtbW92ZV09XCJib2FyZC5pc1hZSW5EZXN0TW92ZShpLGopXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5raW5nLWNoZWNrXT1cIiBpc0tpbmdDaGVja2VkKGdldFBpZWNlQnlQb2ludChpLGopKVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MucG9pbnQtY2lyY2xlXT1cImJvYXJkLmlzWFlJblBvaW50U2VsZWN0aW9uKGksIGopXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5wb3NzaWJsZS1jYXB0dXJlXT1cImJvYXJkLmlzWFlJblBvc3NpYmxlQ2FwdHVyZXMoaSwgailcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLnBvc3NpYmxlLXBvaW50XT1cImJvYXJkLmlzWFlJblBvc3NpYmxlTW92ZXMoaSwgailcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLnNvdXJjZS1tb3ZlXT1cImJvYXJkLmlzWFlJblNvdXJjZU1vdmUoaSwgailcIlxyXG4gICAgICAgICAgICAgICAgW3N0eWxlLmJhY2tncm91bmQtY29sb3JdPVwiKChpICsgaikgJSAyID09PSAwICkgPyBsaWdodFRpbGVDb2xvciA6IGRhcmtUaWxlQ29sb3JcIlxyXG4gICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGNvbCBvZiByb3c7IGxldCBqID0gaW5kZXhcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwieUNvb3JkXCJcclxuICAgICAgICAgICAgICAgICAgICBbc3R5bGUuY29sb3JdPVwiKGkgJSAyID09PSAwKSA/IGxpZ2h0VGlsZUNvbG9yIDogZGFya1RpbGVDb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmZvbnQtc2l6ZS5weF09XCJwaWVjZVNpemUgLyA0XCJcclxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInNob3dDb29yZHMgJiYgaiA9PT0gN1wiXHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3tjb29yZHMueUNvb3Jkc1tpXX19XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwieENvb3JkXCJcclxuICAgICAgICAgICAgICAgICAgICBbc3R5bGUuY29sb3JdPVwiKGogJSAyID09PSAwKSA/IGxpZ2h0VGlsZUNvbG9yIDogZGFya1RpbGVDb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmZvbnQtc2l6ZS5weF09XCJwaWVjZVNpemUgLyA0XCJcclxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInNob3dDb29yZHMgJiYgaSA9PT0gN1wiXHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3tjb29yZHMueENvb3Jkc1tqXX19XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJnZXRQaWVjZUJ5UG9pbnQoaSwgaikgYXMgcGllY2VcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiaGVpZ2h0OjEwMCU7IHdpZHRoOjEwMCVcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2Nka0RyYWdEaXNhYmxlZF09XCJkcmFnRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbaW5uZXJIVE1MXT1cInBpZWNlSWNvbk1hbmFnZXIuaXNEZWZhdWx0SWNvbnMoKSA/IGdldFBpZWNlQnlQb2ludChpLGopLmNvbnN0YW50Lmljb24gOiAnJ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIidwaWVjZSdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGUuZm9udC1zaXplXT1cInBpZWNlU2l6ZSArICdweCdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJwaWVjZUljb25NYW5hZ2VyLmlzRGVmYXVsdEljb25zKCkgPyAnJyA6IGdldEN1c3RvbVBpZWNlSWNvbnMoZ2V0UGllY2VCeVBvaW50KGksaikpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGNka0RyYWdFbmRlZCk9XCJkcmFnRW5kZWQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjZGtEcmFnU3RhcnRlZCk9XCJkcmFnU3RhcnQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNka0RyYWdcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxzdmdcclxuICAgICAgICBbYXR0ci5oZWlnaHRdPVwiaGVpZ2h0QW5kV2lkdGhcIlxyXG4gICAgICAgIFthdHRyLndpZHRoXT1cImhlaWdodEFuZFdpZHRoXCJcclxuICAgICAgICBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6MDsgcG9pbnRlci1ldmVudHM6IG5vbmVcIlxyXG4gICAgPlxyXG4gICAgICAgIDxkZWZzICpuZ0Zvcj1cImxldCBjb2xvciBvZiBbJ3JlZCcsICdncmVlbicsICdibHVlJywgJ29yYW5nZSddXCI+XHJcbiAgICAgICAgICAgIDxtYXJrZXJcclxuICAgICAgICAgICAgICAgIFtpZF09XCJjb2xvciArICdBcnJvdydcIlxyXG4gICAgICAgICAgICAgICAgbWFya2VySGVpZ2h0PVwiMTNcIlxyXG4gICAgICAgICAgICAgICAgbWFya2VyV2lkdGg9XCIxM1wiXHJcbiAgICAgICAgICAgICAgICBvcmllbnQ9XCJhdXRvXCJcclxuICAgICAgICAgICAgICAgIHJlZlg9XCI5XCJcclxuICAgICAgICAgICAgICAgIHJlZlk9XCI2XCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPHBhdGhcclxuICAgICAgICAgICAgICAgICAgICBbc3R5bGUuZmlsbF09XCJjb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgZD1cIk0yLDIgTDIsMTEgTDEwLDYgTDIsMlwiXHJcbiAgICAgICAgICAgICAgICA+PC9wYXRoPlxyXG4gICAgICAgICAgICA8L21hcmtlcj5cclxuICAgICAgICA8L2RlZnM+XHJcbiAgICAgICAgPGxpbmVcclxuICAgICAgICAgICAgY2xhc3M9XCJhcnJvd1wiXHJcbiAgICAgICAgICAgIFthdHRyLm1hcmtlci1lbmRdPVwiJ3VybCgjJyArIGFycm93LmVuZC5jb2xvciArICdBcnJvdyknXCJcclxuICAgICAgICAgICAgW2F0dHIuc3Ryb2tlXT1cImFycm93LmVuZC5jb2xvclwiXHJcbiAgICAgICAgICAgIFthdHRyLngxXT1cImFycm93LnN0YXJ0LnhcIlxyXG4gICAgICAgICAgICBbYXR0ci54Ml09XCJhcnJvdy5lbmQueFwiXHJcbiAgICAgICAgICAgIFthdHRyLnkxXT1cImFycm93LnN0YXJ0LnlcIlxyXG4gICAgICAgICAgICBbYXR0ci55Ml09XCJhcnJvdy5lbmQueVwiXHJcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBhcnJvdyBvZiBkcmF3UHJvdmlkZXIuYXJyb3dzJCB8IGFzeW5jXCJcclxuICAgICAgICA+PC9saW5lPlxyXG4gICAgICAgIDxjaXJjbGVcclxuICAgICAgICAgICAgW2F0dHIuY3hdPVwiY2lyY2xlLmRyYXdQb2ludC54XCJcclxuICAgICAgICAgICAgW2F0dHIuY3ldPVwiY2lyY2xlLmRyYXdQb2ludC55XCJcclxuICAgICAgICAgICAgW2F0dHIucl09XCJoZWlnaHRBbmRXaWR0aCAvIDE4XCJcclxuICAgICAgICAgICAgW2F0dHIuc3Ryb2tlXT1cImNpcmNsZS5kcmF3UG9pbnQuY29sb3JcIlxyXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgY2lyY2xlIG9mIGRyYXdQcm92aWRlci5jaXJjbGVzJCB8IGFzeW5jXCJcclxuICAgICAgICAgICAgZmlsbC1vcGFjaXR5PVwiMC4wXCJcclxuICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMlwiXHJcbiAgICAgICAgPjwvY2lyY2xlPlxyXG4gICAgPC9zdmc+XHJcbiAgICA8YXBwLXBpZWNlLXByb21vdGlvbi1tb2RhbCAjbW9kYWw+PC9hcHAtcGllY2UtcHJvbW90aW9uLW1vZGFsPlxyXG48L2Rpdj5cclxuIl19