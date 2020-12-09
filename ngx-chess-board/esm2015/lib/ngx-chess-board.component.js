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
import { NgxChessBoardService } from './service/ngx-chess-board.service';
import { Constants } from './utils/constants';
import { PieceIconInputManager } from './utils/inputs/piece-icon-input-manager';
import { MoveUtils } from './utils/move-utils';
import { UnicodeConstants } from './utils/unicode-constants';
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
            this.handleClickEvent(pointClicked);
            //   this.possibleMoves = activePiece.getPossibleMoves();
        }
        else {
            if (pieceClicked) {
                if ((this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.WHITE)) {
                    return;
                }
                this.prepareActivePiece(pieceClicked, pointClicked);
            }
        }
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
            stalemate, fen: this.board.fen }));
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
                    leftRook.point.col = this.board.reverted ? 2 : 3;
                }
                else {
                    const rightRook = this.board.getPieceByField(toMovePiece.point.row, 7);
                    rightRook.point.col = this.board.reverted ? 4 : 5;
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
        this.modal.open(piece.color, (index) => {
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
        }
        catch (exception) {
            console.log(exception);
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
        if (this.isPieceDisabled(pieceClicked)) {
            return;
        }
        if (this.selected) {
            this.handleClickEvent(pointClicked);
        }
        else {
            if (pieceClicked) {
                if ((this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.WHITE)) {
                    return;
                }
                this.prepareActivePiece(pieceClicked, pointClicked);
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
    handleClickEvent(pointClicked) {
        if (this.board.isPointInPossibleMoves(pointClicked) ||
            this.board.isPointInPossibleCaptures(pointClicked)) {
            this.saveClone();
            this.board.lastMoveSrc = new Point(this.board.activePiece.point.row, this.board.activePiece.point.col);
            this.board.lastMoveDest = pointClicked;
            this.movePiece(this.board.activePiece, pointClicked);
        }
        this.disableSelection();
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (pieceClicked) {
            if ((this.board.currentWhitePlayer &&
                pieceClicked.color === Color.BLACK) ||
                (!this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.WHITE)) {
                return;
            }
            this.prepareActivePiece(pieceClicked, pointClicked);
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
NgxChessBoardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-chess-board',
                template: "<div\r\n    id=\"board\"\r\n    [style.height.px]=\"heightAndWidth\"\r\n    [style.width.px]=\"heightAndWidth\"\r\n    (pointerdown)=\"!modal.opened && onMouseDown($event)\"\r\n    (pointerup)=\"!modal.opened && onMouseUp($event)\"\r\n    #boardRef\r\n>\r\n    <div id=\"drag\">\r\n        <div\r\n            class=\"board-row\"\r\n            *ngFor=\"let row of board.board; let i = index\"\r\n        >\r\n            <div\r\n                class=\"board-col\"\r\n                [class.current-selection]=\"board.isXYInActiveMove(i,j)\"\r\n                [class.dest-move]=\"board.isXYInDestMove(i,j)\"\r\n                [class.king-check]=\" isKingChecked(getPieceByPoint(i,j))\"\r\n                [class.point-circle]=\"board.isXYInPointSelection(i, j)\"\r\n                [class.possible-capture]=\"board.isXYInPossibleCaptures(i, j)\"\r\n                [class.possible-point]=\"board.isXYInPossibleMoves(i, j)\"\r\n                [class.source-move]=\"board.isXYInSourceMove(i, j)\"\r\n                [style.background-color]=\"((i + j) % 2 === 0 ) ? lightTileColor : darkTileColor\"\r\n                *ngFor=\"let col of row; let j = index\"\r\n            >\r\n                <span\r\n                    class=\"yCoord\"\r\n                    [style.color]=\"(i % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && j === 7\"\r\n                >\r\n                    {{coords.yCoords[i]}}\r\n                </span>\r\n                <span\r\n                    class=\"xCoord\"\r\n                    [style.color]=\"(j % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && i === 7\"\r\n                >\r\n                    {{coords.xCoords[j]}}\r\n                </span>\r\n                <div\r\n                    *ngIf=\"getPieceByPoint(i, j) as piece\"\r\n                    style=\"height:100%; width:100%\"\r\n                >\r\n                    <div\r\n                        [cdkDragDisabled]=\"dragDisabled\"\r\n                        [innerHTML]=\"pieceIconManager.isDefaultIcons() ? getPieceByPoint(i,j).constant.icon : ''\"\r\n                        [ngClass]=\"'piece'\"\r\n                        [style.font-size]=\"pieceSize + 'px'\"\r\n                        [ngStyle]=\"pieceIconManager.isDefaultIcons() ? '' : getCustomPieceIcons(getPieceByPoint(i,j))\"\r\n                        (cdkDragEnded)=\"dragEnded($event)\"\r\n                        (cdkDragStarted)=\"dragStart($event)\"\r\n                        cdkDrag\r\n                    >\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <svg\r\n        [attr.height]=\"heightAndWidth\"\r\n        [attr.width]=\"heightAndWidth\"\r\n        style=\"position:absolute; top:0; pointer-events: none\"\r\n    >\r\n        <defs *ngFor=\"let color of ['red', 'green', 'blue', 'orange']\">\r\n            <marker\r\n                [id]=\"color + 'Arrow'\"\r\n                markerHeight=\"13\"\r\n                markerWidth=\"13\"\r\n                orient=\"auto\"\r\n                refX=\"9\"\r\n                refY=\"6\"\r\n            >\r\n                <path\r\n                    [style.fill]=\"color\"\r\n                    d=\"M2,2 L2,11 L10,6 L2,2\"\r\n                ></path>\r\n            </marker>\r\n        </defs>\r\n        <line\r\n            class=\"arrow\"\r\n            [attr.marker-end]=\"'url(#' + arrow.end.color + 'Arrow)'\"\r\n            [attr.stroke]=\"arrow.end.color\"\r\n            [attr.x1]=\"arrow.start.x\"\r\n            [attr.x2]=\"arrow.end.x\"\r\n            [attr.y1]=\"arrow.start.y\"\r\n            [attr.y2]=\"arrow.end.y\"\r\n            *ngFor=\"let arrow of drawProvider.arrows$ | async\"\r\n        ></line>\r\n        <circle\r\n            [attr.cx]=\"circle.drawPoint.x\"\r\n            [attr.cy]=\"circle.drawPoint.y\"\r\n            [attr.r]=\"heightAndWidth / 18\"\r\n            [attr.stroke]=\"circle.drawPoint.color\"\r\n            *ngFor=\"let circle of drawProvider.circles$ | async\"\r\n            fill-opacity=\"0.0\"\r\n            stroke-width=\"2\"\r\n        ></circle>\r\n    </svg>\r\n    <app-piece-promotion-modal #modal></app-piece-promotion-modal>\r\n</div>\r\n",
                styles: ["@charset \"UTF-8\";#board{font-family:Courier New,serif;position:relative}.board-row{display:block;height:12.5%;position:relative;width:100%}.board-col{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece,.piece:after{box-sizing:border-box}.piece:after{content:\"\u200B\"}#drag{height:100%;width:100%}.possible-point{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture:hover,.possible-point:hover{opacity:.4}.possible-capture{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move{background-color:rgba(146,111,26,.79)!important}.dest-move{background-color:#b28e1a!important}.current-selection{background-color:hsla(0,0%,100%,.5)!important}.yCoord{right:.2em}.xCoord,.yCoord{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord{bottom:0;left:.2em}.hovering{background-color:red!important}.arrow{stroke-width:2}svg{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}"]
            },] }
];
NgxChessBoardComponent.ctorParameters = () => [
    { type: NgxChessBoardService }
];
NgxChessBoardComponent.propDecorators = {
    darkTileColor: [{ type: Input }],
    lightTileColor: [{ type: Input }],
    showCoords: [{ type: Input }],
    dragDisabled: [{ type: Input }],
    drawDisabled: [{ type: Input }],
    lightDisabled: [{ type: Input }],
    darkDisabled: [{ type: Input }],
    moveChange: [{ type: Output }],
    checkmate: [{ type: Output }],
    stalemate: [{ type: Output }],
    boardRef: [{ type: ViewChild, args: ['boardRef',] }],
    modal: [{ type: ViewChild, args: ['modal',] }],
    size: [{ type: Input, args: ['size',] }],
    pieceIcons: [{ type: Input, args: ['pieceIcons',] }],
    onRightClick: [{ type: HostListener, args: ['contextmenu', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQ0gsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNoRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUVqRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzlDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNwRixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0s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O0lBRU8sZUFBZSxDQUFDLFlBQW1CO1FBQ3ZDLElBQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDcEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQ2pELENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FDUixPQUFPLENBQUMsR0FBRyxLQUFLLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRztnQkFDdEMsT0FBTyxDQUFDLEdBQUcsS0FBSyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDN0MsQ0FBQztZQUVGLElBQUksWUFBWSxFQUFFO2dCQUNkLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFDRCxPQUFPLENBQ0gsWUFBWTtZQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLFlBQVksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDdkQsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLFlBQVksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQ2pFLENBQUM7SUFDTixDQUFDOzs7WUFyeUJKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixzMUlBQStDOzthQUVsRDs7O1lBbEJRLG9CQUFvQjs7OzRCQXFCeEIsS0FBSzs2QkFDTCxLQUFLO3lCQUNMLEtBQUs7MkJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTt1QkFHTixTQUFTLFNBQUMsVUFBVTtvQkFFcEIsU0FBUyxTQUFDLE9BQU87bUJBd0JqQixLQUFLLFNBQUMsTUFBTTt5QkFlWixLQUFLLFNBQUMsWUFBWTsyQkFLbEIsWUFBWSxTQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENka0RyYWdFbmQsIENka0RyYWdTdGFydCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIElucHV0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXInO1xuaW1wb3J0IHsgQm9hcmRTdGF0ZSB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtc3RhdGUnO1xuaW1wb3J0IHsgQm9hcmRTdGF0ZVByb3ZpZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1zdGF0ZS1wcm92aWRlcic7XG5pbXBvcnQgeyBNb3ZlU3RhdGVQcm92aWRlciB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvbW92ZS1zdGF0ZS1wcm92aWRlcic7XG5pbXBvcnQgeyBDb29yZHNQcm92aWRlciB9IGZyb20gJy4vY29vcmRzL2Nvb3Jkcy1wcm92aWRlcic7XG5pbXBvcnQgeyBBcnJvdyB9IGZyb20gJy4vZHJhd2luZy10b29scy9hcnJvdyc7XG5pbXBvcnQgeyBDaXJjbGUgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvY2lyY2xlJztcbmltcG9ydCB7IERyYXdQb2ludCB9IGZyb20gJy4vZHJhd2luZy10b29scy9kcmF3LXBvaW50JztcbmltcG9ydCB7IERyYXdQcm92aWRlciB9IGZyb20gJy4vZHJhd2luZy10b29scy9kcmF3LXByb3ZpZGVyJztcbmltcG9ydCB7IEhpc3RvcnlNb3ZlIH0gZnJvbSAnLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlJztcbmltcG9ydCB7IEhpc3RvcnlNb3ZlUHJvdmlkZXIgfSBmcm9tICcuL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUtcHJvdmlkZXInO1xuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuL21vZGVscy9ib2FyZCc7XG5pbXBvcnQgeyBCaXNob3AgfSBmcm9tICcuL21vZGVscy9waWVjZXMvYmlzaG9wJztcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL2NvbG9yJztcbmltcG9ydCB7IEtpbmcgfSBmcm9tICcuL21vZGVscy9waWVjZXMva2luZyc7XG5pbXBvcnQgeyBLbmlnaHQgfSBmcm9tICcuL21vZGVscy9waWVjZXMva25pZ2h0JztcbmltcG9ydCB7IFBhd24gfSBmcm9tICcuL21vZGVscy9waWVjZXMvcGF3bic7XG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9waWVjZSc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9wb2ludCc7XG5pbXBvcnQgeyBRdWVlbiB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9xdWVlbic7XG5pbXBvcnQgeyBSb29rIH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL3Jvb2snO1xuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFZpZXcgfSBmcm9tICcuL25neC1jaGVzcy1ib2FyZC12aWV3JztcbmltcG9ydCB7IEF2YWlsYWJsZU1vdmVEZWNvcmF0b3IgfSBmcm9tICcuL3BpZWNlLWRlY29yYXRvci9hdmFpbGFibGUtbW92ZS1kZWNvcmF0b3InO1xuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4vcGllY2UtcHJvbW90aW9uLW1vZGFsL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2Uvbmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgUGllY2VJY29uSW5wdXQgfSBmcm9tICcuL3V0aWxzL2lucHV0cy9waWVjZS1pY29uLWlucHV0JztcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0TWFuYWdlciB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLWljb24taW5wdXQtbWFuYWdlcic7XG5pbXBvcnQgeyBNb3ZlVXRpbHMgfSBmcm9tICcuL3V0aWxzL21vdmUtdXRpbHMnO1xuaW1wb3J0IHsgVW5pY29kZUNvbnN0YW50cyB9IGZyb20gJy4vdXRpbHMvdW5pY29kZS1jb25zdGFudHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1vdmVDaGFuZ2UgZXh0ZW5kcyBIaXN0b3J5TW92ZSB7XG4gICAgY2hlY2s6IGJvb2xlYW47XG4gICAgc3RhbGVtYXRlOiBib29sZWFuO1xuICAgIGNoZWNrbWF0ZTogYm9vbGVhbjtcbiAgICBmZW46IHN0cmluZztcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hlc3MtYm9hcmQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL25neC1jaGVzcy1ib2FyZC5jb21wb25lbnQuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hDaGVzc0JvYXJkQ29tcG9uZW50XG4gICAgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgTmd4Q2hlc3NCb2FyZFZpZXcge1xuICAgIEBJbnB1dCgpIGRhcmtUaWxlQ29sb3IgPSBDb25zdGFudHMuREVGQVVMVF9EQVJLX1RJTEVfQ09MT1I7XG4gICAgQElucHV0KCkgbGlnaHRUaWxlQ29sb3I6IHN0cmluZyA9IENvbnN0YW50cy5ERUZBVUxUX0xJR0hUX1RJTEVfQ09MT1I7XG4gICAgQElucHV0KCkgc2hvd0Nvb3JkcyA9IHRydWU7XG4gICAgQElucHV0KCkgZHJhZ0Rpc2FibGVkID0gZmFsc2U7XG4gICAgQElucHV0KCkgZHJhd0Rpc2FibGVkID0gZmFsc2U7XG4gICAgQElucHV0KCkgbGlnaHREaXNhYmxlZCA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGRhcmtEaXNhYmxlZCA9IGZhbHNlO1xuICAgIEBPdXRwdXQoKSBtb3ZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNb3ZlQ2hhbmdlPigpO1xuICAgIEBPdXRwdXQoKSBjaGVja21hdGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gICAgQE91dHB1dCgpIHN0YWxlbWF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgICBwaWVjZVNpemU6IG51bWJlcjtcbiAgICBzZWxlY3RlZCA9IGZhbHNlO1xuICAgIEBWaWV3Q2hpbGQoJ2JvYXJkUmVmJylcbiAgICBib2FyZFJlZjogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdtb2RhbCcpIG1vZGFsOiBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50O1xuICAgIGJvYXJkOiBCb2FyZDtcbiAgICBib2FyZFN0YXRlUHJvdmlkZXI6IEJvYXJkU3RhdGVQcm92aWRlcjtcbiAgICBtb3ZlU3RhdGVQcm92aWRlcjogTW92ZVN0YXRlUHJvdmlkZXI7XG4gICAgbW92ZUhpc3RvcnlQcm92aWRlcjogSGlzdG9yeU1vdmVQcm92aWRlcjtcbiAgICBib2FyZExvYWRlcjogQm9hcmRMb2FkZXI7XG4gICAgY29vcmRzOiBDb29yZHNQcm92aWRlciA9IG5ldyBDb29yZHNQcm92aWRlcigpO1xuICAgIGRpc2FibGluZyA9IGZhbHNlO1xuICAgIGRyYXdQcm92aWRlcjogRHJhd1Byb3ZpZGVyO1xuICAgIGRyYXdQb2ludDogRHJhd1BvaW50O1xuICAgIHBpZWNlSWNvbk1hbmFnZXI6IFBpZWNlSWNvbklucHV0TWFuYWdlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbmd4Q2hlc3NCb2FyZFNlcnZpY2U6IE5neENoZXNzQm9hcmRTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBuZXcgQm9hcmQoKTtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlciA9IG5ldyBCb2FyZExvYWRlcih0aGlzLmJvYXJkKTtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIgPSBuZXcgQm9hcmRTdGF0ZVByb3ZpZGVyKCk7XG4gICAgICAgIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlciA9IG5ldyBIaXN0b3J5TW92ZVByb3ZpZGVyKCk7XG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyID0gbmV3IERyYXdQcm92aWRlcigpO1xuICAgICAgICB0aGlzLnBpZWNlSWNvbk1hbmFnZXIgPSBuZXcgUGllY2VJY29uSW5wdXRNYW5hZ2VyKCk7XG4gICAgfVxuXG4gICAgaGVpZ2h0QW5kV2lkdGg6IG51bWJlciA9IENvbnN0YW50cy5ERUZBVUxUX1NJWkU7XG5cbiAgICBASW5wdXQoJ3NpemUnKVxuICAgIHB1YmxpYyBzZXQgc2l6ZShzaXplOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2l6ZSAmJlxuICAgICAgICAgICAgc2l6ZSA+PSBDb25zdGFudHMuTUlOX0JPQVJEX1NJWkUgJiZcbiAgICAgICAgICAgIHNpemUgPD0gQ29uc3RhbnRzLk1BWF9CT0FSRF9TSVpFXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5oZWlnaHRBbmRXaWR0aCA9IHNpemU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhlaWdodEFuZFdpZHRoID0gQ29uc3RhbnRzLkRFRkFVTFRfU0laRTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBpZWNlU2l6ZSgpO1xuICAgIH1cblxuICAgIEBJbnB1dCgncGllY2VJY29ucycpXG4gICAgcHVibGljIHNldCBwaWVjZUljb25zKHBpZWNlSWNvbnM6IFBpZWNlSWNvbklucHV0KSB7XG4gICAgICAgIHRoaXMucGllY2VJY29uTWFuYWdlci5waWVjZUljb25JbnB1dCA9IHBpZWNlSWNvbnM7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnLCBbJyRldmVudCddKVxuICAgIG9uUmlnaHRDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGNoYW5nZXMubGlnaHREaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHREaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKSB8fFxuICAgICAgICAgICAgKGNoYW5nZXMuZGFya0Rpc2FibGVkICYmXG4gICAgICAgICAgICAgICAgdGhpcy5kYXJrRGlzYWJsZWQgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5uZ3hDaGVzc0JvYXJkU2VydmljZS5jb21wb25lbnRNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnJlc2V0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBpZWNlU2l6ZSgpO1xuICAgIH1cblxuICAgIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwICYmICF0aGlzLmRyYXdEaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5hZGREcmF3UG9pbnQoXG4gICAgICAgICAgICAgICAgZXZlbnQueCxcbiAgICAgICAgICAgICAgICBldmVudC55LFxuICAgICAgICAgICAgICAgIGV2ZW50LmN0cmxLZXksXG4gICAgICAgICAgICAgICAgZXZlbnQuYWx0S2V5LFxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuY2xlYXIoKTtcblxuICAgICAgICBpZiAodGhpcy5kcmFnRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb2ludENsaWNrZWQgPSB0aGlzLmdldENsaWNrUG9pbnQoZXZlbnQpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgJiZcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5pc0VxdWFsKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQpICYmXG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwaWVjZUNsaWNrZWQgPSB0aGlzLmdldFBpZWNlQnlQb2ludChcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrRXZlbnQocG9pbnRDbGlja2VkKTtcbiAgICAgICAgICAgIC8vICAgdGhpcy5wb3NzaWJsZU1vdmVzID0gYWN0aXZlUGllY2UuZ2V0UG9zc2libGVNb3ZlcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLkJMQUNLKSB8fFxuICAgICAgICAgICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQWN0aXZlUGllY2UocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWZ0ZXJNb3ZlQWN0aW9ucyhwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xuICAgICAgICB0aGlzLmNoZWNrSWZQYXduRmlyc3RNb3ZlKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UpO1xuICAgICAgICB0aGlzLmNoZWNrSWZSb29rTW92ZWQodGhpcy5ib2FyZC5hY3RpdmVQaWVjZSk7XG4gICAgICAgIHRoaXMuY2hlY2tJZktpbmdNb3ZlZCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlKTtcblxuICAgICAgICB0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQgPSB0aGlzLmJvYXJkLmlzS2luZ0luQ2hlY2soXG4gICAgICAgICAgICBDb2xvci5CTEFDSyxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYm9hcmQud2hpdGVLaW5nQ2hlY2tlZCA9IHRoaXMuYm9hcmQuaXNLaW5nSW5DaGVjayhcbiAgICAgICAgICAgIENvbG9yLldISVRFLFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXNcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgY2hlY2sgPVxuICAgICAgICAgICAgdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkIHx8IHRoaXMuYm9hcmQud2hpdGVLaW5nQ2hlY2tlZDtcbiAgICAgICAgY29uc3QgY2hlY2ttYXRlID1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLkJMQUNLKSB8fFxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoQ29sb3IuV0hJVEUpO1xuICAgICAgICBjb25zdCBzdGFsZW1hdGUgPVxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBhdChDb2xvci5CTEFDSykgfHwgdGhpcy5jaGVja0ZvclBhdChDb2xvci5XSElURSk7XG5cbiAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcblxuICAgICAgICBjb25zdCBsYXN0TW92ZSA9IHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5nZXRMYXN0TW92ZSgpO1xuICAgICAgICBpZiAobGFzdE1vdmUgJiYgcHJvbW90aW9uSW5kZXgpIHtcbiAgICAgICAgICAgIGxhc3RNb3ZlLm1vdmUgKz0gcHJvbW90aW9uSW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vdmVDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAuLi5sYXN0TW92ZSxcbiAgICAgICAgICAgIGNoZWNrLFxuICAgICAgICAgICAgY2hlY2ttYXRlLFxuICAgICAgICAgICAgc3RhbGVtYXRlLFxuICAgICAgICAgICAgZmVuOiB0aGlzLmJvYXJkLmZlbixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZVNlbGVjdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgIH1cblxuICAgIHByZXBhcmVBY3RpdmVQaWVjZShwaWVjZUNsaWNrZWQ6IFBpZWNlLCBwb2ludENsaWNrZWQ6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgPSBwaWVjZUNsaWNrZWQ7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBuZXcgQXZhaWxhYmxlTW92ZURlY29yYXRvcihcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID8gQ29sb3IuV0hJVEUgOiBDb2xvci5CTEFDSyxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgKS5nZXRQb3NzaWJsZUNhcHR1cmVzKCk7XG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IG5ldyBBdmFpbGFibGVNb3ZlRGVjb3JhdG9yKFxuICAgICAgICAgICAgcGllY2VDbGlja2VkLFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPyBDb2xvci5XSElURSA6IENvbG9yLkJMQUNLLFxuICAgICAgICAgICAgdGhpcy5ib2FyZFxuICAgICAgICApLmdldFBvc3NpYmxlTW92ZXMoKTtcbiAgICB9XG5cbiAgICBnZXRQaWVjZUJ5UG9pbnQocm93OiBudW1iZXIsIGNvbDogbnVtYmVyKTogUGllY2Uge1xuICAgICAgICByb3cgPSBNYXRoLmZsb29yKHJvdyk7XG4gICAgICAgIGNvbCA9IE1hdGguZmxvb3IoY29sKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmQucGllY2VzLmZpbmQoXG4gICAgICAgICAgICAocGllY2UpID0+IHBpZWNlLnBvaW50LmNvbCA9PT0gY29sICYmIHBpZWNlLnBvaW50LnJvdyA9PT0gcm93XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaXNLaW5nQ2hlY2tlZChwaWVjZTogUGllY2UpIHtcbiAgICAgICAgaWYgKHBpZWNlIGluc3RhbmNlb2YgS2luZykge1xuICAgICAgICAgICAgcmV0dXJuIHBpZWNlLmNvbG9yID09PSBDb2xvci5XSElURVxuICAgICAgICAgICAgICAgID8gdGhpcy5ib2FyZC53aGl0ZUtpbmdDaGVja2VkXG4gICAgICAgICAgICAgICAgOiB0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDbGlja1BvaW50KGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICAgICAgICBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChldmVudC55IC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCkgL1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGVpZ2h0IC9cbiAgICAgICAgICAgICAgICAgICAgICAgIDgpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAoZXZlbnQueCAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSAvXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggL1xuICAgICAgICAgICAgICAgICAgICAgICAgOClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBtb3ZlUGllY2UodG9Nb3ZlUGllY2U6IFBpZWNlLCBuZXdQb2ludDogUG9pbnQsIHByb21vdGlvbkluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRlc3RQaWVjZSA9IHRoaXMuYm9hcmQucGllY2VzLmZpbmQoXG4gICAgICAgICAgICAocGllY2UpID0+XG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sID09PSBuZXdQb2ludC5jb2wgJiZcbiAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3cgPT09IG5ld1BvaW50LnJvd1xuICAgICAgICApO1xuXG4gICAgICAgIGlmIChkZXN0UGllY2UgJiYgdG9Nb3ZlUGllY2UuY29sb3IgIT09IGRlc3RQaWVjZS5jb2xvcikge1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PiBwaWVjZSAhPT0gZGVzdFBpZWNlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRlc3RQaWVjZSAmJiB0b01vdmVQaWVjZS5jb2xvciA9PT0gZGVzdFBpZWNlLmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW92ZSA9IG5ldyBIaXN0b3J5TW92ZShcbiAgICAgICAgICAgIE1vdmVVdGlscy5mb3JtYXQodG9Nb3ZlUGllY2UucG9pbnQsIG5ld1BvaW50LCB0aGlzLmJvYXJkLnJldmVydGVkKSxcbiAgICAgICAgICAgIHRvTW92ZVBpZWNlLmNvbnN0YW50Lm5hbWUsXG4gICAgICAgICAgICB0b01vdmVQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUgPyAnd2hpdGUnIDogJ2JsYWNrJyxcbiAgICAgICAgICAgICEhZGVzdFBpZWNlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5hZGRNb3ZlKG1vdmUpO1xuXG4gICAgICAgIGlmICh0b01vdmVQaWVjZSBpbnN0YW5jZW9mIEtpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZXNNb3ZlZCA9IE1hdGguYWJzKG5ld1BvaW50LmNvbCAtIHRvTW92ZVBpZWNlLnBvaW50LmNvbCk7XG4gICAgICAgICAgICBpZiAoc3F1YXJlc01vdmVkID4gMSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdQb2ludC5jb2wgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRSb29rID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5RmllbGQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b01vdmVQaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyAyIDogMztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodFJvb2sgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlGaWVsZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTW92ZVBpZWNlLnBvaW50LnJvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIDdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyA0IDogNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9Nb3ZlUGllY2UgaW5zdGFuY2VvZiBQYXduKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrSWZQYXduVGFrZXNFblBhc3NhbnQobmV3UG9pbnQpO1xuICAgICAgICAgICAgdGhpcy5jaGVja0lmUGF3bkVucGFzc2FudGVkKHRvTW92ZVBpZWNlLCBuZXdQb2ludCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b01vdmVQaWVjZS5wb2ludCA9IG5ld1BvaW50O1xuICAgICAgICB0aGlzLmluY3JlYXNlRnVsbE1vdmVDb3VudCgpO1xuICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA9ICF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcjtcblxuICAgICAgICBpZiAoIXRoaXMuY2hlY2tGb3JQYXduUHJvbW90ZSh0b01vdmVQaWVjZSwgcHJvbW90aW9uSW5kZXgpKSB7XG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrSWZQYXduRmlyc3RNb3ZlKHBpZWNlOiBQaWVjZSkge1xuICAgICAgICBpZiAocGllY2UgaW5zdGFuY2VvZiBQYXduKSB7XG4gICAgICAgICAgICBwaWVjZS5pc01vdmVkQWxyZWFkeSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0ZvclBhd25Qcm9tb3RlKHRvUHJvbW90ZVBpZWNlOiBQaWVjZSwgcHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCEodG9Qcm9tb3RlUGllY2UgaW5zdGFuY2VvZiBQYXduKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRvUHJvbW90ZVBpZWNlLnBvaW50LnJvdyA9PT0gMCB8fCB0b1Byb21vdGVQaWVjZS5wb2ludC5yb3cgPT09IDcpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT4gcGllY2UgIT09IHRvUHJvbW90ZVBpZWNlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBXaGVuIHdlIG1ha2UgbW92ZSBtYW51YWxseSwgd2UgcGFzcyBwcm9tb3Rpb24gaW5kZXggYWxyZWFkeSwgc28gd2UgZG9uJ3QgbmVlZFxuICAgICAgICAgICAgLy8gdG8gYWNxdWlyZSBpdCBmcm9tIHByb21vdGUgZGlhbG9nXG4gICAgICAgICAgICBpZiAoIXByb21vdGlvbkluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUHJvbW90ZURpYWxvZyh0b1Byb21vdGVQaWVjZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVByb21vdGlvbkNob2ljZSh0b1Byb21vdGVQaWVjZSwgcHJvbW90aW9uSW5kZXgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWZ0ZXJNb3ZlQWN0aW9ucyhwcm9tb3Rpb25JbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3BlblByb21vdGVEaWFsb2cocGllY2U6IFBpZWNlKSB7XG4gICAgICAgIHRoaXMubW9kYWwub3BlbihwaWVjZS5jb2xvciwgKGluZGV4KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVQcm9tb3Rpb25DaG9pY2UocGllY2UsIGluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJNb3ZlQWN0aW9ucyhpbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc29sdmVQcm9tb3Rpb25DaG9pY2UocGllY2U6IFBpZWNlLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGlzV2hpdGUgPSBwaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEU7XG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgUXVlZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNXaGl0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVW5pY29kZUNvbnN0YW50cy5XSElURV9RVUVFTlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogVW5pY29kZUNvbnN0YW50cy5CTEFDS19RVUVFTixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJvb2soXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNXaGl0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVW5pY29kZUNvbnN0YW50cy5XSElURV9ST09LXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBVbmljb2RlQ29uc3RhbnRzLkJMQUNLX1JPT0ssXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCaXNob3AoXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNXaGl0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVW5pY29kZUNvbnN0YW50cy5XSElURV9CSVNIT1BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFVuaWNvZGVDb25zdGFudHMuQkxBQ0tfQklTSE9QLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgS25pZ2h0KFxuICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzV2hpdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFVuaWNvZGVDb25zdGFudHMuV0hJVEVfS05JR0hUXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBVbmljb2RlQ29uc3RhbnRzLkJMQUNLX0tOSUdIVCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuYWRkUGllY2VzKCk7XG4gICAgICAgIHRoaXMuYm9hcmQucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jb29yZHMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuY2xlYXIoKTtcbiAgICB9XG5cbiAgICByZXZlcnNlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm9hcmQucmV2ZXJzZSgpO1xuICAgICAgICB0aGlzLmNvb3Jkcy5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQm9hcmQoYm9hcmQ6IEJvYXJkKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBib2FyZDtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5zZXRCb2FyZCh0aGlzLmJvYXJkKTtcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgIH1cbiAgICB1bmRvKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgY29uc3QgbGFzdEJvYXJkID0gdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIucG9wKCkuYm9hcmQ7XG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZC5yZXZlcnRlZCkge1xuICAgICAgICAgICAgICAgIGxhc3RCb2FyZC5yZXZlcnNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbGFzdEJvYXJkO1xuICAgICAgICAgICAgdGhpcy5ib2FyZExvYWRlci5zZXRCb2FyZCh0aGlzLmJvYXJkKTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XG4gICAgICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNb3ZlSGlzdG9yeSgpOiBIaXN0b3J5TW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5nZXRBbGwoKTtcbiAgICB9XG5cbiAgICBzZXRGRU4oZmVuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRMb2FkZXIubG9hZEZFTihmZW4pO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhleGNlcHRpb24pO1xuICAgICAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEZFTigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2FyZC5mZW47XG4gICAgfVxuXG4gICAgZHJhZ0VuZGVkKGV2ZW50OiBDZGtEcmFnRW5kKTogdm9pZCB7XG4gICAgICAgIGV2ZW50LnNvdXJjZS5yZXNldCgpO1xuICAgICAgICBldmVudC5zb3VyY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICcwJztcbiAgICAgICAgZXZlbnQuc291cmNlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuICAgICAgICBldmVudC5zb3VyY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvdWNoQWN0aW9uID0gJ2F1dG8nO1xuICAgIH1cblxuICAgIGRyYWdTdGFydChldmVudDogQ2RrRHJhZ1N0YXJ0KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZXZlbnQuc291cmNlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZTtcbiAgICAgICAgc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICBzdHlsZS56SW5kZXggPSAnMTAwMCc7XG4gICAgICAgIHN0eWxlLnRvdWNoQWN0aW9uID0gJ25vbmUnO1xuICAgICAgICBzdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIH1cblxuICAgIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvaW50ID0gdGhpcy5nZXREcmF3aW5nUG9pbnQoXG4gICAgICAgICAgICAgICAgZXZlbnQueCxcbiAgICAgICAgICAgICAgICBldmVudC55LFxuICAgICAgICAgICAgICAgIGV2ZW50LmN0cmxLZXksXG4gICAgICAgICAgICAgICAgZXZlbnQuYWx0S2V5LFxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50Q2xpY2tlZCA9IHRoaXMuZ2V0Q2xpY2tQb2ludChldmVudCk7XG5cbiAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuY2xlYXIoKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlICYmXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuaXNFcXVhbCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50KVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuZ2V0UGllY2VCeVBvaW50KFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLnJvdyxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5jb2xcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2tFdmVudChwb2ludENsaWNrZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLkJMQUNLKSB8fFxuICAgICAgICAgICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQWN0aXZlUGllY2UocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RHJhd2luZ1BvaW50KFxuICAgICAgICB4OiBudW1iZXIsXG4gICAgICAgIHk6IG51bWJlcixcbiAgICAgICAgY3J0bDogYm9vbGVhbixcbiAgICAgICAgYWx0OiBib29sZWFuLFxuICAgICAgICBzaGlmdDogYm9vbGVhblxuICAgICkge1xuICAgICAgICBjb25zdCBzcXVhcmVTaXplID0gdGhpcy5oZWlnaHRBbmRXaWR0aCAvIDg7XG4gICAgICAgIGNvbnN0IHh4ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICh4IC0gdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpIC9cbiAgICAgICAgICAgICAgICBzcXVhcmVTaXplXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHl5ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICh5IC0gdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCkgL1xuICAgICAgICAgICAgICAgIHNxdWFyZVNpemVcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgY29sb3IgPSAnZ3JlZW4nO1xuXG4gICAgICAgIGlmIChjcnRsIHx8IHNoaWZ0KSB7XG4gICAgICAgICAgICBjb2xvciA9ICdyZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbHQpIHtcbiAgICAgICAgICAgIGNvbG9yID0gJ2JsdWUnO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoc2hpZnQgfHwgY3J0bCkgJiYgYWx0KSB7XG4gICAgICAgICAgICBjb2xvciA9ICdvcmFuZ2UnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRHJhd1BvaW50KFxuICAgICAgICAgICAgTWF0aC5mbG9vcih4eCAqIHNxdWFyZVNpemUgKyBzcXVhcmVTaXplIC8gMiksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHl5ICogc3F1YXJlU2l6ZSArIHNxdWFyZVNpemUgLyAyKSxcbiAgICAgICAgICAgIGNvbG9yXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0lmUm9va01vdmVkKHBpZWNlOiBQaWVjZSkge1xuICAgICAgICBpZiAocGllY2UgaW5zdGFuY2VvZiBSb29rKSB7XG4gICAgICAgICAgICBwaWVjZS5pc01vdmVkQWxyZWFkeSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrSWZLaW5nTW92ZWQocGllY2U6IFBpZWNlKSB7XG4gICAgICAgIGlmIChwaWVjZSBpbnN0YW5jZW9mIEtpbmcpIHtcbiAgICAgICAgICAgIHBpZWNlLmlzTW92ZWRBbHJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yOiBDb2xvcik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5ib2FyZC5waWVjZXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChwaWVjZSkgPT4gcGllY2UuY29sb3IgPT09IGNvbG9yKVxuICAgICAgICAgICAgICAgIC5zb21lKFxuICAgICAgICAgICAgICAgICAgICAocGllY2UpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRQb3NzaWJsZU1vdmVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdmUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhTW92ZVV0aWxzLndpbGxNb3ZlQ2F1c2VDaGVjayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmUucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmUuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRQb3NzaWJsZUNhcHR1cmVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNhcHR1cmUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhTW92ZVV0aWxzLndpbGxNb3ZlQ2F1c2VDaGVjayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0ZvclBhdChjb2xvcjogQ29sb3IpIHtcbiAgICAgICAgaWYgKGNvbG9yID09PSBDb2xvci5XSElURSAmJiAhdGhpcy5ib2FyZC53aGl0ZUtpbmdDaGVja2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoY29sb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbG9yID09PSBDb2xvci5CTEFDSyAmJiAhdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tJZlBhd25FbnBhc3NhbnRlZChwaWVjZTogUGF3biwgbmV3UG9pbnQ6IFBvaW50KSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhwaWVjZS5wb2ludC5yb3cgLSBuZXdQb2ludC5yb3cpID4gMSkge1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQaWVjZSA9IHBpZWNlO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQb2ludCA9IG5ldyBQb2ludChcbiAgICAgICAgICAgICAgICAocGllY2UucG9pbnQucm93ICsgbmV3UG9pbnQucm93KSAvIDIsXG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQb2ludCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBpZWNlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tJZlBhd25UYWtlc0VuUGFzc2FudChuZXdQb2ludDogUG9pbnQpIHtcbiAgICAgICAgaWYgKG5ld1BvaW50LmlzRXF1YWwodGhpcy5ib2FyZC5lblBhc3NhbnRQb2ludCkpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT4gcGllY2UgIT09IHRoaXMuYm9hcmQuZW5QYXNzYW50UGllY2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBvaW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuZW5QYXNzYW50UGllY2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlQ2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5ib2FyZC5jbG9uZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmJvYXJkLnJldmVydGVkKSB7XG4gICAgICAgICAgICBjbG9uZS5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIuYWRkTW92ZShuZXcgQm9hcmRTdGF0ZShjbG9uZSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2F2ZU1vdmVDbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLmJvYXJkLmNsb25lKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVTdGF0ZVByb3ZpZGVyLmFkZE1vdmUobmV3IEJvYXJkU3RhdGUoY2xvbmUpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZVBpZWNlU2l6ZSgpIHtcbiAgICAgICAgdGhpcy5waWVjZVNpemUgPSB0aGlzLmhlaWdodEFuZFdpZHRoIC8gMTA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbmNyZWFzZUZ1bGxNb3ZlQ291bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIpIHtcbiAgICAgICAgICAgICsrdGhpcy5ib2FyZC5mdWxsTW92ZUNvdW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZDogUG9pbnQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZU1vdmVzKHBvaW50Q2xpY2tlZCkgfHxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuaXNQb2ludEluUG9zc2libGVDYXB0dXJlcyhwb2ludENsaWNrZWQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQubGFzdE1vdmVTcmMgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludC5jb2xcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlRGVzdCA9IHBvaW50Q2xpY2tlZDtcbiAgICAgICAgICAgIHRoaXMubW92ZVBpZWNlKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UsIHBvaW50Q2xpY2tlZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgICAgICAgY29uc3QgcGllY2VDbGlja2VkID0gdGhpcy5nZXRQaWVjZUJ5UG9pbnQoXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmNvbFxuICAgICAgICApO1xuICAgICAgICBpZiAocGllY2VDbGlja2VkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XG4gICAgICAgICAgICAgICAgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxuICAgICAgICAgICAgICAgICAgICBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVBY3RpdmVQaWVjZShwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZERyYXdQb2ludChcbiAgICAgICAgeDogbnVtYmVyLFxuICAgICAgICB5OiBudW1iZXIsXG4gICAgICAgIGNydGw6IGJvb2xlYW4sXG4gICAgICAgIGFsdDogYm9vbGVhbixcbiAgICAgICAgc2hpZnQ6IGJvb2xlYW5cbiAgICApIHtcbiAgICAgICAgY29uc3QgdXBQb2ludCA9IHRoaXMuZ2V0RHJhd2luZ1BvaW50KHgsIHksIGNydGwsIGFsdCwgc2hpZnQpO1xuICAgICAgICBpZiAodGhpcy5kcmF3UG9pbnQuaXNFcXVhbCh1cFBvaW50KSkge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gbmV3IENpcmNsZSgpO1xuICAgICAgICAgICAgY2lyY2xlLmRyYXdQb2ludCA9IHVwUG9pbnQ7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhd1Byb3ZpZGVyLmNvbnRhaW5zQ2lyY2xlKGNpcmNsZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRDaXJjbGUoY2lyY2xlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIucmVvbXZlQ2lyY2xlKGNpcmNsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhcnJvdyA9IG5ldyBBcnJvdygpO1xuICAgICAgICAgICAgYXJyb3cuc3RhcnQgPSB0aGlzLmRyYXdQb2ludDtcbiAgICAgICAgICAgIGFycm93LmVuZCA9IHVwUG9pbnQ7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmF3UHJvdmlkZXIuY29udGFpbnNBcnJvdyhhcnJvdykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRBcnJvdyhhcnJvdyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlbW92ZUFycm93KGFycm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmUoY29vcmRzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGNvb3Jkcykge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlSW5kZXhlcyA9IE1vdmVVdGlscy50cmFuc2xhdGVDb29yZHNUb0luZGV4KFxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMCwgMiksXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgZGVzdEluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcbiAgICAgICAgICAgICAgICBjb29yZHMuc3Vic3RyaW5nKDIsIDQpLFxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucmV2ZXJ0ZWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNyY1BpZWNlID0gdGhpcy5nZXRQaWVjZUJ5UG9pbnQoXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcbiAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnhBeGlzXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoc3JjUGllY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGllY2UuY29sb3IgPT09IENvbG9yLkJMQUNLKSB8fFxuICAgICAgICAgICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVBY3RpdmVQaWVjZShzcmNQaWVjZSwgc3JjUGllY2UucG9pbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoZGVzdEluZGV4ZXMueUF4aXMsIGRlc3RJbmRleGVzLnhBeGlzKVxuICAgICAgICAgICAgICAgICAgICApIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuaXNQb2ludEluUG9zc2libGVDYXB0dXJlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlUGllY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzLmxlbmd0aCA9PT0gNSA/ICtjb29yZHMuc3Vic3RyaW5nKDQsIDUpIDogMFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQubGFzdE1vdmVTcmMgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnlBeGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlRGVzdCA9IG5ldyBQb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RJbmRleGVzLnlBeGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEluZGV4ZXMueEF4aXNcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXN0b21QaWVjZUljb25zKHBpZWNlOiBQaWVjZSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShcbiAgICAgICAgICAgIGB7IFwiYmFja2dyb3VuZC1pbWFnZVwiOiBcInVybCgnJHt0aGlzLnBpZWNlSWNvbk1hbmFnZXIuZ2V0UGllY2VJY29uKFxuICAgICAgICAgICAgICAgIHBpZWNlXG4gICAgICAgICAgICApfScpXCJ9YFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZDogUGllY2UpIHtcbiAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCAmJiBwaWVjZUNsaWNrZWQucG9pbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kQ2FwdHVyZSA9IHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcy5maW5kKFxuICAgICAgICAgICAgICAgIChjYXB0dXJlKSA9PlxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLmNvbCA9PT0gcGllY2VDbGlja2VkLnBvaW50LmNvbCAmJlxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyA9PT0gcGllY2VDbGlja2VkLnBvaW50LnJvd1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kQ2FwdHVyZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgcGllY2VDbGlja2VkICYmXG4gICAgICAgICAgICAoKHRoaXMubGlnaHREaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLmRhcmtEaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLkJMQUNLKSlcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXX0=