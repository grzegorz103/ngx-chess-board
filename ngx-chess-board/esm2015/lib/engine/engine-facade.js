import { HistoryMove } from '../history-move-provider/history-move';
import { AbstractEngineFacade } from './abstract-engine-facade';
import { BoardLoader } from './board-state-provider/board-loader/board-loader';
import { BoardState } from './board-state-provider/board-state/board-state';
import { BoardStateProvider } from './board-state-provider/board-state/board-state-provider';
import { ClickUtils } from './click/click-utils';
import { Arrow } from './drawing-tools/shapes/arrow';
import { Circle } from './drawing-tools/shapes/circle';
import { Color } from '../models/pieces/color';
import { King } from '../models/pieces/king';
import { Pawn } from '../models/pieces/pawn';
import { Point } from '../models/pieces/point';
import { AvailableMoveDecorator } from './piece-decorator/available-move-decorator';
import { PiecePromotionResolver } from '../piece-promotion/piece-promotion-resolver';
import { MoveUtils } from '../utils/move-utils';
import { PieceFactory } from './utils/piece-factory';
export class EngineFacade extends AbstractEngineFacade {
    constructor(board, moveChange) {
        super(board);
        this._selected = false;
        this.moveChange = moveChange;
        this.boardLoader = new BoardLoader(this);
        this.boardLoader.addPieces();
        this.boardStateProvider = new BoardStateProvider();
    }
    reset() {
        this.boardStateProvider.clear();
        this.moveHistoryProvider.clear();
        this.boardLoader.addPieces();
        this.board.reset();
        this.coords.reset();
        this.drawProvider.clear();
        this.pgnProcessor.reset();
    }
    undo() {
        if (!this.boardStateProvider.isEmpty()) {
            const lastBoard = this.boardStateProvider.pop().board;
            if (this.board.reverted) {
                lastBoard.reverse();
            }
            this.board = lastBoard;
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
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
    move(coords) {
        if (coords) {
            const sourceIndexes = MoveUtils.translateCoordsToIndex(coords.substring(0, 2), this.board.reverted);
            const destIndexes = MoveUtils.translateCoordsToIndex(coords.substring(2, 4), this.board.reverted);
            const srcPiece = this.board.getPieceByPoint(sourceIndexes.yAxis, sourceIndexes.xAxis);
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
    prepareActivePiece(pieceClicked, pointClicked) {
        this.board.activePiece = pieceClicked;
        this._selected = true;
        this.board.possibleCaptures = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleCaptures();
        this.board.possibleMoves = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleMoves();
    }
    onPieceClicked(pieceClicked, pointClicked) {
        if ((this.board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
            (!this.board.currentWhitePlayer && pieceClicked.color === Color.WHITE)) {
            return;
        }
        this.prepareActivePiece(pieceClicked, pointClicked);
    }
    handleClickEvent(pointClicked, isMouseDown) {
        let moving = false;
        if (((this.board.isPointInPossibleMoves(pointClicked) ||
            this.board.isPointInPossibleCaptures(pointClicked)) || this.freeMode) && pointClicked.isInRange()) {
            this.saveClone();
            this.board.lastMoveSrc = new Point(this.board.activePiece.point.row, this.board.activePiece.point.col);
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
        const pieceClicked = this.board.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (pieceClicked && !moving) {
            this.onFreeMode(pieceClicked);
            this.onPieceClicked(pieceClicked, pointClicked);
        }
    }
    onMouseDown(event, pointClicked, left, top) {
        this.moveDone = false;
        if (event.button !== 0) {
            this.drawPoint = ClickUtils.getDrawingPoint(this.heightAndWidth, this.colorStrategy, event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey, left, top);
            return;
        }
        this.drawProvider.clear();
        if (this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point)) {
            this.disabling = true;
            return;
        }
        const pieceClicked = this.board.getPieceByPoint(pointClicked.row, pointClicked.col);
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
        }
        else {
            if (pieceClicked) {
                this.onFreeMode(pieceClicked);
                this.onPieceClicked(pieceClicked, pointClicked);
            }
        }
    }
    onMouseUp(event, pointClicked, left, top) {
        this.moveDone = false;
        if (event.button !== 0 && !this.drawDisabled) {
            this.addDrawPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey, left, top);
            return;
        }
        this.drawProvider.clear();
        if (this.dragDisabled) {
            return;
        }
        if (this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point) &&
            this.disabling) {
            this.disableSelection();
            this.disabling = false;
            return;
        }
        const pieceClicked = this.board.getPieceByPoint(pointClicked.row, pointClicked.col);
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
    movePiece(toMovePiece, newPoint, promotionIndex) {
        const destPiece = this.board.pieces.find((piece) => piece.point.col === newPoint.col &&
            piece.point.row === newPoint.row);
        this.pgnProcessor.process(this.board, toMovePiece, newPoint, destPiece);
        if (destPiece && toMovePiece.color !== destPiece.color) {
            this.board.pieces = this.board.pieces.filter((piece) => piece !== destPiece);
        }
        else {
            if (destPiece && toMovePiece.color === destPiece.color) {
                return;
            }
        }
        this.historyMoveCandidate = new HistoryMove(MoveUtils.format(toMovePiece.point, newPoint, this.board.reverted), toMovePiece.constant.name, toMovePiece.color === Color.WHITE ? 'white' : 'black', !!destPiece);
        this.moveHistoryProvider.addMove(this.historyMoveCandidate);
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
            this.board.checkIfPawnTakesEnPassant(newPoint);
            this.board.checkIfPawnEnpassanted(toMovePiece, newPoint);
        }
        else {
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
        this.historyMoveCandidate.setGameStates(check, stalemate, checkmate);
        this.pgnProcessor.processChecks(checkmate, check, stalemate);
        this.pgnProcessor.addPromotionChoice(promotionIndex);
        this.disabling = false;
        this.board.calculateFEN();
        const lastMove = this.moveHistoryProvider.getLastMove();
        if (lastMove && promotionIndex) {
            lastMove.move += promotionIndex;
        }
        this.moveChange.emit(Object.assign(Object.assign({}, lastMove), { check,
            checkmate,
            stalemate, fen: this.board.fen, pgn: {
                pgn: this.pgnProcessor.getPGN()
            }, freeMode: this.freeMode }));
        this.moveDone = true;
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
        if (piece.color === this.board.activePiece.color) {
            this.modal.open((index) => {
                PiecePromotionResolver.resolvePromotionChoice(this.board, piece, index);
                this.afterMoveActions(index);
            });
        }
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
        this.board.possibleCaptures = [];
        this.board.activePiece = null;
        this.board.possibleMoves = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLWZhY2FkZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvZW5naW5lL2VuZ2luZS1mYWNhZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXBFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUMvRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seURBQXlELENBQUM7QUFFN0YsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFJdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRS9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVoRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFckQs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RUQsUUFBUSxDQUNKLGNBQThCLEVBQzlCLFVBQXNCLEVBQ3RCLE1BQWM7UUFFZCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxJQUFJLGNBQWMsR0FBRyxDQUFDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtZQUNqRSxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsc0JBQXNCLENBQzFDLE1BQU0sRUFDTixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FDdEIsQ0FBQztZQUNGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUNyQyxPQUFPLENBQUMsS0FBSyxFQUNiLE9BQU8sQ0FBQyxLQUFLLENBQ2hCLENBQUM7WUFDRixJQUFJLFFBQVEsRUFBRTtnQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUM7YUFDckU7WUFDRCxJQUFJLFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUNsQyxPQUFPLEVBQ1AsY0FBYyxFQUNkLFVBQVUsRUFDVixJQUFJLENBQUMsS0FBSyxDQUNiLENBQUM7WUFDRixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIaXN0b3J5TW92ZSB9IGZyb20gJy4uL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUnO1xuaW1wb3J0IHsgQ29sb3JJbnB1dCwgUGllY2VUeXBlSW5wdXQgfSBmcm9tICcuLi91dGlscy9pbnB1dHMvcGllY2UtdHlwZS1pbnB1dCc7XG5pbXBvcnQgeyBBYnN0cmFjdEVuZ2luZUZhY2FkZSB9IGZyb20gJy4vYWJzdHJhY3QtZW5naW5lLWZhY2FkZSc7XG5cbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvYm9hcmQtbG9hZGVyJztcbmltcG9ydCB7IEJvYXJkU3RhdGUgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlL2JvYXJkLXN0YXRlJztcbmltcG9ydCB7IEJvYXJkU3RhdGVQcm92aWRlciB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtc3RhdGUvYm9hcmQtc3RhdGUtcHJvdmlkZXInO1xuaW1wb3J0IHsgTW92ZVN0YXRlUHJvdmlkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlL21vdmUtc3RhdGUtcHJvdmlkZXInO1xuaW1wb3J0IHsgQ2xpY2tVdGlscyB9IGZyb20gJy4vY2xpY2svY2xpY2stdXRpbHMnO1xuaW1wb3J0IHsgQXJyb3cgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvc2hhcGVzL2Fycm93JztcbmltcG9ydCB7IENpcmNsZSB9IGZyb20gJy4vZHJhd2luZy10b29scy9zaGFwZXMvY2lyY2xlJztcbmltcG9ydCB7IERyYXdQb2ludCB9IGZyb20gJy4vZHJhd2luZy10b29scy9kcmF3LXBvaW50JztcbmltcG9ydCB7IERyYXdQcm92aWRlciB9IGZyb20gJy4vZHJhd2luZy10b29scy9kcmF3LXByb3ZpZGVyJztcbmltcG9ydCB7IEJvYXJkIH0gZnJvbSAnLi4vbW9kZWxzL2JvYXJkJztcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9jb2xvcic7XG5pbXBvcnQgeyBLaW5nIH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9raW5nJztcbmltcG9ydCB7IFBhd24gfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL3Bhd24nO1xuaW1wb3J0IHsgUGllY2UgfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL3BpZWNlJztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9wb2ludCc7XG5pbXBvcnQgeyBEZWZhdWx0UGduUHJvY2Vzc29yIH0gZnJvbSAnLi9wZ24vZGVmYXVsdC1wZ24tcHJvY2Vzc29yJztcbmltcG9ydCB7IEF2YWlsYWJsZU1vdmVEZWNvcmF0b3IgfSBmcm9tICcuL3BpZWNlLWRlY29yYXRvci9hdmFpbGFibGUtbW92ZS1kZWNvcmF0b3InO1xuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25SZXNvbHZlciB9IGZyb20gJy4uL3BpZWNlLXByb21vdGlvbi9waWVjZS1wcm9tb3Rpb24tcmVzb2x2ZXInO1xuaW1wb3J0IHsgTW92ZVV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvbW92ZS11dGlscyc7XG5pbXBvcnQgeyBNb3ZlQ2hhbmdlIH0gZnJvbSAnLi9vdXRwdXRzL21vdmUtY2hhbmdlL21vdmUtY2hhbmdlJztcbmltcG9ydCB7IFBpZWNlRmFjdG9yeSB9IGZyb20gJy4vdXRpbHMvcGllY2UtZmFjdG9yeSc7XG5cbmV4cG9ydCBjbGFzcyBFbmdpbmVGYWNhZGUgZXh0ZW5kcyBBYnN0cmFjdEVuZ2luZUZhY2FkZSB7XG5cbiAgICBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICBkcmF3UG9pbnQ6IERyYXdQb2ludDtcbiAgICBkcmF3UHJvdmlkZXI6IERyYXdQcm92aWRlcjtcbiAgICBib2FyZFN0YXRlUHJvdmlkZXI6IEJvYXJkU3RhdGVQcm92aWRlcjtcbiAgICBtb3ZlU3RhdGVQcm92aWRlcjogTW92ZVN0YXRlUHJvdmlkZXI7XG4gICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+O1xuXG4gICAgcHJpdmF0ZSBoaXN0b3J5TW92ZUNhbmRpZGF0ZTogSGlzdG9yeU1vdmU7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYm9hcmQ6IEJvYXJkLFxuICAgICAgICBtb3ZlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TW92ZUNoYW5nZT5cbiAgICApIHtcbiAgICAgICAgc3VwZXIoYm9hcmQpO1xuICAgICAgICB0aGlzLm1vdmVDaGFuZ2UgPSBtb3ZlQ2hhbmdlO1xuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyID0gbmV3IEJvYXJkTG9hZGVyKHRoaXMpO1xuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlciA9IG5ldyBCb2FyZFN0YXRlUHJvdmlkZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xuICAgICAgICB0aGlzLmJvYXJkLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuY29vcmRzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucGduUHJvY2Vzc29yLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVuZG8oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0Qm9hcmQgPSB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5wb3AoKS5ib2FyZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkLnJldmVydGVkKSB7XG4gICAgICAgICAgICAgICAgbGFzdEJvYXJkLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYm9hcmQgPSBsYXN0Qm9hcmQ7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLnBvcCgpO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcbiAgICAgICAgICAgIHRoaXMucGduUHJvY2Vzc29yLnJlbW92ZUxhc3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVNb3ZlQ2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5ib2FyZC5jbG9uZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmJvYXJkLnJldmVydGVkKSB7XG4gICAgICAgICAgICBjbG9uZS5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb3ZlU3RhdGVQcm92aWRlci5hZGRNb3ZlKG5ldyBCb2FyZFN0YXRlKGNsb25lKSk7XG4gICAgfVxuXG4gICAgcHVibGljIG1vdmUoY29vcmRzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGNvb3Jkcykge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlSW5kZXhlcyA9IE1vdmVVdGlscy50cmFuc2xhdGVDb29yZHNUb0luZGV4KFxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMCwgMiksXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgZGVzdEluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcbiAgICAgICAgICAgICAgICBjb29yZHMuc3Vic3RyaW5nKDIsIDQpLFxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucmV2ZXJ0ZWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNyY1BpZWNlID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcbiAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnhBeGlzXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoc3JjUGllY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGllY2UuY29sb3IgPT09IENvbG9yLkJMQUNLKSB8fFxuICAgICAgICAgICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVBY3RpdmVQaWVjZShzcmNQaWVjZSwgc3JjUGllY2UucG9pbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoZGVzdEluZGV4ZXMueUF4aXMsIGRlc3RJbmRleGVzLnhBeGlzKVxuICAgICAgICAgICAgICAgICAgICApIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuaXNQb2ludEluUG9zc2libGVDYXB0dXJlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlUGllY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzLmxlbmd0aCA9PT0gNSA/ICtjb29yZHMuc3Vic3RyaW5nKDQsIDUpIDogMFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQubGFzdE1vdmVTcmMgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnlBeGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlRGVzdCA9IG5ldyBQb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RJbmRleGVzLnlBeGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEluZGV4ZXMueEF4aXNcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByZXBhcmVBY3RpdmVQaWVjZShwaWVjZUNsaWNrZWQ6IFBpZWNlLCBwb2ludENsaWNrZWQ6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgPSBwaWVjZUNsaWNrZWQ7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gbmV3IEF2YWlsYWJsZU1vdmVEZWNvcmF0b3IoXG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQsXG4gICAgICAgICAgICBwb2ludENsaWNrZWQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA/IENvbG9yLldISVRFIDogQ29sb3IuQkxBQ0ssXG4gICAgICAgICAgICB0aGlzLmJvYXJkXG4gICAgICAgICkuZ2V0UG9zc2libGVDYXB0dXJlcygpO1xuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBuZXcgQXZhaWxhYmxlTW92ZURlY29yYXRvcihcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID8gQ29sb3IuV0hJVEUgOiBDb2xvci5CTEFDSyxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgKS5nZXRQb3NzaWJsZU1vdmVzKCk7XG4gICAgfVxuXG4gICAgb25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XG4gICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmVwYXJlQWN0aXZlUGllY2UocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZDogUG9pbnQsIGlzTW91c2VEb3duOiBib29sZWFuKSB7XG4gICAgICAgIGxldCBtb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCgoXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMocG9pbnRDbGlja2VkKSB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZUNhcHR1cmVzKHBvaW50Q2xpY2tlZClcbiAgICAgICAgKSB8fCB0aGlzLmZyZWVNb2RlKSAmJiBwb2ludENsaWNrZWQuaXNJblJhbmdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZUNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlU3JjID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQucm93LFxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQuY29sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZURlc3QgPSBwb2ludENsaWNrZWQuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMubW92ZVBpZWNlKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UsIHBvaW50Q2xpY2tlZCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludC5pc0VxdWFsKHRoaXMuYm9hcmQubGFzdE1vdmVTcmMpKSB7XG4gICAgICAgICAgICAgICAgbW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc01vdXNlRG93biB8fCBtb3ZpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xuICAgICAgICBjb25zdCBwaWVjZUNsaWNrZWQgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlQb2ludChcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXG4gICAgICAgICk7XG4gICAgICAgIGlmIChwaWVjZUNsaWNrZWQgJiYgIW1vdmluZykge1xuICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XG4gICAgICAgICAgICB0aGlzLm9uUGllY2VDbGlja2VkKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VEb3duKFxuICAgICAgICBldmVudDogTW91c2VFdmVudCxcbiAgICAgICAgcG9pbnRDbGlja2VkOiBQb2ludCxcbiAgICAgICAgbGVmdD86IG51bWJlcixcbiAgICAgICAgdG9wPzogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIHRoaXMubW92ZURvbmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kcmF3UG9pbnQgPSBDbGlja1V0aWxzLmdldERyYXdpbmdQb2ludChcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodEFuZFdpZHRoLFxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JTdHJhdGVneSxcbiAgICAgICAgICAgICAgICBldmVudC54LFxuICAgICAgICAgICAgICAgIGV2ZW50LnksXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcbiAgICAgICAgICAgICAgICBldmVudC5hbHRLZXksXG4gICAgICAgICAgICAgICAgZXZlbnQuc2hpZnRLZXksXG4gICAgICAgICAgICAgICAgbGVmdCxcbiAgICAgICAgICAgICAgICB0b3BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgJiZcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5pc0VxdWFsKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGllY2VDbGlja2VkID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmNvbFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh0aGlzLmZyZWVNb2RlKSB7XG4gICAgICAgICAgICBpZiAocGllY2VDbGlja2VkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoZSA9PiBlICE9PSBwaWVjZUNsaWNrZWQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gKHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocGllY2VDbGlja2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblBpZWNlQ2xpY2tlZChwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlVXAoXG4gICAgICAgIGV2ZW50OiBNb3VzZUV2ZW50LFxuICAgICAgICBwb2ludENsaWNrZWQ6IFBvaW50LFxuICAgICAgICBsZWZ0OiBudW1iZXIsXG4gICAgICAgIHRvcDogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIHRoaXMubW92ZURvbmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCAmJiAhdGhpcy5kcmF3RGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRHJhd1BvaW50KFxuICAgICAgICAgICAgICAgIGV2ZW50LngsXG4gICAgICAgICAgICAgICAgZXZlbnQueSxcbiAgICAgICAgICAgICAgICBldmVudC5jdHJsS2V5LFxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcbiAgICAgICAgICAgICAgICBldmVudC5zaGlmdEtleSxcbiAgICAgICAgICAgICAgICBsZWZ0LCB0b3BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xuXG4gICAgICAgIGlmICh0aGlzLmRyYWdEaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSAmJlxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludCkgJiZcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLnJvdyxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5jb2xcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrRXZlbnQocG9pbnRDbGlja2VkLCBmYWxzZSk7XG4gICAgICAgICAgICAvLyAgIHRoaXMucG9zc2libGVNb3ZlcyA9IGFjdGl2ZVBpZWNlLmdldFBvc3NpYmxlTW92ZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVDbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLmJvYXJkLmNsb25lKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5hZGRNb3ZlKG5ldyBCb2FyZFN0YXRlKGNsb25lKSk7XG4gICAgfVxuXG4gICAgbW92ZVBpZWNlKHRvTW92ZVBpZWNlOiBQaWVjZSwgbmV3UG9pbnQ6IFBvaW50LCBwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBkZXN0UGllY2UgPSB0aGlzLmJvYXJkLnBpZWNlcy5maW5kKFxuICAgICAgICAgICAgKHBpZWNlKSA9PlxuICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LmNvbCA9PT0gbmV3UG9pbnQuY29sICYmXG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQucm93ID09PSBuZXdQb2ludC5yb3dcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnBnblByb2Nlc3Nvci5wcm9jZXNzKFxuICAgICAgICAgICAgdGhpcy5ib2FyZCxcbiAgICAgICAgICAgIHRvTW92ZVBpZWNlLFxuICAgICAgICAgICAgbmV3UG9pbnQsXG4gICAgICAgICAgICBkZXN0UGllY2VcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZGVzdFBpZWNlICYmIHRvTW92ZVBpZWNlLmNvbG9yICE9PSBkZXN0UGllY2UuY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT4gcGllY2UgIT09IGRlc3RQaWVjZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZXN0UGllY2UgJiYgdG9Nb3ZlUGllY2UuY29sb3IgPT09IGRlc3RQaWVjZS5jb2xvcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGlzdG9yeU1vdmVDYW5kaWRhdGUgPSBuZXcgSGlzdG9yeU1vdmUoXG4gICAgICAgICAgICBNb3ZlVXRpbHMuZm9ybWF0KHRvTW92ZVBpZWNlLnBvaW50LCBuZXdQb2ludCwgdGhpcy5ib2FyZC5yZXZlcnRlZCksXG4gICAgICAgICAgICB0b01vdmVQaWVjZS5jb25zdGFudC5uYW1lLFxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UuY29sb3IgPT09IENvbG9yLldISVRFID8gJ3doaXRlJyA6ICdibGFjaycsXG4gICAgICAgICAgICAhIWRlc3RQaWVjZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuYWRkTW92ZSh0aGlzLmhpc3RvcnlNb3ZlQ2FuZGlkYXRlKTtcblxuICAgICAgICBpZiAodG9Nb3ZlUGllY2UgaW5zdGFuY2VvZiBLaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzTW92ZWQgPSBNYXRoLmFicyhuZXdQb2ludC5jb2wgLSB0b01vdmVQaWVjZS5wb2ludC5jb2wpO1xuICAgICAgICAgICAgaWYgKHNxdWFyZXNNb3ZlZCA+IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3UG9pbnQuY29sIDwgMykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZnJlZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyAyIDogMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgN1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZnJlZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Um9vay5wb2ludC5jb2wgPSB0aGlzLmJvYXJkLnJldmVydGVkID8gNCA6IDU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9Nb3ZlUGllY2UgaW5zdGFuY2VvZiBQYXduKSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSWZQYXduVGFrZXNFblBhc3NhbnQobmV3UG9pbnQpO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5jaGVja0lmUGF3bkVucGFzc2FudGVkKHRvTW92ZVBpZWNlLCBuZXdQb2ludCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBvaW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuZW5QYXNzYW50UGllY2UgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQgPSBuZXdQb2ludDtcbiAgICAgICAgdGhpcy5pbmNyZWFzZUZ1bGxNb3ZlQ291bnQoKTtcbiAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSAhdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXI7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrRm9yUGF3blByb21vdGUodG9Nb3ZlUGllY2UsIHByb21vdGlvbkluZGV4KSkge1xuICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0ZvclBhd25Qcm9tb3RlKHRvUHJvbW90ZVBpZWNlOiBQaWVjZSwgcHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCEodG9Qcm9tb3RlUGllY2UgaW5zdGFuY2VvZiBQYXduKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRvUHJvbW90ZVBpZWNlLnBvaW50LnJvdyA9PT0gMCB8fCB0b1Byb21vdGVQaWVjZS5wb2ludC5yb3cgPT09IDcpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT4gcGllY2UgIT09IHRvUHJvbW90ZVBpZWNlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBXaGVuIHdlIG1ha2UgbW92ZSBtYW51YWxseSwgd2UgcGFzcyBwcm9tb3Rpb24gaW5kZXggYWxyZWFkeSwgc28gd2UgZG9uJ3QgbmVlZFxuICAgICAgICAgICAgLy8gdG8gYWNxdWlyZSBpdCBmcm9tIHByb21vdGUgZGlhbG9nXG4gICAgICAgICAgICBpZiAoIXByb21vdGlvbkluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUHJvbW90ZURpYWxvZyh0b1Byb21vdGVQaWVjZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFBpZWNlUHJvbW90aW9uUmVzb2x2ZXIucmVzb2x2ZVByb21vdGlvbkNob2ljZShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZCxcbiAgICAgICAgICAgICAgICAgICAgdG9Qcm9tb3RlUGllY2UsXG4gICAgICAgICAgICAgICAgICAgIHByb21vdGlvbkluZGV4XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jaGVja0lmUGF3bkZpcnN0TW92ZSh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlKTtcbiAgICAgICAgdGhpcy5jaGVja0lmUm9va01vdmVkKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UpO1xuICAgICAgICB0aGlzLmNoZWNrSWZLaW5nTW92ZWQodGhpcy5ib2FyZC5hY3RpdmVQaWVjZSk7XG5cbiAgICAgICAgdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkID0gdGhpcy5ib2FyZC5pc0tpbmdJbkNoZWNrKFxuICAgICAgICAgICAgQ29sb3IuQkxBQ0ssXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQgPSB0aGlzLmJvYXJkLmlzS2luZ0luQ2hlY2soXG4gICAgICAgICAgICBDb2xvci5XSElURSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNoZWNrID1cbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCB8fCB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQ7XG4gICAgICAgIGNvbnN0IGNoZWNrbWF0ZSA9XG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3ZlcyhDb2xvci5CTEFDSykgfHxcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLldISVRFKTtcbiAgICAgICAgY29uc3Qgc3RhbGVtYXRlID1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQYXQoQ29sb3IuQkxBQ0spIHx8IHRoaXMuY2hlY2tGb3JQYXQoQ29sb3IuV0hJVEUpO1xuXG4gICAgICAgIHRoaXMuaGlzdG9yeU1vdmVDYW5kaWRhdGUuc2V0R2FtZVN0YXRlcyhjaGVjaywgc3RhbGVtYXRlLCBjaGVja21hdGUpO1xuICAgICAgICB0aGlzLnBnblByb2Nlc3Nvci5wcm9jZXNzQ2hlY2tzKGNoZWNrbWF0ZSwgY2hlY2ssIHN0YWxlbWF0ZSk7XG4gICAgICAgIHRoaXMucGduUHJvY2Vzc29yLmFkZFByb21vdGlvbkNob2ljZShwcm9tb3Rpb25JbmRleCk7XG5cbiAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcblxuICAgICAgICBjb25zdCBsYXN0TW92ZSA9IHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5nZXRMYXN0TW92ZSgpO1xuICAgICAgICBpZiAobGFzdE1vdmUgJiYgcHJvbW90aW9uSW5kZXgpIHtcbiAgICAgICAgICAgIGxhc3RNb3ZlLm1vdmUgKz0gcHJvbW90aW9uSW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vdmVDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAuLi5sYXN0TW92ZSxcbiAgICAgICAgICAgIGNoZWNrLFxuICAgICAgICAgICAgY2hlY2ttYXRlLFxuICAgICAgICAgICAgc3RhbGVtYXRlLFxuICAgICAgICAgICAgZmVuOiB0aGlzLmJvYXJkLmZlbixcbiAgICAgICAgICAgIHBnbjoge1xuICAgICAgICAgICAgICAgIHBnbjogdGhpcy5wZ25Qcm9jZXNzb3IuZ2V0UEdOKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmcmVlTW9kZTogdGhpcy5mcmVlTW9kZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmVEb25lID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjaGVja0ZvclBhdChjb2xvcjogQ29sb3IpIHtcbiAgICAgICAgaWYgKGNvbG9yID09PSBDb2xvci5XSElURSAmJiAhdGhpcy5ib2FyZC53aGl0ZUtpbmdDaGVja2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoY29sb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbG9yID09PSBDb2xvci5CTEFDSyAmJiAhdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5Qcm9tb3RlRGlhbG9nKHBpZWNlOiBQaWVjZSkge1xuICAgICAgICBpZiAocGllY2UuY29sb3IgPT09IHRoaXMuYm9hcmQuYWN0aXZlUGllY2UuY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWwub3BlbigoaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBQaWVjZVByb21vdGlvblJlc29sdmVyLnJlc29sdmVQcm9tb3Rpb25DaG9pY2UoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQsXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlLFxuICAgICAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yOiBDb2xvcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuYm9hcmQucGllY2VzXG4gICAgICAgICAgICAuZmlsdGVyKChwaWVjZSkgPT4gcGllY2UuY29sb3IgPT09IGNvbG9yKVxuICAgICAgICAgICAgLnNvbWUoXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PlxuICAgICAgICAgICAgICAgICAgICBwaWVjZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldFBvc3NpYmxlTW92ZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1vdmUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFNb3ZlVXRpbHMud2lsbE1vdmVDYXVzZUNoZWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlLnJvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmUuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApIHx8XG4gICAgICAgICAgICAgICAgICAgIHBpZWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0UG9zc2libGVDYXB0dXJlcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2FwdHVyZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIU1vdmVVdGlscy53aWxsTW92ZUNhdXNlQ2hlY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LmNvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgZGlzYWJsZVNlbGVjdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgPSBudWxsO1xuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgbG9naWMgdG8gYWxsb3cgZnJlZU1vZGUgYmFzZWQgbG9naWMgcHJvY2Vzc2luZ1xuICAgICAqL1xuICAgIG9uRnJlZU1vZGUocGllY2VDbGlja2VkKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmZyZWVNb2RlIHx8XG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgcGllY2VDbGlja2VkID09PSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldHMgcGxheWVyIGFzIHdoaXRlIGluLWNhc2Ugd2hpdGUgcGllY2VzIGFyZSBzZWxlY3RlZCwgYW5kIHZpY2UtdmVyc2Egd2hlbiBibGFjayBpcyBzZWxlY3RlZFxuICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA9IHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEU7XG4gICAgfVxuXG4gICAgaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZDogUGllY2UpIHtcbiAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCAmJiBwaWVjZUNsaWNrZWQucG9pbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kQ2FwdHVyZSA9IHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcy5maW5kKFxuICAgICAgICAgICAgICAgIChjYXB0dXJlKSA9PlxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLmNvbCA9PT0gcGllY2VDbGlja2VkLnBvaW50LmNvbCAmJlxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyA9PT0gcGllY2VDbGlja2VkLnBvaW50LnJvd1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kQ2FwdHVyZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgcGllY2VDbGlja2VkICYmXG4gICAgICAgICAgICAoKHRoaXMubGlnaHREaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLmRhcmtEaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLkJMQUNLKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhZGREcmF3UG9pbnQoXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyLFxuICAgICAgICBjcnRsOiBib29sZWFuLFxuICAgICAgICBhbHQ6IGJvb2xlYW4sXG4gICAgICAgIHNoaWZ0OiBib29sZWFuLFxuICAgICAgICBsZWZ0OiBudW1iZXIsXG4gICAgICAgIHRvcDogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IHVwUG9pbnQgPSBDbGlja1V0aWxzLmdldERyYXdpbmdQb2ludChcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0QW5kV2lkdGgsXG4gICAgICAgICAgICB0aGlzLmNvbG9yU3RyYXRlZ3ksXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIGNydGwsXG4gICAgICAgICAgICBhbHQsXG4gICAgICAgICAgICBzaGlmdCxcbiAgICAgICAgICAgIGxlZnQsXG4gICAgICAgICAgICB0b3BcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5kcmF3UG9pbnQuaXNFcXVhbCh1cFBvaW50KSkge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gbmV3IENpcmNsZSgpO1xuICAgICAgICAgICAgY2lyY2xlLmRyYXdQb2ludCA9IHVwUG9pbnQ7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhd1Byb3ZpZGVyLmNvbnRhaW5zQ2lyY2xlKGNpcmNsZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRDaXJjbGUoY2lyY2xlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIucmVvbXZlQ2lyY2xlKGNpcmNsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhcnJvdyA9IG5ldyBBcnJvdygpO1xuICAgICAgICAgICAgYXJyb3cuc3RhcnQgPSB0aGlzLmRyYXdQb2ludDtcbiAgICAgICAgICAgIGFycm93LmVuZCA9IHVwUG9pbnQ7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmF3UHJvdmlkZXIuY29udGFpbnNBcnJvdyhhcnJvdykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRBcnJvdyhhcnJvdyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlbW92ZUFycm93KGFycm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluY3JlYXNlRnVsbE1vdmVDb3VudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcikge1xuICAgICAgICAgICAgKyt0aGlzLmJvYXJkLmZ1bGxNb3ZlQ291bnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRQaWVjZShcbiAgICAgICAgcGllY2VUeXBlSW5wdXQ6IFBpZWNlVHlwZUlucHV0LFxuICAgICAgICBjb2xvcklucHV0OiBDb2xvcklucHV0LFxuICAgICAgICBjb29yZHM6IHN0cmluZ1xuICAgICkge1xuICAgICAgICBpZiAodGhpcy5mcmVlTW9kZSAmJiBjb29yZHMgJiYgcGllY2VUeXBlSW5wdXQgPiAwICYmIGNvbG9ySW5wdXQgPiAwKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXhlcyA9IE1vdmVVdGlscy50cmFuc2xhdGVDb29yZHNUb0luZGV4KFxuICAgICAgICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnJldmVydGVkXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXG4gICAgICAgICAgICAgICAgaW5kZXhlcy55QXhpcyxcbiAgICAgICAgICAgICAgICBpbmRleGVzLnhBeGlzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoZSA9PiBlICE9PSBleGlzdGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY3JlYXRlZFBpZWNlID0gUGllY2VGYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICAgICBpbmRleGVzLFxuICAgICAgICAgICAgICAgIHBpZWNlVHlwZUlucHV0LFxuICAgICAgICAgICAgICAgIGNvbG9ySW5wdXQsXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZUNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcy5wdXNoKGNyZWF0ZWRQaWVjZSk7XG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==