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
import { DefaultPgnProcessor } from './pgn/default-pgn-processor';
import { AvailableMoveDecorator } from './piece-decorator/available-move-decorator';
import { PiecePromotionResolver } from '../piece-promotion/piece-promotion-resolver';
import { MoveUtils } from '../utils/move-utils';
import { PieceFactory } from './utils/piece-factory';
export class EngineFacade extends AbstractEngineFacade {
    constructor(board, moveChange) {
        super(board);
        this._selected = false;
        this.disabling = false;
        this.pgnProcessor = new DefaultPgnProcessor();
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
        this.freeMode = false;
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
        if ((this.board.isPointInPossibleMoves(pointClicked) ||
            this.board.isPointInPossibleCaptures(pointClicked)) || this.freeMode) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLWZhY2FkZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvZW5naW5lL2VuZ2luZS1mYWNhZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXBFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUMvRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seURBQXlELENBQUM7QUFFN0YsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFJdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVo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WSxDQUFDLE1BQU0sQ0FDbEMsT0FBTyxFQUNQLGNBQWMsRUFDZCxVQUFVLEVBQ1YsSUFBSSxDQUFDLEtBQUssQ0FDYixDQUFDO1lBQ0YsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIaXN0b3J5TW92ZSB9IGZyb20gJy4uL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUnO1xyXG5pbXBvcnQgeyBDb2xvcklucHV0LCBQaWVjZVR5cGVJbnB1dCB9IGZyb20gJy4uL3V0aWxzL2lucHV0cy9waWVjZS10eXBlLWlucHV0JztcclxuaW1wb3J0IHsgQWJzdHJhY3RFbmdpbmVGYWNhZGUgfSBmcm9tICcuL2Fic3RyYWN0LWVuZ2luZS1mYWNhZGUnO1xyXG5cclxuaW1wb3J0IHsgQm9hcmRMb2FkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLWxvYWRlci9ib2FyZC1sb2FkZXInO1xyXG5pbXBvcnQgeyBCb2FyZFN0YXRlIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1zdGF0ZS9ib2FyZC1zdGF0ZSc7XHJcbmltcG9ydCB7IEJvYXJkU3RhdGVQcm92aWRlciB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtc3RhdGUvYm9hcmQtc3RhdGUtcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBNb3ZlU3RhdGVQcm92aWRlciB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtc3RhdGUvbW92ZS1zdGF0ZS1wcm92aWRlcic7XHJcbmltcG9ydCB7IENsaWNrVXRpbHMgfSBmcm9tICcuL2NsaWNrL2NsaWNrLXV0aWxzJztcclxuaW1wb3J0IHsgQXJyb3cgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvc2hhcGVzL2Fycm93JztcclxuaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL3NoYXBlcy9jaXJjbGUnO1xyXG5pbXBvcnQgeyBEcmF3UG9pbnQgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvZHJhdy1wb2ludCc7XHJcbmltcG9ydCB7IERyYXdQcm92aWRlciB9IGZyb20gJy4vZHJhd2luZy10b29scy9kcmF3LXByb3ZpZGVyJztcclxuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuLi9tb2RlbHMvYm9hcmQnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvY29sb3InO1xyXG5pbXBvcnQgeyBLaW5nIH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9raW5nJztcclxuaW1wb3J0IHsgUGF3biB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcGF3bic7XHJcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9waWVjZSc7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9wb2ludCc7XHJcbmltcG9ydCB7IERlZmF1bHRQZ25Qcm9jZXNzb3IgfSBmcm9tICcuL3Bnbi9kZWZhdWx0LXBnbi1wcm9jZXNzb3InO1xyXG5pbXBvcnQgeyBBdmFpbGFibGVNb3ZlRGVjb3JhdG9yIH0gZnJvbSAnLi9waWVjZS1kZWNvcmF0b3IvYXZhaWxhYmxlLW1vdmUtZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25SZXNvbHZlciB9IGZyb20gJy4uL3BpZWNlLXByb21vdGlvbi9waWVjZS1wcm9tb3Rpb24tcmVzb2x2ZXInO1xyXG5pbXBvcnQgeyBNb3ZlVXRpbHMgfSBmcm9tICcuLi91dGlscy9tb3ZlLXV0aWxzJztcclxuaW1wb3J0IHsgTW92ZUNoYW5nZSB9IGZyb20gJy4vbW92ZS1jaGFuZ2UvbW92ZS1jaGFuZ2UnO1xyXG5pbXBvcnQgeyBQaWVjZUZhY3RvcnkgfSBmcm9tICcuL3V0aWxzL3BpZWNlLWZhY3RvcnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuZ2luZUZhY2FkZSBleHRlbmRzIEFic3RyYWN0RW5naW5lRmFjYWRlIHtcclxuXHJcbiAgICBfc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgIGRyYXdQb2ludDogRHJhd1BvaW50O1xyXG4gICAgZHJhd1Byb3ZpZGVyOiBEcmF3UHJvdmlkZXI7XHJcbiAgICBkaXNhYmxpbmcgPSBmYWxzZTtcclxuICAgIGJvYXJkU3RhdGVQcm92aWRlcjogQm9hcmRTdGF0ZVByb3ZpZGVyO1xyXG4gICAgbW92ZVN0YXRlUHJvdmlkZXI6IE1vdmVTdGF0ZVByb3ZpZGVyO1xyXG4gICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+O1xyXG4gICAgcGduUHJvY2Vzc29yOiBEZWZhdWx0UGduUHJvY2Vzc29yID0gbmV3IERlZmF1bHRQZ25Qcm9jZXNzb3IoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBib2FyZDogQm9hcmQsXHJcbiAgICAgICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihib2FyZCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlQ2hhbmdlID0gbW92ZUNoYW5nZTtcclxuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyID0gbmV3IEJvYXJkTG9hZGVyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuYWRkUGllY2VzKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIgPSBuZXcgQm9hcmRTdGF0ZVByb3ZpZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcclxuICAgICAgICB0aGlzLmJvYXJkLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5jb29yZHMucmVzZXQoKTtcclxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuZnJlZU1vZGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kbygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0Qm9hcmQgPSB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5wb3AoKS5ib2FyZDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RCb2FyZC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ib2FyZCA9IGxhc3RCb2FyZDtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNhdmVNb3ZlQ2xvbmUoKSB7XHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLmJvYXJkLmNsb25lKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJvYXJkLnJldmVydGVkKSB7XHJcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tb3ZlU3RhdGVQcm92aWRlci5hZGRNb3ZlKG5ldyBCb2FyZFN0YXRlKGNsb25lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1vdmUoY29vcmRzOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoY29vcmRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcclxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMCwgMiksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnJldmVydGVkXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkZXN0SW5kZXhlcyA9IE1vdmVVdGlscy50cmFuc2xhdGVDb29yZHNUb0luZGV4KFxyXG4gICAgICAgICAgICAgICAgY29vcmRzLnN1YnN0cmluZygyLCA0KSxcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucmV2ZXJ0ZWRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNyY1BpZWNlID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXHJcbiAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnlBeGlzLFxyXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNyY1BpZWNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BpZWNlLmNvbG9yID09PSBDb2xvci5CTEFDSykgfHxcclxuICAgICAgICAgICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BpZWNlLmNvbG9yID09PSBDb2xvci5XSElURSlcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVBY3RpdmVQaWVjZShzcmNQaWVjZSwgc3JjUGllY2UucG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpXHJcbiAgICAgICAgICAgICAgICAgICAgKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuaXNQb2ludEluUG9zc2libGVDYXB0dXJlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGRlc3RJbmRleGVzLnlBeGlzLCBkZXN0SW5kZXhlcy54QXhpcylcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVBpZWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGRlc3RJbmRleGVzLnlBeGlzLCBkZXN0SW5kZXhlcy54QXhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3Jkcy5sZW5ndGggPT09IDUgPyArY29vcmRzLnN1YnN0cmluZyg0LCA1KSA6IDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlU3JjID0gbmV3IFBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnlBeGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnhBeGlzXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlRGVzdCA9IG5ldyBQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEluZGV4ZXMueUF4aXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RJbmRleGVzLnhBeGlzXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlQWN0aXZlUGllY2UocGllY2VDbGlja2VkOiBQaWVjZSwgcG9pbnRDbGlja2VkOiBQb2ludCkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgPSBwaWVjZUNsaWNrZWQ7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IG5ldyBBdmFpbGFibGVNb3ZlRGVjb3JhdG9yKFxyXG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQsXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZCxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPyBDb2xvci5XSElURSA6IENvbG9yLkJMQUNLLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkXHJcbiAgICAgICAgKS5nZXRQb3NzaWJsZUNhcHR1cmVzKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZU1vdmVzID0gbmV3IEF2YWlsYWJsZU1vdmVEZWNvcmF0b3IoXHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCxcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciA/IENvbG9yLldISVRFIDogQ29sb3IuQkxBQ0ssXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICApLmdldFBvc3NpYmxlTW92ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblBpZWNlQ2xpY2tlZChwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCkge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgKHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XHJcbiAgICAgICAgICAgICghdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5XSElURSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcmVwYXJlQWN0aXZlUGllY2UocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZDogUG9pbnQsIGlzTW91c2VEb3duOiBib29sZWFuKSB7XHJcbiAgICAgICAgbGV0IG1vdmluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoKFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMocG9pbnRDbGlja2VkKSB8fFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlQ2FwdHVyZXMocG9pbnRDbGlja2VkKVxyXG4gICAgICAgICkgfHwgdGhpcy5mcmVlTW9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlU3JjID0gbmV3IFBvaW50KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmNvbFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlRGVzdCA9IHBvaW50Q2xpY2tlZC5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVQaWVjZSh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLCBwb2ludENsaWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmlzRXF1YWwodGhpcy5ib2FyZC5sYXN0TW92ZVNyYykpIHtcclxuICAgICAgICAgICAgICAgIG1vdmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdXNlRG93biB8fCBtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAocGllY2VDbGlja2VkICYmICFtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgIHRoaXMub25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bihcclxuICAgICAgICBldmVudDogTW91c2VFdmVudCxcclxuICAgICAgICBwb2ludENsaWNrZWQ6IFBvaW50LFxyXG4gICAgICAgIGxlZnQ/OiBudW1iZXIsXHJcbiAgICAgICAgdG9wPzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvaW50ID0gQ2xpY2tVdGlscy5nZXREcmF3aW5nUG9pbnQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodEFuZFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvclN0cmF0ZWd5LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQueCxcclxuICAgICAgICAgICAgICAgIGV2ZW50LnksXHJcbiAgICAgICAgICAgICAgICBldmVudC5jdHJsS2V5LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuYWx0S2V5LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuc2hpZnRLZXksXHJcbiAgICAgICAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgICAgICAgICAgdG9wXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSAmJlxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuaXNFcXVhbCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50KVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZnJlZU1vZGUpIHtcclxuICAgICAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcyA9IHRoaXMuYm9hcmQucGllY2VzLmZpbHRlcihlID0+IGUgIT09IHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSAocGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzUGllY2VEaXNhYmxlZChwaWVjZUNsaWNrZWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrRXZlbnQocG9pbnRDbGlja2VkLCB0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocGllY2VDbGlja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRnJlZU1vZGUocGllY2VDbGlja2VkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcChcclxuICAgICAgICBldmVudDogTW91c2VFdmVudCxcclxuICAgICAgICBwb2ludENsaWNrZWQ6IFBvaW50LFxyXG4gICAgICAgIGxlZnQ6IG51bWJlcixcclxuICAgICAgICB0b3A6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCAmJiAhdGhpcy5kcmF3RGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGREcmF3UG9pbnQoXHJcbiAgICAgICAgICAgICAgICBldmVudC54LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQueSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LmN0cmxLZXksXHJcbiAgICAgICAgICAgICAgICBldmVudC5hbHRLZXksXHJcbiAgICAgICAgICAgICAgICBldmVudC5zaGlmdEtleSxcclxuICAgICAgICAgICAgICAgIGxlZnQsIHRvcFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kcmFnRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlICYmXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5pc0VxdWFsKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQpICYmXHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQaWVjZURpc2FibGVkKHBpZWNlQ2xpY2tlZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2tFdmVudChwb2ludENsaWNrZWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gICB0aGlzLnBvc3NpYmxlTW92ZXMgPSBhY3RpdmVQaWVjZS5nZXRQb3NzaWJsZU1vdmVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNhdmVDbG9uZSgpIHtcclxuICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuYm9hcmQuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcclxuICAgICAgICAgICAgY2xvbmUucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5hZGRNb3ZlKG5ldyBCb2FyZFN0YXRlKGNsb25lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVBpZWNlKHRvTW92ZVBpZWNlOiBQaWVjZSwgbmV3UG9pbnQ6IFBvaW50LCBwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGRlc3RQaWVjZSA9IHRoaXMuYm9hcmQucGllY2VzLmZpbmQoXHJcbiAgICAgICAgICAgIChwaWVjZSkgPT5cclxuICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LmNvbCA9PT0gbmV3UG9pbnQuY29sICYmXHJcbiAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3cgPT09IG5ld1BvaW50LnJvd1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMucGduUHJvY2Vzc29yLnByb2Nlc3MoXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQsXHJcbiAgICAgICAgICAgIHRvTW92ZVBpZWNlLFxyXG4gICAgICAgICAgICBuZXdQb2ludCxcclxuICAgICAgICAgICAgZGVzdFBpZWNlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKGRlc3RQaWVjZSAmJiB0b01vdmVQaWVjZS5jb2xvciAhPT0gZGVzdFBpZWNlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxyXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PiBwaWVjZSAhPT0gZGVzdFBpZWNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRlc3RQaWVjZSAmJiB0b01vdmVQaWVjZS5jb2xvciA9PT0gZGVzdFBpZWNlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1vdmUgPSBuZXcgSGlzdG9yeU1vdmUoXHJcbiAgICAgICAgICAgIE1vdmVVdGlscy5mb3JtYXQodG9Nb3ZlUGllY2UucG9pbnQsIG5ld1BvaW50LCB0aGlzLmJvYXJkLnJldmVydGVkKSxcclxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UuY29uc3RhbnQubmFtZSxcclxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UuY29sb3IgPT09IENvbG9yLldISVRFID8gJ3doaXRlJyA6ICdibGFjaycsXHJcbiAgICAgICAgICAgICEhZGVzdFBpZWNlXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuYWRkTW92ZShtb3ZlKTtcclxuXHJcbiAgICAgICAgaWYgKHRvTW92ZVBpZWNlIGluc3RhbmNlb2YgS2luZykge1xyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzTW92ZWQgPSBNYXRoLmFicyhuZXdQb2ludC5jb2wgLSB0b01vdmVQaWVjZS5wb2ludC5jb2wpO1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlc01vdmVkID4gMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1BvaW50LmNvbCA8IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b01vdmVQaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5mcmVlTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Um9vay5wb2ludC5jb2wgPSB0aGlzLmJvYXJkLnJldmVydGVkID8gMiA6IDM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodFJvb2sgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlGaWVsZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQucm93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA3XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZnJlZU1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyA0IDogNTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b01vdmVQaWVjZSBpbnN0YW5jZW9mIFBhd24pIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jaGVja0lmUGF3blRha2VzRW5QYXNzYW50KG5ld1BvaW50KTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jaGVja0lmUGF3bkVucGFzc2FudGVkKHRvTW92ZVBpZWNlLCBuZXdQb2ludCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuZW5QYXNzYW50UGllY2UgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQgPSBuZXdQb2ludDtcclxuICAgICAgICB0aGlzLmluY3JlYXNlRnVsbE1vdmVDb3VudCgpO1xyXG4gICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY2hlY2tGb3JQYXduUHJvbW90ZSh0b01vdmVQaWVjZSwgcHJvbW90aW9uSW5kZXgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJNb3ZlQWN0aW9ucygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVja0ZvclBhd25Qcm9tb3RlKHRvUHJvbW90ZVBpZWNlOiBQaWVjZSwgcHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoISh0b1Byb21vdGVQaWVjZSBpbnN0YW5jZW9mIFBhd24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b1Byb21vdGVQaWVjZS5wb2ludC5yb3cgPT09IDAgfHwgdG9Qcm9tb3RlUGllY2UucG9pbnQucm93ID09PSA3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxyXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PiBwaWVjZSAhPT0gdG9Qcm9tb3RlUGllY2VcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgbWFrZSBtb3ZlIG1hbnVhbGx5LCB3ZSBwYXNzIHByb21vdGlvbiBpbmRleCBhbHJlYWR5LCBzbyB3ZSBkb24ndCBuZWVkXHJcbiAgICAgICAgICAgIC8vIHRvIGFjcXVpcmUgaXQgZnJvbSBwcm9tb3RlIGRpYWxvZ1xyXG4gICAgICAgICAgICBpZiAoIXByb21vdGlvbkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Qcm9tb3RlRGlhbG9nKHRvUHJvbW90ZVBpZWNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFBpZWNlUHJvbW90aW9uUmVzb2x2ZXIucmVzb2x2ZVByb21vdGlvbkNob2ljZShcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvUHJvbW90ZVBpZWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb21vdGlvbkluZGV4XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKHByb21vdGlvbkluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNoZWNrSWZQYXduRmlyc3RNb3ZlKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tJZlJvb2tNb3ZlZCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlKTtcclxuICAgICAgICB0aGlzLmNoZWNrSWZLaW5nTW92ZWQodGhpcy5ib2FyZC5hY3RpdmVQaWVjZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCA9IHRoaXMuYm9hcmQuaXNLaW5nSW5DaGVjayhcclxuICAgICAgICAgICAgQ29sb3IuQkxBQ0ssXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQgPSB0aGlzLmJvYXJkLmlzS2luZ0luQ2hlY2soXHJcbiAgICAgICAgICAgIENvbG9yLldISVRFLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgY2hlY2sgPVxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQgfHwgdGhpcy5ib2FyZC53aGl0ZUtpbmdDaGVja2VkO1xyXG4gICAgICAgIGNvbnN0IGNoZWNrbWF0ZSA9XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLkJMQUNLKSB8fFxyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3ZlcyhDb2xvci5XSElURSk7XHJcbiAgICAgICAgY29uc3Qgc3RhbGVtYXRlID1cclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBhdChDb2xvci5CTEFDSykgfHwgdGhpcy5jaGVja0ZvclBhdChDb2xvci5XSElURSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzYWJsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFzdE1vdmUgPSB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0TGFzdE1vdmUoKTtcclxuICAgICAgICBpZiAobGFzdE1vdmUgJiYgcHJvbW90aW9uSW5kZXgpIHtcclxuICAgICAgICAgICAgbGFzdE1vdmUubW92ZSArPSBwcm9tb3Rpb25JbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubW92ZUNoYW5nZS5lbWl0KHtcclxuICAgICAgICAgICAgLi4ubGFzdE1vdmUsXHJcbiAgICAgICAgICAgIGNoZWNrLFxyXG4gICAgICAgICAgICBjaGVja21hdGUsXHJcbiAgICAgICAgICAgIHN0YWxlbWF0ZSxcclxuICAgICAgICAgICAgZmVuOiB0aGlzLmJvYXJkLmZlbixcclxuICAgICAgICAgICAgZnJlZU1vZGU6IHRoaXMuZnJlZU1vZGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0ZvclBhdChjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLldISVRFICYmICF0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLkJMQUNLICYmICF0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3BlblByb21vdGVEaWFsb2cocGllY2U6IFBpZWNlKSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5vcGVuKChpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBQaWVjZVByb21vdGlvblJlc29sdmVyLnJlc29sdmVQcm9tb3Rpb25DaG9pY2UoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgcGllY2UsXHJcbiAgICAgICAgICAgICAgICBpbmRleFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoaW5kZXgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcjogQ29sb3IpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuYm9hcmQucGllY2VzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKHBpZWNlKSA9PiBwaWVjZS5jb2xvciA9PT0gY29sb3IpXHJcbiAgICAgICAgICAgIC5zb21lKFxyXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRQb3NzaWJsZU1vdmVzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobW92ZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhTW92ZVV0aWxzLndpbGxNb3ZlQ2F1c2VDaGVjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlLnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92ZS5jb2wsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgfHxcclxuICAgICAgICAgICAgICAgICAgICBwaWVjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0UG9zc2libGVDYXB0dXJlcygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNhcHR1cmUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIU1vdmVVdGlscy53aWxsTW92ZUNhdXNlQ2hlY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LmNvbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUuY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZVNlbGVjdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvY2Vzc2VzIGxvZ2ljIHRvIGFsbG93IGZyZWVNb2RlIGJhc2VkIGxvZ2ljIHByb2Nlc3NpbmdcclxuICAgICAqL1xyXG4gICAgb25GcmVlTW9kZShwaWVjZUNsaWNrZWQpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICF0aGlzLmZyZWVNb2RlIHx8XHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCA9PT0gbnVsbFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldHMgcGxheWVyIGFzIHdoaXRlIGluLWNhc2Ugd2hpdGUgcGllY2VzIGFyZSBzZWxlY3RlZCwgYW5kIHZpY2UtdmVyc2Egd2hlbiBibGFjayBpcyBzZWxlY3RlZFxyXG4gICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5XSElURTtcclxuICAgIH1cclxuXHJcbiAgICBpc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkOiBQaWVjZSkge1xyXG4gICAgICAgIGlmIChwaWVjZUNsaWNrZWQgJiYgcGllY2VDbGlja2VkLnBvaW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kQ2FwdHVyZSA9IHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcy5maW5kKFxyXG4gICAgICAgICAgICAgICAgKGNhcHR1cmUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5jb2wgPT09IHBpZWNlQ2xpY2tlZC5wb2ludC5jb2wgJiZcclxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyA9PT0gcGllY2VDbGlja2VkLnBvaW50LnJvd1xyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZvdW5kQ2FwdHVyZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCAmJlxyXG4gICAgICAgICAgICAoKHRoaXMubGlnaHREaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuZGFya0Rpc2FibGVkICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuQkxBQ0spKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRHJhd1BvaW50KFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgY3J0bDogYm9vbGVhbixcclxuICAgICAgICBhbHQ6IGJvb2xlYW4sXHJcbiAgICAgICAgc2hpZnQ6IGJvb2xlYW4sXHJcbiAgICAgICAgbGVmdDogbnVtYmVyLFxyXG4gICAgICAgIHRvcDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB1cFBvaW50ID0gQ2xpY2tVdGlscy5nZXREcmF3aW5nUG9pbnQoXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0QW5kV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JTdHJhdGVneSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgY3J0bCxcclxuICAgICAgICAgICAgYWx0LFxyXG4gICAgICAgICAgICBzaGlmdCxcclxuICAgICAgICAgICAgbGVmdCxcclxuICAgICAgICAgICAgdG9wXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZHJhd1BvaW50LmlzRXF1YWwodXBQb2ludCkpIHtcclxuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gbmV3IENpcmNsZSgpO1xyXG4gICAgICAgICAgICBjaXJjbGUuZHJhd1BvaW50ID0gdXBQb2ludDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYXdQcm92aWRlci5jb250YWluc0NpcmNsZShjaXJjbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRDaXJjbGUoY2lyY2xlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlb212ZUNpcmNsZShjaXJjbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyb3cgPSBuZXcgQXJyb3coKTtcclxuICAgICAgICAgICAgYXJyb3cuc3RhcnQgPSB0aGlzLmRyYXdQb2ludDtcclxuICAgICAgICAgICAgYXJyb3cuZW5kID0gdXBQb2ludDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kcmF3UHJvdmlkZXIuY29udGFpbnNBcnJvdyhhcnJvdykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmFkZEFycm93KGFycm93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlbW92ZUFycm93KGFycm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbmNyZWFzZUZ1bGxNb3ZlQ291bnQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcikge1xyXG4gICAgICAgICAgICArK3RoaXMuYm9hcmQuZnVsbE1vdmVDb3VudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGllY2UoXHJcbiAgICAgICAgcGllY2VUeXBlSW5wdXQ6IFBpZWNlVHlwZUlucHV0LFxyXG4gICAgICAgIGNvbG9ySW5wdXQ6IENvbG9ySW5wdXQsXHJcbiAgICAgICAgY29vcmRzOiBzdHJpbmdcclxuICAgICkge1xyXG4gICAgICAgIGlmICh0aGlzLmZyZWVNb2RlICYmIGNvb3JkcyAmJiBwaWVjZVR5cGVJbnB1dCA+IDAgJiYgY29sb3JJbnB1dCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcclxuICAgICAgICAgICAgICAgIGNvb3JkcyxcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucmV2ZXJ0ZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbGV0IGV4aXN0aW5nID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXHJcbiAgICAgICAgICAgICAgICBpbmRleGVzLnlBeGlzLFxyXG4gICAgICAgICAgICAgICAgaW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKGUgPT4gZSAhPT0gZXhpc3RpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVkUGllY2UgPSBQaWVjZUZhY3RvcnkuY3JlYXRlKFxyXG4gICAgICAgICAgICAgICAgaW5kZXhlcyxcclxuICAgICAgICAgICAgICAgIHBpZWNlVHlwZUlucHV0LFxyXG4gICAgICAgICAgICAgICAgY29sb3JJbnB1dCxcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMucHVzaChjcmVhdGVkUGllY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19