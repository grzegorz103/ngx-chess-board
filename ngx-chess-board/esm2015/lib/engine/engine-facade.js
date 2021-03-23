import { HistoryMove } from '../history-move-provider/history-move';
import { BoardLoader } from './board-state-provider/board-loader';
import { BoardState } from './board-state-provider/board-state';
import { BoardStateProvider } from './board-state-provider/board-state-provider';
import { CoordsProvider } from './coords/coords-provider';
import { ClickUtils } from './click/click-utils';
import { Arrow } from './drawing-tools/shapes/arrow';
import { Circle } from './drawing-tools/shapes/circle';
import { ColorStrategy } from './drawing-tools/colors/color-strategy';
import { DrawProvider } from './drawing-tools/draw-provider';
import { HistoryMoveProvider } from '../history-move-provider/history-move-provider';
import { Color } from '../models/pieces/color';
import { King } from '../models/pieces/king';
import { Pawn } from '../models/pieces/pawn';
import { Point } from '../models/pieces/point';
import { Rook } from '../models/pieces/rook';
import { AvailableMoveDecorator } from './piece-decorator/available-move-decorator';
import { PiecePromotionResolver } from '../piece-promotion/piece-promotion-resolver';
import { Constants } from '../utils/constants';
import { PieceIconInputManager } from '../utils/inputs/piece-icon-input-manager';
import { MoveUtils } from '../utils/move-utils';
import { DragEndStrategy } from './drag/end/drag-end-strategy';
import { DragStartStrategy } from './drag/start/drag-start-strategy';
import { PieceFactory } from './utils/piece-factory';
export class EngineFacade {
    constructor(board, moveChange) {
        this._selected = false;
        this._freeMode = false;
        this.disabling = false;
        this.heightAndWidth = Constants.DEFAULT_SIZE;
        this.coords = new CoordsProvider();
        this.dragStartStrategy = new DragStartStrategy();
        this.dragEndStrategy = new DragEndStrategy();
        this.colorStrategy = new ColorStrategy();
        this._board = board;
        this.moveChange = moveChange;
        this.boardLoader = new BoardLoader(this.board);
        this.boardLoader.addPieces();
        this.drawProvider = new DrawProvider();
        this.pieceIconManager = new PieceIconInputManager();
        this.boardStateProvider = new BoardStateProvider();
        this.moveHistoryProvider = new HistoryMoveProvider();
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
    saveMoveClone() {
        const clone = this.board.clone();
        if (this.board.reverted) {
            clone.reverse();
        }
        this.moveStateProvider.addMove(new BoardState(clone));
    }
    move(coords) {
        if (coords) {
            const sourceIndexes = MoveUtils.translateCoordsToIndex(coords.substring(0, 2), this._board.reverted);
            const destIndexes = MoveUtils.translateCoordsToIndex(coords.substring(2, 4), this._board.reverted);
            const srcPiece = this._board.getPieceByPoint(sourceIndexes.yAxis, sourceIndexes.xAxis);
            if (srcPiece) {
                if ((this._board.currentWhitePlayer &&
                    srcPiece.color === Color.BLACK) ||
                    (!this._board.currentWhitePlayer &&
                        srcPiece.color === Color.WHITE)) {
                    return;
                }
                this.prepareActivePiece(srcPiece, srcPiece.point);
                if (this._board.isPointInPossibleMoves(new Point(destIndexes.yAxis, destIndexes.xAxis)) ||
                    this._board.isPointInPossibleCaptures(new Point(destIndexes.yAxis, destIndexes.xAxis))) {
                    this.saveClone();
                    this.movePiece(srcPiece, new Point(destIndexes.yAxis, destIndexes.xAxis), coords.length === 5 ? +coords.substring(4, 5) : 0);
                    this._board.lastMoveSrc = new Point(sourceIndexes.yAxis, sourceIndexes.xAxis);
                    this._board.lastMoveDest = new Point(destIndexes.yAxis, destIndexes.xAxis);
                    this.disableSelection();
                }
                else {
                    this.disableSelection();
                }
            }
        }
    }
    prepareActivePiece(pieceClicked, pointClicked) {
        this._board.activePiece = pieceClicked;
        this._selected = true;
        this._board.possibleCaptures = new AvailableMoveDecorator(pieceClicked, pointClicked, this._board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this._board).getPossibleCaptures();
        this._board.possibleMoves = new AvailableMoveDecorator(pieceClicked, pointClicked, this._board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this._board).getPossibleMoves();
    }
    onPieceClicked(pieceClicked, pointClicked) {
        if ((this._board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
            (!this._board.currentWhitePlayer && pieceClicked.color === Color.WHITE)) {
            return;
        }
        this.prepareActivePiece(pieceClicked, pointClicked);
    }
    handleClickEvent(pointClicked, isMouseDown) {
        let moving = false;
        if ((this._board.isPointInPossibleMoves(pointClicked) ||
            this._board.isPointInPossibleCaptures(pointClicked)) || this._freeMode) {
            this.saveClone();
            this._board.lastMoveSrc = new Point(this._board.activePiece.point.row, this._board.activePiece.point.col);
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
        const pieceClicked = this._board.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (pieceClicked && !moving) {
            this.onFreeMode(pieceClicked);
            this.onPieceClicked(pieceClicked, pointClicked);
        }
    }
    onMouseDown(event, pointClicked, left, top) {
        if (event.button !== 0) {
            this.drawPoint = ClickUtils.getDrawingPoint(this.heightAndWidth, this.colorStrategy, event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey, left, top);
            return;
        }
        this.drawProvider.clear();
        if (this._board.activePiece &&
            pointClicked.isEqual(this._board.activePiece.point)) {
            this.disabling = true;
            return;
        }
        const pieceClicked = this._board.getPieceByPoint(pointClicked.row, pointClicked.col);
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
        }
        else {
            if (pieceClicked) {
                this.onFreeMode(pieceClicked);
                this.onPieceClicked(pieceClicked, pointClicked);
            }
        }
    }
    onMouseUp(event, pointClicked, left, top) {
        if (event.button !== 0 && !this.drawDisabled) {
            this.addDrawPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey, left, top);
            return;
        }
        this.drawProvider.clear();
        if (this.dragDisabled) {
            return;
        }
        if (this._board.activePiece &&
            pointClicked.isEqual(this._board.activePiece.point) &&
            this.disabling) {
            this.disableSelection();
            this.disabling = false;
            return;
        }
        const pieceClicked = this._board.getPieceByPoint(pointClicked.row, pointClicked.col);
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
    movePiece(toMovePiece, newPoint, promotionIndex) {
        const destPiece = this._board.pieces.find((piece) => piece.point.col === newPoint.col &&
            piece.point.row === newPoint.row);
        if (destPiece && toMovePiece.color !== destPiece.color) {
            this._board.pieces = this._board.pieces.filter((piece) => piece !== destPiece);
        }
        else {
            if (destPiece && toMovePiece.color === destPiece.color) {
                return;
            }
        }
        const move = new HistoryMove(MoveUtils.format(toMovePiece.point, newPoint, this._board.reverted), toMovePiece.constant.name, toMovePiece.color === Color.WHITE ? 'white' : 'black', !!destPiece);
        this.moveHistoryProvider.addMove(move);
        if (toMovePiece instanceof King) {
            const squaresMoved = Math.abs(newPoint.col - toMovePiece.point.col);
            if (squaresMoved > 1) {
                if (newPoint.col < 3) {
                    const leftRook = this._board.getPieceByField(toMovePiece.point.row, 0);
                    if (!this._freeMode) {
                        leftRook.point.col = this._board.reverted ? 2 : 3;
                    }
                }
                else {
                    const rightRook = this._board.getPieceByField(toMovePiece.point.row, 7);
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
                PiecePromotionResolver.resolvePromotionChoice(this.board, toPromotePiece, promotionIndex);
                this.afterMoveActions(promotionIndex);
            }
            return true;
        }
    }
    checkIfPawnFirstMove(piece) {
        if (piece instanceof Pawn) {
            piece.isMovedAlready = true;
        }
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
    afterMoveActions(promotionIndex) {
        this.checkIfPawnFirstMove(this._board.activePiece);
        this.checkIfRookMoved(this._board.activePiece);
        this.checkIfKingMoved(this._board.activePiece);
        this._board.blackKingChecked = this._board.isKingInCheck(Color.BLACK, this._board.pieces);
        this._board.whiteKingChecked = this._board.isKingInCheck(Color.WHITE, this._board.pieces);
        const check = this._board.blackKingChecked || this._board.whiteKingChecked;
        const checkmate = this.checkForPossibleMoves(Color.BLACK) ||
            this.checkForPossibleMoves(Color.WHITE);
        const stalemate = this.checkForPat(Color.BLACK) || this.checkForPat(Color.WHITE);
        this.disabling = false;
        this._board.calculateFEN();
        const lastMove = this.moveHistoryProvider.getLastMove();
        if (lastMove && promotionIndex) {
            lastMove.move += promotionIndex;
        }
        this.moveChange.emit(Object.assign(Object.assign({}, lastMove), { check,
            checkmate,
            stalemate, fen: this._board.fen, freeMode: this._freeMode }));
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
    openPromoteDialog(piece) {
        this.modal.open((index) => {
            PiecePromotionResolver.resolvePromotionChoice(this.board, piece, index);
            this.afterMoveActions(index);
        });
    }
    checkForPossibleMoves(color) {
        return !this.board.pieces
            .filter((piece) => piece.color === color)
            .some((piece) => piece
            .getPossibleMoves()
            .some((move) => !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, move.row, move.col, this.board)) ||
            piece
                .getPossibleCaptures()
                .some((capture) => !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, capture.row, capture.col, this.board)));
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
        if (!this.freeMode ||
            pieceClicked === undefined ||
            pieceClicked === null) {
            return;
        }
        // sets player as white in-case white pieces are selected, and vice-versa when black is selected
        this.board.currentWhitePlayer = pieceClicked.color === Color.WHITE;
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
    addDrawPoint(x, y, crtl, alt, shift, left, top) {
        const upPoint = ClickUtils.getDrawingPoint(this.heightAndWidth, this.colorStrategy, x, y, crtl, alt, shift, left, top);
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
    increaseFullMoveCount() {
        if (!this.board.currentWhitePlayer) {
            ++this.board.fullMoveCount;
        }
    }
    get board() {
        return this._board;
    }
    set board(value) {
        this._board = value;
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
    }
    get freeMode() {
        return this._freeMode;
    }
    set freeMode(value) {
        this._freeMode = value;
    }
    addPiece(pieceTypeInput, colorInput, coords) {
        if (this.freeMode && coords && pieceTypeInput > 0 && colorInput > 0) {
            let indexes = MoveUtils.translateCoordsToIndex(coords, this.board.reverted);
            let existing = this.board.getPieceByPoint(indexes.yAxis, indexes.xAxis);
            if (existing) {
                this.board.pieces = this.board.pieces.filter(e => e !== existing);
            }
            let createdPiece = PieceFactory.create(indexes, pieceTypeInput, colorInput, this.board);
            this.saveClone();
            this.board.pieces.push(createdPiece);
            this.afterMoveActions();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLWZhY2FkZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvZW5naW5lL2VuZ2luZS1mYWNhZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBR3BFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDaEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFakYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDckQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUV0RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFckYsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFP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SUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hFLElBQUcsUUFBUSxFQUFFO2dCQUNULElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQzthQUNyRTtZQUNELElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4uL3BpZWNlLXByb21vdGlvbi9waWVjZS1wcm9tb3Rpb24tbW9kYWwvcGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIaXN0b3J5TW92ZSB9IGZyb20gJy4uL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUnO1xuaW1wb3J0IHsgQ29sb3JJbnB1dCwgUGllY2VUeXBlSW5wdXQgfSBmcm9tICcuLi91dGlscy9pbnB1dHMvcGllY2UtdHlwZS1pbnB1dCc7XG5cbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXInO1xuaW1wb3J0IHsgQm9hcmRTdGF0ZSB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtc3RhdGUnO1xuaW1wb3J0IHsgQm9hcmRTdGF0ZVByb3ZpZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1zdGF0ZS1wcm92aWRlcic7XG5pbXBvcnQgeyBNb3ZlU3RhdGVQcm92aWRlciB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvbW92ZS1zdGF0ZS1wcm92aWRlcic7XG5pbXBvcnQgeyBDb29yZHNQcm92aWRlciB9IGZyb20gJy4vY29vcmRzL2Nvb3Jkcy1wcm92aWRlcic7XG5pbXBvcnQgeyBDbGlja1V0aWxzIH0gZnJvbSAnLi9jbGljay9jbGljay11dGlscyc7XG5pbXBvcnQgeyBBcnJvdyB9IGZyb20gJy4vZHJhd2luZy10b29scy9zaGFwZXMvYXJyb3cnO1xuaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL3NoYXBlcy9jaXJjbGUnO1xuaW1wb3J0IHsgQ29sb3JTdHJhdGVneSB9IGZyb20gJy4vZHJhd2luZy10b29scy9jb2xvcnMvY29sb3Itc3RyYXRlZ3knO1xuaW1wb3J0IHsgRHJhd1BvaW50IH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL2RyYXctcG9pbnQnO1xuaW1wb3J0IHsgRHJhd1Byb3ZpZGVyIH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL2RyYXctcHJvdmlkZXInO1xuaW1wb3J0IHsgSGlzdG9yeU1vdmVQcm92aWRlciB9IGZyb20gJy4uL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUtcHJvdmlkZXInO1xuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuLi9tb2RlbHMvYm9hcmQnO1xuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL2NvbG9yJztcbmltcG9ydCB7IEtpbmcgfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL2tpbmcnO1xuaW1wb3J0IHsgUGF3biB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcGF3bic7XG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcGllY2UnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL3BvaW50JztcbmltcG9ydCB7IFJvb2sgfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL3Jvb2snO1xuaW1wb3J0IHsgQXZhaWxhYmxlTW92ZURlY29yYXRvciB9IGZyb20gJy4vcGllY2UtZGVjb3JhdG9yL2F2YWlsYWJsZS1tb3ZlLWRlY29yYXRvcic7XG5pbXBvcnQgeyBQaWVjZVByb21vdGlvblJlc29sdmVyIH0gZnJvbSAnLi4vcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1yZXNvbHZlcic7XG5pbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgUGllY2VJY29uSW5wdXRNYW5hZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXRzL3BpZWNlLWljb24taW5wdXQtbWFuYWdlcic7XG5pbXBvcnQgeyBNb3ZlVXRpbHMgfSBmcm9tICcuLi91dGlscy9tb3ZlLXV0aWxzJztcbmltcG9ydCB7IERyYWdFbmRTdHJhdGVneSB9IGZyb20gJy4vZHJhZy9lbmQvZHJhZy1lbmQtc3RyYXRlZ3knO1xuaW1wb3J0IHsgRHJhZ1N0YXJ0U3RyYXRlZ3kgfSBmcm9tICcuL2RyYWcvc3RhcnQvZHJhZy1zdGFydC1zdHJhdGVneSc7XG5pbXBvcnQgeyBNb3ZlQ2hhbmdlIH0gZnJvbSAnLi9tb3ZlLWNoYW5nZSc7XG5pbXBvcnQgeyBQaWVjZUZhY3RvcnkgfSBmcm9tICcuL3V0aWxzL3BpZWNlLWZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lRmFjYWRlIHtcblxuICAgIF9ib2FyZDogQm9hcmQ7XG4gICAgX3NlbGVjdGVkID0gZmFsc2U7XG4gICAgX2ZyZWVNb2RlID0gZmFsc2U7XG4gICAgZHJhd1BvaW50OiBEcmF3UG9pbnQ7XG4gICAgZHJhd1Byb3ZpZGVyOiBEcmF3UHJvdmlkZXI7XG4gICAgZGlzYWJsaW5nID0gZmFsc2U7XG4gICAgZHJhZ0Rpc2FibGVkOiBib29sZWFuO1xuICAgIGRyYXdEaXNhYmxlZDogYm9vbGVhbjtcbiAgICBib2FyZFN0YXRlUHJvdmlkZXI6IEJvYXJkU3RhdGVQcm92aWRlcjtcbiAgICBtb3ZlU3RhdGVQcm92aWRlcjogTW92ZVN0YXRlUHJvdmlkZXI7XG4gICAgbW92ZUhpc3RvcnlQcm92aWRlcjogSGlzdG9yeU1vdmVQcm92aWRlcjtcbiAgICBoZWlnaHRBbmRXaWR0aDogbnVtYmVyID0gQ29uc3RhbnRzLkRFRkFVTFRfU0laRTtcbiAgICBsaWdodERpc2FibGVkOiBib29sZWFuO1xuICAgIGRhcmtEaXNhYmxlZDogYm9vbGVhbjtcbiAgICBtb3ZlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TW92ZUNoYW5nZT47XG4gICAgYm9hcmRMb2FkZXI6IEJvYXJkTG9hZGVyO1xuICAgIGNvb3JkczogQ29vcmRzUHJvdmlkZXIgPSBuZXcgQ29vcmRzUHJvdmlkZXIoKTtcbiAgICBwaWVjZUljb25NYW5hZ2VyOiBQaWVjZUljb25JbnB1dE1hbmFnZXI7XG5cbiAgICBkcmFnU3RhcnRTdHJhdGVneTogRHJhZ1N0YXJ0U3RyYXRlZ3kgPSBuZXcgRHJhZ1N0YXJ0U3RyYXRlZ3koKTtcbiAgICBkcmFnRW5kU3RyYXRlZ3k6IERyYWdFbmRTdHJhdGVneSA9IG5ldyBEcmFnRW5kU3RyYXRlZ3koKTtcbiAgICBjb2xvclN0cmF0ZWd5OiBDb2xvclN0cmF0ZWd5ID0gbmV3IENvbG9yU3RyYXRlZ3koKTtcblxuICAgIG1vZGFsOiBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGJvYXJkOiBCb2FyZCxcbiAgICAgICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+XG4gICAgKSB7XG4gICAgICAgIHRoaXMuX2JvYXJkID0gYm9hcmQ7XG4gICAgICAgIHRoaXMubW92ZUNoYW5nZSA9IG1vdmVDaGFuZ2U7XG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIgPSBuZXcgQm9hcmRMb2FkZXIodGhpcy5ib2FyZCk7XG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuYWRkUGllY2VzKCk7XG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyID0gbmV3IERyYXdQcm92aWRlcigpO1xuICAgICAgICB0aGlzLnBpZWNlSWNvbk1hbmFnZXIgPSBuZXcgUGllY2VJY29uSW5wdXRNYW5hZ2VyKCk7XG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyID0gbmV3IEJvYXJkU3RhdGVQcm92aWRlcigpO1xuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIgPSBuZXcgSGlzdG9yeU1vdmVQcm92aWRlcigpO1xuICAgIH1cblxuICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcbiAgICAgICAgdGhpcy5ib2FyZC5yZXNldCgpO1xuICAgICAgICB0aGlzLmNvb3Jkcy5yZXNldCgpO1xuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLmZyZWVNb2RlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdW5kbygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RCb2FyZCA9IHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLnBvcCgpLmJvYXJkO1xuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICBsYXN0Qm9hcmQucmV2ZXJzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ib2FyZCA9IGxhc3RCb2FyZDtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuc2V0Qm9hcmQodGhpcy5ib2FyZCk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLnBvcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TW92ZUhpc3RvcnkoKTogSGlzdG9yeU1vdmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0QWxsKCk7XG4gICAgfVxuXG4gICAgc2F2ZU1vdmVDbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLmJvYXJkLmNsb25lKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVTdGF0ZVByb3ZpZGVyLmFkZE1vdmUobmV3IEJvYXJkU3RhdGUoY2xvbmUpKTtcbiAgICB9XG5cbiAgICBtb3ZlKGNvb3Jkczogc3RyaW5nKSB7XG4gICAgICAgIGlmIChjb29yZHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcbiAgICAgICAgICAgICAgICBjb29yZHMuc3Vic3RyaW5nKDAsIDIpLFxuICAgICAgICAgICAgICAgIHRoaXMuX2JvYXJkLnJldmVydGVkXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBkZXN0SW5kZXhlcyA9IE1vdmVVdGlscy50cmFuc2xhdGVDb29yZHNUb0luZGV4KFxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMiwgNCksXG4gICAgICAgICAgICAgICAgdGhpcy5fYm9hcmQucmV2ZXJ0ZWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNyY1BpZWNlID0gdGhpcy5fYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxuICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4ZXMueUF4aXMsXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHNyY1BpZWNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5fYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XG4gICAgICAgICAgICAgICAgICAgICghdGhpcy5fYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVBY3RpdmVQaWVjZShzcmNQaWVjZSwgc3JjUGllY2UucG9pbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZU1vdmVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGRlc3RJbmRleGVzLnlBeGlzLCBkZXN0SW5kZXhlcy54QXhpcylcbiAgICAgICAgICAgICAgICAgICAgKSB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZUNhcHR1cmVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGRlc3RJbmRleGVzLnlBeGlzLCBkZXN0SW5kZXhlcy54QXhpcylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVQaWVjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BpZWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGRlc3RJbmRleGVzLnlBeGlzLCBkZXN0SW5kZXhlcy54QXhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yZHMubGVuZ3RoID09PSA1ID8gK2Nvb3Jkcy5zdWJzdHJpbmcoNCwgNSkgOiAwXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9hcmQubGFzdE1vdmVTcmMgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnlBeGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZC5sYXN0TW92ZURlc3QgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0SW5kZXhlcy55QXhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RJbmRleGVzLnhBeGlzXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcmVwYXJlQWN0aXZlUGllY2UocGllY2VDbGlja2VkOiBQaWVjZSwgcG9pbnRDbGlja2VkOiBQb2ludCkge1xuICAgICAgICB0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZSA9IHBpZWNlQ2xpY2tlZDtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gbmV3IEF2YWlsYWJsZU1vdmVEZWNvcmF0b3IoXG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQsXG4gICAgICAgICAgICBwb2ludENsaWNrZWQsXG4gICAgICAgICAgICB0aGlzLl9ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPyBDb2xvci5XSElURSA6IENvbG9yLkJMQUNLLFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRcbiAgICAgICAgKS5nZXRQb3NzaWJsZUNhcHR1cmVzKCk7XG4gICAgICAgIHRoaXMuX2JvYXJkLnBvc3NpYmxlTW92ZXMgPSBuZXcgQXZhaWxhYmxlTW92ZURlY29yYXRvcihcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZCxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA/IENvbG9yLldISVRFIDogQ29sb3IuQkxBQ0ssXG4gICAgICAgICAgICB0aGlzLl9ib2FyZFxuICAgICAgICApLmdldFBvc3NpYmxlTW92ZXMoKTtcbiAgICB9XG5cbiAgICBvblBpZWNlQ2xpY2tlZChwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodGhpcy5fYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XG4gICAgICAgICAgICAoIXRoaXMuX2JvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJlcGFyZUFjdGl2ZVBpZWNlKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlQ2xpY2tFdmVudChwb2ludENsaWNrZWQ6IFBvaW50LCBpc01vdXNlRG93bjogYm9vbGVhbikge1xuICAgICAgICBsZXQgbW92aW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKChcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMocG9pbnRDbGlja2VkKSB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmQuaXNQb2ludEluUG9zc2libGVDYXB0dXJlcyhwb2ludENsaWNrZWQpXG4gICAgICAgICkgfHwgdGhpcy5fZnJlZU1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZUNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2FyZC5sYXN0TW92ZVNyYyA9IG5ldyBQb2ludChcbiAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgdGhpcy5fYm9hcmQuYWN0aXZlUGllY2UucG9pbnQuY29sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5fYm9hcmQubGFzdE1vdmVEZXN0ID0gcG9pbnRDbGlja2VkO1xuICAgICAgICAgICAgdGhpcy5tb3ZlUGllY2UodGhpcy5fYm9hcmQuYWN0aXZlUGllY2UsIHBvaW50Q2xpY2tlZCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fYm9hcmQuYWN0aXZlUGllY2UucG9pbnQuaXNFcXVhbCh0aGlzLl9ib2FyZC5sYXN0TW92ZVNyYykpIHtcbiAgICAgICAgICAgICAgICBtb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW91c2VEb3duIHx8IG1vdmluZykge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuX2JvYXJkLmdldFBpZWNlQnlQb2ludChcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXG4gICAgICAgICk7XG4gICAgICAgIGlmIChwaWVjZUNsaWNrZWQgJiYgIW1vdmluZykge1xuICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XG4gICAgICAgICAgICB0aGlzLm9uUGllY2VDbGlja2VkKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VEb3duKFxuICAgICAgICBldmVudDogTW91c2VFdmVudCxcbiAgICAgICAgcG9pbnRDbGlja2VkOiBQb2ludCxcbiAgICAgICAgbGVmdD86IG51bWJlcixcbiAgICAgICAgdG9wPzogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvaW50ID0gQ2xpY2tVdGlscy5nZXREcmF3aW5nUG9pbnQoXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRBbmRXaWR0aCxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yU3RyYXRlZ3ksXG4gICAgICAgICAgICAgICAgZXZlbnQueCxcbiAgICAgICAgICAgICAgICBldmVudC55LFxuICAgICAgICAgICAgICAgIGV2ZW50LmN0cmxLZXksXG4gICAgICAgICAgICAgICAgZXZlbnQuYWx0S2V5LFxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5LFxuICAgICAgICAgICAgICAgIGxlZnQsXG4gICAgICAgICAgICAgICAgdG9wXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuY2xlYXIoKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZSAmJlxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5fYm9hcmQuYWN0aXZlUGllY2UucG9pbnQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGllY2VDbGlja2VkID0gdGhpcy5fYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLnJvdyxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5jb2xcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5fZnJlZU1vZGUpIHtcbiAgICAgICAgICAgIGlmIChwaWVjZUNsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcyA9IHRoaXMuYm9hcmQucGllY2VzLmZpbHRlcihlID0+IGUgIT09IHBpZWNlQ2xpY2tlZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gKHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocGllY2VDbGlja2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblBpZWNlQ2xpY2tlZChwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlVXAoXG4gICAgICAgIGV2ZW50OiBNb3VzZUV2ZW50LFxuICAgICAgICBwb2ludENsaWNrZWQ6IFBvaW50LFxuICAgICAgICBsZWZ0OiBudW1iZXIsXG4gICAgICAgIHRvcDogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGlmIChldmVudC5idXR0b24gIT09IDAgJiYgIXRoaXMuZHJhd0Rpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZERyYXdQb2ludChcbiAgICAgICAgICAgICAgICBldmVudC54LFxuICAgICAgICAgICAgICAgIGV2ZW50LnksXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcbiAgICAgICAgICAgICAgICBldmVudC5hbHRLZXksXG4gICAgICAgICAgICAgICAgZXZlbnQuc2hpZnRLZXksXG4gICAgICAgICAgICAgICAgbGVmdCwgdG9wXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuY2xlYXIoKTtcblxuICAgICAgICBpZiAodGhpcy5kcmFnRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkLmFjdGl2ZVBpZWNlICYmXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuaXNFcXVhbCh0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZS5wb2ludCkgJiZcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuX2JvYXJkLmdldFBpZWNlQnlQb2ludChcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgZmFsc2UpO1xuICAgICAgICAgICAgLy8gICB0aGlzLnBvc3NpYmxlTW92ZXMgPSBhY3RpdmVQaWVjZS5nZXRQb3NzaWJsZU1vdmVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlQ2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5fYm9hcmQuY2xvbmUoKTtcblxuICAgICAgICBpZiAodGhpcy5fYm9hcmQucmV2ZXJ0ZWQpIHtcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5hZGRNb3ZlKG5ldyBCb2FyZFN0YXRlKGNsb25lKSk7XG4gICAgfVxuXG4gICAgbW92ZVBpZWNlKHRvTW92ZVBpZWNlOiBQaWVjZSwgbmV3UG9pbnQ6IFBvaW50LCBwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBkZXN0UGllY2UgPSB0aGlzLl9ib2FyZC5waWVjZXMuZmluZChcbiAgICAgICAgICAgIChwaWVjZSkgPT5cbiAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5jb2wgPT09IG5ld1BvaW50LmNvbCAmJlxuICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyA9PT0gbmV3UG9pbnQucm93XG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGRlc3RQaWVjZSAmJiB0b01vdmVQaWVjZS5jb2xvciAhPT0gZGVzdFBpZWNlLmNvbG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2FyZC5waWVjZXMgPSB0aGlzLl9ib2FyZC5waWVjZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT4gcGllY2UgIT09IGRlc3RQaWVjZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZXN0UGllY2UgJiYgdG9Nb3ZlUGllY2UuY29sb3IgPT09IGRlc3RQaWVjZS5jb2xvcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vdmUgPSBuZXcgSGlzdG9yeU1vdmUoXG4gICAgICAgICAgICBNb3ZlVXRpbHMuZm9ybWF0KHRvTW92ZVBpZWNlLnBvaW50LCBuZXdQb2ludCwgdGhpcy5fYm9hcmQucmV2ZXJ0ZWQpLFxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UuY29uc3RhbnQubmFtZSxcbiAgICAgICAgICAgIHRvTW92ZVBpZWNlLmNvbG9yID09PSBDb2xvci5XSElURSA/ICd3aGl0ZScgOiAnYmxhY2snLFxuICAgICAgICAgICAgISFkZXN0UGllY2VcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLmFkZE1vdmUobW92ZSk7XG5cbiAgICAgICAgaWYgKHRvTW92ZVBpZWNlIGluc3RhbmNlb2YgS2luZykge1xuICAgICAgICAgICAgY29uc3Qgc3F1YXJlc01vdmVkID0gTWF0aC5hYnMobmV3UG9pbnQuY29sIC0gdG9Nb3ZlUGllY2UucG9pbnQuY29sKTtcbiAgICAgICAgICAgIGlmIChzcXVhcmVzTW92ZWQgPiAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1BvaW50LmNvbCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdFJvb2sgPSB0aGlzLl9ib2FyZC5nZXRQaWVjZUJ5RmllbGQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b01vdmVQaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZnJlZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRSb29rLnBvaW50LmNvbCA9IHRoaXMuX2JvYXJkLnJldmVydGVkID8gMiA6IDM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodFJvb2sgPSB0aGlzLl9ib2FyZC5nZXRQaWVjZUJ5RmllbGQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b01vdmVQaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICA3XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZnJlZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Um9vay5wb2ludC5jb2wgPSB0aGlzLl9ib2FyZC5yZXZlcnRlZCA/IDQgOiA1O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRvTW92ZVBpZWNlIGluc3RhbmNlb2YgUGF3bikge1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5jaGVja0lmUGF3blRha2VzRW5QYXNzYW50KG5ld1BvaW50KTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY2hlY2tJZlBhd25FbnBhc3NhbnRlZCh0b01vdmVQaWVjZSwgbmV3UG9pbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQgPSBuZXdQb2ludDtcbiAgICAgICAgdGhpcy5pbmNyZWFzZUZ1bGxNb3ZlQ291bnQoKTtcbiAgICAgICAgdGhpcy5fYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gIXRoaXMuX2JvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcjtcblxuICAgICAgICBpZiAoIXRoaXMuY2hlY2tGb3JQYXduUHJvbW90ZSh0b01vdmVQaWVjZSwgcHJvbW90aW9uSW5kZXgpKSB7XG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrRm9yUGF3blByb21vdGUodG9Qcm9tb3RlUGllY2U6IFBpZWNlLCBwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xuICAgICAgICBpZiAoISh0b1Byb21vdGVQaWVjZSBpbnN0YW5jZW9mIFBhd24pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9Qcm9tb3RlUGllY2UucG9pbnQucm93ID09PSAwIHx8IHRvUHJvbW90ZVBpZWNlLnBvaW50LnJvdyA9PT0gNykge1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PiBwaWVjZSAhPT0gdG9Qcm9tb3RlUGllY2VcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIFdoZW4gd2UgbWFrZSBtb3ZlIG1hbnVhbGx5LCB3ZSBwYXNzIHByb21vdGlvbiBpbmRleCBhbHJlYWR5LCBzbyB3ZSBkb24ndCBuZWVkXG4gICAgICAgICAgICAvLyB0byBhY3F1aXJlIGl0IGZyb20gcHJvbW90ZSBkaWFsb2dcbiAgICAgICAgICAgIGlmICghcHJvbW90aW9uSW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Qcm9tb3RlRGlhbG9nKHRvUHJvbW90ZVBpZWNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgUGllY2VQcm9tb3Rpb25SZXNvbHZlci5yZXNvbHZlUHJvbW90aW9uQ2hvaWNlKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLFxuICAgICAgICAgICAgICAgICAgICB0b1Byb21vdGVQaWVjZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvbW90aW9uSW5kZXhcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuYWZ0ZXJNb3ZlQWN0aW9ucyhwcm9tb3Rpb25JbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tJZlBhd25GaXJzdE1vdmUocGllY2U6IFBpZWNlKSB7XG4gICAgICAgIGlmIChwaWVjZSBpbnN0YW5jZW9mIFBhd24pIHtcbiAgICAgICAgICAgIHBpZWNlLmlzTW92ZWRBbHJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrSWZSb29rTW92ZWQocGllY2U6IFBpZWNlKSB7XG4gICAgICAgIGlmIChwaWVjZSBpbnN0YW5jZW9mIFJvb2spIHtcbiAgICAgICAgICAgIHBpZWNlLmlzTW92ZWRBbHJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrSWZLaW5nTW92ZWQocGllY2U6IFBpZWNlKSB7XG4gICAgICAgIGlmIChwaWVjZSBpbnN0YW5jZW9mIEtpbmcpIHtcbiAgICAgICAgICAgIHBpZWNlLmlzTW92ZWRBbHJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jaGVja0lmUGF3bkZpcnN0TW92ZSh0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZSk7XG4gICAgICAgIHRoaXMuY2hlY2tJZlJvb2tNb3ZlZCh0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZSk7XG4gICAgICAgIHRoaXMuY2hlY2tJZktpbmdNb3ZlZCh0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZSk7XG5cbiAgICAgICAgdGhpcy5fYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCA9IHRoaXMuX2JvYXJkLmlzS2luZ0luQ2hlY2soXG4gICAgICAgICAgICBDb2xvci5CTEFDSyxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkLnBpZWNlc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLl9ib2FyZC53aGl0ZUtpbmdDaGVja2VkID0gdGhpcy5fYm9hcmQuaXNLaW5nSW5DaGVjayhcbiAgICAgICAgICAgIENvbG9yLldISVRFLFxuICAgICAgICAgICAgdGhpcy5fYm9hcmQucGllY2VzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNoZWNrID1cbiAgICAgICAgICAgIHRoaXMuX2JvYXJkLmJsYWNrS2luZ0NoZWNrZWQgfHwgdGhpcy5fYm9hcmQud2hpdGVLaW5nQ2hlY2tlZDtcbiAgICAgICAgY29uc3QgY2hlY2ttYXRlID1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLkJMQUNLKSB8fFxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoQ29sb3IuV0hJVEUpO1xuICAgICAgICBjb25zdCBzdGFsZW1hdGUgPVxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBhdChDb2xvci5CTEFDSykgfHwgdGhpcy5jaGVja0ZvclBhdChDb2xvci5XSElURSk7XG5cbiAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYm9hcmQuY2FsY3VsYXRlRkVOKCk7XG5cbiAgICAgICAgY29uc3QgbGFzdE1vdmUgPSB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0TGFzdE1vdmUoKTtcbiAgICAgICAgaWYgKGxhc3RNb3ZlICYmIHByb21vdGlvbkluZGV4KSB7XG4gICAgICAgICAgICBsYXN0TW92ZS5tb3ZlICs9IHByb21vdGlvbkluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3ZlQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgLi4ubGFzdE1vdmUsXG4gICAgICAgICAgICBjaGVjayxcbiAgICAgICAgICAgIGNoZWNrbWF0ZSxcbiAgICAgICAgICAgIHN0YWxlbWF0ZSxcbiAgICAgICAgICAgIGZlbjogdGhpcy5fYm9hcmQuZmVuLFxuICAgICAgICAgICAgZnJlZU1vZGU6IHRoaXMuX2ZyZWVNb2RlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNoZWNrRm9yUGF0KGNvbG9yOiBDb2xvcikge1xuICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLldISVRFICYmICF0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLkJMQUNLICYmICF0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3BlblByb21vdGVEaWFsb2cocGllY2U6IFBpZWNlKSB7XG4gICAgICAgIHRoaXMubW9kYWwub3BlbigoaW5kZXgpID0+IHtcbiAgICAgICAgICAgIFBpZWNlUHJvbW90aW9uUmVzb2x2ZXIucmVzb2x2ZVByb21vdGlvbkNob2ljZShcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLFxuICAgICAgICAgICAgICAgIHBpZWNlLFxuICAgICAgICAgICAgICAgIGluZGV4XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKGluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yOiBDb2xvcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuYm9hcmQucGllY2VzXG4gICAgICAgICAgICAuZmlsdGVyKChwaWVjZSkgPT4gcGllY2UuY29sb3IgPT09IGNvbG9yKVxuICAgICAgICAgICAgLnNvbWUoXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PlxuICAgICAgICAgICAgICAgICAgICBwaWVjZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldFBvc3NpYmxlTW92ZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdmUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFNb3ZlVXRpbHMud2lsbE1vdmVDYXVzZUNoZWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlLnJvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmUuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApIHx8XG4gICAgICAgICAgICAgICAgICAgIHBpZWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0UG9zc2libGVDYXB0dXJlcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2FwdHVyZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIU1vdmVVdGlscy53aWxsTW92ZUNhdXNlQ2hlY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LmNvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgZGlzYWJsZVNlbGVjdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICB0aGlzLl9ib2FyZC5hY3RpdmVQaWVjZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2JvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgbG9naWMgdG8gYWxsb3cgZnJlZU1vZGUgYmFzZWQgbG9naWMgcHJvY2Vzc2luZ1xuICAgICAqL1xuICAgIG9uRnJlZU1vZGUocGllY2VDbGlja2VkKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmZyZWVNb2RlIHx8XG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgcGllY2VDbGlja2VkID09PSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldHMgcGxheWVyIGFzIHdoaXRlIGluLWNhc2Ugd2hpdGUgcGllY2VzIGFyZSBzZWxlY3RlZCwgYW5kIHZpY2UtdmVyc2Egd2hlbiBibGFjayBpcyBzZWxlY3RlZFxuICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA9IHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEU7XG4gICAgfVxuXG4gICAgaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZDogUGllY2UpIHtcbiAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCAmJiBwaWVjZUNsaWNrZWQucG9pbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kQ2FwdHVyZSA9IHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcy5maW5kKFxuICAgICAgICAgICAgICAgIChjYXB0dXJlKSA9PlxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLmNvbCA9PT0gcGllY2VDbGlja2VkLnBvaW50LmNvbCAmJlxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyA9PT0gcGllY2VDbGlja2VkLnBvaW50LnJvd1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kQ2FwdHVyZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgcGllY2VDbGlja2VkICYmXG4gICAgICAgICAgICAoKHRoaXMubGlnaHREaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLmRhcmtEaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLkJMQUNLKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhZGREcmF3UG9pbnQoXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyLFxuICAgICAgICBjcnRsOiBib29sZWFuLFxuICAgICAgICBhbHQ6IGJvb2xlYW4sXG4gICAgICAgIHNoaWZ0OiBib29sZWFuLFxuICAgICAgICBsZWZ0OiBudW1iZXIsXG4gICAgICAgIHRvcDogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IHVwUG9pbnQgPSBDbGlja1V0aWxzLmdldERyYXdpbmdQb2ludChcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0QW5kV2lkdGgsXG4gICAgICAgICAgICB0aGlzLmNvbG9yU3RyYXRlZ3ksXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIGNydGwsXG4gICAgICAgICAgICBhbHQsXG4gICAgICAgICAgICBzaGlmdCxcbiAgICAgICAgICAgIGxlZnQsXG4gICAgICAgICAgICB0b3BcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5kcmF3UG9pbnQuaXNFcXVhbCh1cFBvaW50KSkge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gbmV3IENpcmNsZSgpO1xuICAgICAgICAgICAgY2lyY2xlLmRyYXdQb2ludCA9IHVwUG9pbnQ7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhd1Byb3ZpZGVyLmNvbnRhaW5zQ2lyY2xlKGNpcmNsZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRDaXJjbGUoY2lyY2xlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIucmVvbXZlQ2lyY2xlKGNpcmNsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhcnJvdyA9IG5ldyBBcnJvdygpO1xuICAgICAgICAgICAgYXJyb3cuc3RhcnQgPSB0aGlzLmRyYXdQb2ludDtcbiAgICAgICAgICAgIGFycm93LmVuZCA9IHVwUG9pbnQ7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmF3UHJvdmlkZXIuY29udGFpbnNBcnJvdyhhcnJvdykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRBcnJvdyhhcnJvdyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlbW92ZUFycm93KGFycm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluY3JlYXNlRnVsbE1vdmVDb3VudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcikge1xuICAgICAgICAgICAgKyt0aGlzLmJvYXJkLmZ1bGxNb3ZlQ291bnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgYm9hcmQoKTogQm9hcmQge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9hcmQ7XG4gICAgfVxuXG4gICAgc2V0IGJvYXJkKHZhbHVlOiBCb2FyZCkge1xuICAgICAgICB0aGlzLl9ib2FyZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICAgIH1cblxuICAgIHNldCBzZWxlY3RlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBmcmVlTW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZyZWVNb2RlO1xuICAgIH1cblxuICAgIHNldCBmcmVlTW9kZSh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9mcmVlTW9kZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGFkZFBpZWNlKFxuICAgICAgICBwaWVjZVR5cGVJbnB1dDogUGllY2VUeXBlSW5wdXQsXG4gICAgICAgIGNvbG9ySW5wdXQ6IENvbG9ySW5wdXQsXG4gICAgICAgIGNvb3Jkczogc3RyaW5nXG4gICAgKSB7XG4gICAgICAgIGlmICh0aGlzLmZyZWVNb2RlICYmIGNvb3JkcyAmJiBwaWVjZVR5cGVJbnB1dCA+IDAgJiYgY29sb3JJbnB1dCA+IDApIHtcbiAgICAgICAgICAgIGxldCBpbmRleGVzID0gTW92ZVV0aWxzLnRyYW5zbGF0ZUNvb3Jkc1RvSW5kZXgoY29vcmRzLCB0aGlzLmJvYXJkLnJldmVydGVkKTtcbiAgICAgICAgICAgIGxldCBleGlzdGluZyA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KGluZGV4ZXMueUF4aXMsIGluZGV4ZXMueEF4aXMpO1xuICAgICAgICAgICAgaWYoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcyA9IHRoaXMuYm9hcmQucGllY2VzLmZpbHRlcihlID0+IGUgIT09IGV4aXN0aW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjcmVhdGVkUGllY2UgPSBQaWVjZUZhY3RvcnkuY3JlYXRlKGluZGV4ZXMsIHBpZWNlVHlwZUlucHV0LCBjb2xvcklucHV0LCB0aGlzLmJvYXJkKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZUNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcy5wdXNoKGNyZWF0ZWRQaWVjZSk7XG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==