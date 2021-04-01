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
        this.disabling = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLWZhY2FkZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvZW5naW5lL2VuZ2luZS1mYWNhZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXBFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUMvRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seURBQXlELENBQUM7QUFFN0YsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFJdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVoRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFckQs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QUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSGlzdG9yeU1vdmUgfSBmcm9tICcuLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlJztcbmltcG9ydCB7IENvbG9ySW5wdXQsIFBpZWNlVHlwZUlucHV0IH0gZnJvbSAnLi4vdXRpbHMvaW5wdXRzL3BpZWNlLXR5cGUtaW5wdXQnO1xuaW1wb3J0IHsgQWJzdHJhY3RFbmdpbmVGYWNhZGUgfSBmcm9tICcuL2Fic3RyYWN0LWVuZ2luZS1mYWNhZGUnO1xuXG5pbXBvcnQgeyBCb2FyZExvYWRlciB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtbG9hZGVyL2JvYXJkLWxvYWRlcic7XG5pbXBvcnQgeyBCb2FyZFN0YXRlIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1zdGF0ZS9ib2FyZC1zdGF0ZSc7XG5pbXBvcnQgeyBCb2FyZFN0YXRlUHJvdmlkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlL2JvYXJkLXN0YXRlLXByb3ZpZGVyJztcbmltcG9ydCB7IE1vdmVTdGF0ZVByb3ZpZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1zdGF0ZS9tb3ZlLXN0YXRlLXByb3ZpZGVyJztcbmltcG9ydCB7IENsaWNrVXRpbHMgfSBmcm9tICcuL2NsaWNrL2NsaWNrLXV0aWxzJztcbmltcG9ydCB7IEFycm93IH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL3NoYXBlcy9hcnJvdyc7XG5pbXBvcnQgeyBDaXJjbGUgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvc2hhcGVzL2NpcmNsZSc7XG5pbXBvcnQgeyBEcmF3UG9pbnQgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvZHJhdy1wb2ludCc7XG5pbXBvcnQgeyBEcmF3UHJvdmlkZXIgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvZHJhdy1wcm92aWRlcic7XG5pbXBvcnQgeyBCb2FyZCB9IGZyb20gJy4uL21vZGVscy9ib2FyZCc7XG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvY29sb3InO1xuaW1wb3J0IHsgS2luZyB9IGZyb20gJy4uL21vZGVscy9waWVjZXMva2luZyc7XG5pbXBvcnQgeyBQYXduIH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9wYXduJztcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSAnLi4vbW9kZWxzL3BpZWNlcy9waWVjZSc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcG9pbnQnO1xuaW1wb3J0IHsgQXZhaWxhYmxlTW92ZURlY29yYXRvciB9IGZyb20gJy4vcGllY2UtZGVjb3JhdG9yL2F2YWlsYWJsZS1tb3ZlLWRlY29yYXRvcic7XG5pbXBvcnQgeyBQaWVjZVByb21vdGlvblJlc29sdmVyIH0gZnJvbSAnLi4vcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1yZXNvbHZlcic7XG5pbXBvcnQgeyBNb3ZlVXRpbHMgfSBmcm9tICcuLi91dGlscy9tb3ZlLXV0aWxzJztcbmltcG9ydCB7IE1vdmVDaGFuZ2UgfSBmcm9tICcuL21vdmUtY2hhbmdlL21vdmUtY2hhbmdlJztcbmltcG9ydCB7IFBpZWNlRmFjdG9yeSB9IGZyb20gJy4vdXRpbHMvcGllY2UtZmFjdG9yeSc7XG5cbmV4cG9ydCBjbGFzcyBFbmdpbmVGYWNhZGUgZXh0ZW5kcyBBYnN0cmFjdEVuZ2luZUZhY2FkZSB7XG5cbiAgICBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICBkcmF3UG9pbnQ6IERyYXdQb2ludDtcbiAgICBkcmF3UHJvdmlkZXI6IERyYXdQcm92aWRlcjtcbiAgICBkaXNhYmxpbmcgPSBmYWxzZTtcbiAgICBib2FyZFN0YXRlUHJvdmlkZXI6IEJvYXJkU3RhdGVQcm92aWRlcjtcbiAgICBtb3ZlU3RhdGVQcm92aWRlcjogTW92ZVN0YXRlUHJvdmlkZXI7XG4gICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGJvYXJkOiBCb2FyZCxcbiAgICAgICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+XG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGJvYXJkKTtcbiAgICAgICAgdGhpcy5tb3ZlQ2hhbmdlID0gbW92ZUNoYW5nZTtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlciA9IG5ldyBCb2FyZExvYWRlcih0aGlzKTtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIgPSBuZXcgQm9hcmRTdGF0ZVByb3ZpZGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcbiAgICAgICAgdGhpcy5ib2FyZC5yZXNldCgpO1xuICAgICAgICB0aGlzLmNvb3Jkcy5yZXNldCgpO1xuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLmZyZWVNb2RlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHVuZG8oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0Qm9hcmQgPSB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5wb3AoKS5ib2FyZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkLnJldmVydGVkKSB7XG4gICAgICAgICAgICAgICAgbGFzdEJvYXJkLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYm9hcmQgPSBsYXN0Qm9hcmQ7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLnBvcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZU1vdmVDbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLmJvYXJkLmNsb25lKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdmVTdGF0ZVByb3ZpZGVyLmFkZE1vdmUobmV3IEJvYXJkU3RhdGUoY2xvbmUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZShjb29yZHM6IHN0cmluZykge1xuICAgICAgICBpZiAoY29vcmRzKSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VJbmRleGVzID0gTW92ZVV0aWxzLnRyYW5zbGF0ZUNvb3Jkc1RvSW5kZXgoXG4gICAgICAgICAgICAgICAgY29vcmRzLnN1YnN0cmluZygwLCAyKSxcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnJldmVydGVkXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBkZXN0SW5kZXhlcyA9IE1vdmVVdGlscy50cmFuc2xhdGVDb29yZHNUb0luZGV4KFxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMiwgNCksXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3Qgc3JjUGllY2UgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlQb2ludChcbiAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnlBeGlzLFxuICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4ZXMueEF4aXNcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChzcmNQaWVjZSkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XG4gICAgICAgICAgICAgICAgICAgICghdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BpZWNlLmNvbG9yID09PSBDb2xvci5XSElURSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucHJlcGFyZUFjdGl2ZVBpZWNlKHNyY1BpZWNlLCBzcmNQaWVjZS5wb2ludCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuaXNQb2ludEluUG9zc2libGVNb3ZlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpXG4gICAgICAgICAgICAgICAgICAgICkgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZUNhcHR1cmVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGRlc3RJbmRleGVzLnlBeGlzLCBkZXN0SW5kZXhlcy54QXhpcylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVQaWVjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BpZWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGRlc3RJbmRleGVzLnlBeGlzLCBkZXN0SW5kZXhlcy54QXhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yZHMubGVuZ3RoID09PSA1ID8gK2Nvb3Jkcy5zdWJzdHJpbmcoNCwgNSkgOiAwXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZVNyYyA9IG5ldyBQb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4ZXMueUF4aXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VJbmRleGVzLnhBeGlzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQubGFzdE1vdmVEZXN0ID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEluZGV4ZXMueUF4aXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0SW5kZXhlcy54QXhpc1xuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJlcGFyZUFjdGl2ZVBpZWNlKHBpZWNlQ2xpY2tlZDogUGllY2UsIHBvaW50Q2xpY2tlZDogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSA9IHBpZWNlQ2xpY2tlZDtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBuZXcgQXZhaWxhYmxlTW92ZURlY29yYXRvcihcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID8gQ29sb3IuV0hJVEUgOiBDb2xvci5CTEFDSyxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgKS5nZXRQb3NzaWJsZUNhcHR1cmVzKCk7XG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IG5ldyBBdmFpbGFibGVNb3ZlRGVjb3JhdG9yKFxuICAgICAgICAgICAgcGllY2VDbGlja2VkLFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPyBDb2xvci5XSElURSA6IENvbG9yLkJMQUNLLFxuICAgICAgICAgICAgdGhpcy5ib2FyZFxuICAgICAgICApLmdldFBvc3NpYmxlTW92ZXMoKTtcbiAgICB9XG5cbiAgICBvblBpZWNlQ2xpY2tlZChwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5CTEFDSykgfHxcbiAgICAgICAgICAgICghdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5XSElURSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByZXBhcmVBY3RpdmVQaWVjZShwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUNsaWNrRXZlbnQocG9pbnRDbGlja2VkOiBQb2ludCwgaXNNb3VzZURvd246IGJvb2xlYW4pIHtcbiAgICAgICAgbGV0IG1vdmluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICgoXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMocG9pbnRDbGlja2VkKSB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZUNhcHR1cmVzKHBvaW50Q2xpY2tlZClcbiAgICAgICAgKSB8fCB0aGlzLmZyZWVNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZVNyYyA9IG5ldyBQb2ludChcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LnJvdyxcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmNvbFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQubGFzdE1vdmVEZXN0ID0gcG9pbnRDbGlja2VkLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLm1vdmVQaWVjZSh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLCBwb2ludENsaWNrZWQpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYm9hcmQuYWN0aXZlUGllY2UucG9pbnQuaXNFcXVhbCh0aGlzLmJvYXJkLmxhc3RNb3ZlU3JjKSkge1xuICAgICAgICAgICAgICAgIG1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNb3VzZURvd24gfHwgbW92aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcbiAgICAgICAgY29uc3QgcGllY2VDbGlja2VkID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmNvbFxuICAgICAgICApO1xuICAgICAgICBpZiAocGllY2VDbGlja2VkICYmICFtb3ZpbmcpIHtcbiAgICAgICAgICAgIHRoaXMub25GcmVlTW9kZShwaWVjZUNsaWNrZWQpO1xuICAgICAgICAgICAgdGhpcy5vblBpZWNlQ2xpY2tlZChwaWVjZUNsaWNrZWQsIHBvaW50Q2xpY2tlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihcbiAgICAgICAgZXZlbnQ6IE1vdXNlRXZlbnQsXG4gICAgICAgIHBvaW50Q2xpY2tlZDogUG9pbnQsXG4gICAgICAgIGxlZnQ/OiBudW1iZXIsXG4gICAgICAgIHRvcD86IG51bWJlclxuICAgICkge1xuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdQb2ludCA9IENsaWNrVXRpbHMuZ2V0RHJhd2luZ1BvaW50KFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0QW5kV2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvclN0cmF0ZWd5LFxuICAgICAgICAgICAgICAgIGV2ZW50LngsXG4gICAgICAgICAgICAgICAgZXZlbnQueSxcbiAgICAgICAgICAgICAgICBldmVudC5jdHJsS2V5LFxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcbiAgICAgICAgICAgICAgICBldmVudC5zaGlmdEtleSxcbiAgICAgICAgICAgICAgICBsZWZ0LFxuICAgICAgICAgICAgICAgIHRvcFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSAmJlxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZyA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwaWVjZUNsaWNrZWQgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlQb2ludChcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRoaXMuZnJlZU1vZGUpIHtcbiAgICAgICAgICAgIGlmIChwaWVjZUNsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcyA9IHRoaXMuYm9hcmQucGllY2VzLmZpbHRlcihlID0+IGUgIT09IHBpZWNlQ2xpY2tlZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSAocGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5XSElURSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrRXZlbnQocG9pbnRDbGlja2VkLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChwaWVjZUNsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRnJlZU1vZGUocGllY2VDbGlja2VkKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGllY2VDbGlja2VkKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VVcChcbiAgICAgICAgZXZlbnQ6IE1vdXNlRXZlbnQsXG4gICAgICAgIHBvaW50Q2xpY2tlZDogUG9pbnQsXG4gICAgICAgIGxlZnQ6IG51bWJlcixcbiAgICAgICAgdG9wOiBudW1iZXJcbiAgICApIHtcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCAmJiAhdGhpcy5kcmF3RGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRHJhd1BvaW50KFxuICAgICAgICAgICAgICAgIGV2ZW50LngsXG4gICAgICAgICAgICAgICAgZXZlbnQueSxcbiAgICAgICAgICAgICAgICBldmVudC5jdHJsS2V5LFxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcbiAgICAgICAgICAgICAgICBldmVudC5zaGlmdEtleSxcbiAgICAgICAgICAgICAgICBsZWZ0LCB0b3BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xuXG4gICAgICAgIGlmICh0aGlzLmRyYWdEaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSAmJlxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludCkgJiZcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLnJvdyxcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5jb2xcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrRXZlbnQocG9pbnRDbGlja2VkLCBmYWxzZSk7XG4gICAgICAgICAgICAvLyAgIHRoaXMucG9zc2libGVNb3ZlcyA9IGFjdGl2ZVBpZWNlLmdldFBvc3NpYmxlTW92ZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVDbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLmJvYXJkLmNsb25lKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYm9hcmQucmV2ZXJ0ZWQpIHtcbiAgICAgICAgICAgIGNsb25lLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5hZGRNb3ZlKG5ldyBCb2FyZFN0YXRlKGNsb25lKSk7XG4gICAgfVxuXG4gICAgbW92ZVBpZWNlKHRvTW92ZVBpZWNlOiBQaWVjZSwgbmV3UG9pbnQ6IFBvaW50LCBwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xuICAgICAgICBjb25zdCBkZXN0UGllY2UgPSB0aGlzLmJvYXJkLnBpZWNlcy5maW5kKFxuICAgICAgICAgICAgKHBpZWNlKSA9PlxuICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LmNvbCA9PT0gbmV3UG9pbnQuY29sICYmXG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQucm93ID09PSBuZXdQb2ludC5yb3dcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZGVzdFBpZWNlICYmIHRvTW92ZVBpZWNlLmNvbG9yICE9PSBkZXN0UGllY2UuY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT4gcGllY2UgIT09IGRlc3RQaWVjZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkZXN0UGllY2UgJiYgdG9Nb3ZlUGllY2UuY29sb3IgPT09IGRlc3RQaWVjZS5jb2xvcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vdmUgPSBuZXcgSGlzdG9yeU1vdmUoXG4gICAgICAgICAgICBNb3ZlVXRpbHMuZm9ybWF0KHRvTW92ZVBpZWNlLnBvaW50LCBuZXdQb2ludCwgdGhpcy5ib2FyZC5yZXZlcnRlZCksXG4gICAgICAgICAgICB0b01vdmVQaWVjZS5jb25zdGFudC5uYW1lLFxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UuY29sb3IgPT09IENvbG9yLldISVRFID8gJ3doaXRlJyA6ICdibGFjaycsXG4gICAgICAgICAgICAhIWRlc3RQaWVjZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuYWRkTW92ZShtb3ZlKTtcblxuICAgICAgICBpZiAodG9Nb3ZlUGllY2UgaW5zdGFuY2VvZiBLaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzTW92ZWQgPSBNYXRoLmFicyhuZXdQb2ludC5jb2wgLSB0b01vdmVQaWVjZS5wb2ludC5jb2wpO1xuICAgICAgICAgICAgaWYgKHNxdWFyZXNNb3ZlZCA+IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3UG9pbnQuY29sIDwgMykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZnJlZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyAyIDogMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgN1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZnJlZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Um9vay5wb2ludC5jb2wgPSB0aGlzLmJvYXJkLnJldmVydGVkID8gNCA6IDU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9Nb3ZlUGllY2UgaW5zdGFuY2VvZiBQYXduKSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSWZQYXduVGFrZXNFblBhc3NhbnQobmV3UG9pbnQpO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5jaGVja0lmUGF3bkVucGFzc2FudGVkKHRvTW92ZVBpZWNlLCBuZXdQb2ludCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBvaW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuZW5QYXNzYW50UGllY2UgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9Nb3ZlUGllY2UucG9pbnQgPSBuZXdQb2ludDtcbiAgICAgICAgdGhpcy5pbmNyZWFzZUZ1bGxNb3ZlQ291bnQoKTtcbiAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSAhdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXI7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrRm9yUGF3blByb21vdGUodG9Nb3ZlUGllY2UsIHByb21vdGlvbkluZGV4KSkge1xuICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0ZvclBhd25Qcm9tb3RlKHRvUHJvbW90ZVBpZWNlOiBQaWVjZSwgcHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCEodG9Qcm9tb3RlUGllY2UgaW5zdGFuY2VvZiBQYXduKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRvUHJvbW90ZVBpZWNlLnBvaW50LnJvdyA9PT0gMCB8fCB0b1Byb21vdGVQaWVjZS5wb2ludC5yb3cgPT09IDcpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT4gcGllY2UgIT09IHRvUHJvbW90ZVBpZWNlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBXaGVuIHdlIG1ha2UgbW92ZSBtYW51YWxseSwgd2UgcGFzcyBwcm9tb3Rpb24gaW5kZXggYWxyZWFkeSwgc28gd2UgZG9uJ3QgbmVlZFxuICAgICAgICAgICAgLy8gdG8gYWNxdWlyZSBpdCBmcm9tIHByb21vdGUgZGlhbG9nXG4gICAgICAgICAgICBpZiAoIXByb21vdGlvbkluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUHJvbW90ZURpYWxvZyh0b1Byb21vdGVQaWVjZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFBpZWNlUHJvbW90aW9uUmVzb2x2ZXIucmVzb2x2ZVByb21vdGlvbkNob2ljZShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZCxcbiAgICAgICAgICAgICAgICAgICAgdG9Qcm9tb3RlUGllY2UsXG4gICAgICAgICAgICAgICAgICAgIHByb21vdGlvbkluZGV4XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jaGVja0lmUGF3bkZpcnN0TW92ZSh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlKTtcbiAgICAgICAgdGhpcy5jaGVja0lmUm9va01vdmVkKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UpO1xuICAgICAgICB0aGlzLmNoZWNrSWZLaW5nTW92ZWQodGhpcy5ib2FyZC5hY3RpdmVQaWVjZSk7XG5cbiAgICAgICAgdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkID0gdGhpcy5ib2FyZC5pc0tpbmdJbkNoZWNrKFxuICAgICAgICAgICAgQ29sb3IuQkxBQ0ssXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQgPSB0aGlzLmJvYXJkLmlzS2luZ0luQ2hlY2soXG4gICAgICAgICAgICBDb2xvci5XSElURSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNoZWNrID1cbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCB8fCB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQ7XG4gICAgICAgIGNvbnN0IGNoZWNrbWF0ZSA9XG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3ZlcyhDb2xvci5CTEFDSykgfHxcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLldISVRFKTtcbiAgICAgICAgY29uc3Qgc3RhbGVtYXRlID1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQYXQoQ29sb3IuQkxBQ0spIHx8IHRoaXMuY2hlY2tGb3JQYXQoQ29sb3IuV0hJVEUpO1xuXG4gICAgICAgIHRoaXMuZGlzYWJsaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm9hcmQuY2FsY3VsYXRlRkVOKCk7XG5cbiAgICAgICAgY29uc3QgbGFzdE1vdmUgPSB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0TGFzdE1vdmUoKTtcbiAgICAgICAgaWYgKGxhc3RNb3ZlICYmIHByb21vdGlvbkluZGV4KSB7XG4gICAgICAgICAgICBsYXN0TW92ZS5tb3ZlICs9IHByb21vdGlvbkluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3ZlQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgLi4ubGFzdE1vdmUsXG4gICAgICAgICAgICBjaGVjayxcbiAgICAgICAgICAgIGNoZWNrbWF0ZSxcbiAgICAgICAgICAgIHN0YWxlbWF0ZSxcbiAgICAgICAgICAgIGZlbjogdGhpcy5ib2FyZC5mZW4sXG4gICAgICAgICAgICBmcmVlTW9kZTogdGhpcy5mcmVlTW9kZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjaGVja0ZvclBhdChjb2xvcjogQ29sb3IpIHtcbiAgICAgICAgaWYgKGNvbG9yID09PSBDb2xvci5XSElURSAmJiAhdGhpcy5ib2FyZC53aGl0ZUtpbmdDaGVja2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoY29sb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbG9yID09PSBDb2xvci5CTEFDSyAmJiAhdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5Qcm9tb3RlRGlhbG9nKHBpZWNlOiBQaWVjZSkge1xuICAgICAgICB0aGlzLm1vZGFsLm9wZW4oKGluZGV4KSA9PiB7XG4gICAgICAgICAgICBQaWVjZVByb21vdGlvblJlc29sdmVyLnJlc29sdmVQcm9tb3Rpb25DaG9pY2UoXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZCxcbiAgICAgICAgICAgICAgICBwaWVjZSxcbiAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJNb3ZlQWN0aW9ucyhpbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcjogQ29sb3IpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmJvYXJkLnBpZWNlc1xuICAgICAgICAgICAgLmZpbHRlcigocGllY2UpID0+IHBpZWNlLmNvbG9yID09PSBjb2xvcilcbiAgICAgICAgICAgIC5zb21lKFxuICAgICAgICAgICAgICAgIChwaWVjZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgcGllY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRQb3NzaWJsZU1vdmVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3ZlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhTW92ZVV0aWxzLndpbGxNb3ZlQ2F1c2VDaGVjayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQucm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92ZS5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlLmNvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB8fFxuICAgICAgICAgICAgICAgICAgICBwaWVjZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldFBvc3NpYmxlQ2FwdHVyZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNhcHR1cmUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFNb3ZlVXRpbHMud2lsbE1vdmVDYXVzZUNoZWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5jb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUuY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIGRpc2FibGVTZWxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGxvZ2ljIHRvIGFsbG93IGZyZWVNb2RlIGJhc2VkIGxvZ2ljIHByb2Nlc3NpbmdcbiAgICAgKi9cbiAgICBvbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5mcmVlTW9kZSB8fFxuICAgICAgICAgICAgcGllY2VDbGlja2VkID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCA9PT0gbnVsbFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXRzIHBsYXllciBhcyB3aGl0ZSBpbi1jYXNlIHdoaXRlIHBpZWNlcyBhcmUgc2VsZWN0ZWQsIGFuZCB2aWNlLXZlcnNhIHdoZW4gYmxhY2sgaXMgc2VsZWN0ZWRcbiAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFO1xuICAgIH1cblxuICAgIGlzUGllY2VEaXNhYmxlZChwaWVjZUNsaWNrZWQ6IFBpZWNlKSB7XG4gICAgICAgIGlmIChwaWVjZUNsaWNrZWQgJiYgcGllY2VDbGlja2VkLnBvaW50KSB7XG4gICAgICAgICAgICBjb25zdCBmb3VuZENhcHR1cmUgPSB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMuZmluZChcbiAgICAgICAgICAgICAgICAoY2FwdHVyZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5jb2wgPT09IHBpZWNlQ2xpY2tlZC5wb2ludC5jb2wgJiZcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5yb3cgPT09IHBpZWNlQ2xpY2tlZC5wb2ludC5yb3dcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZENhcHR1cmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCAmJlxuICAgICAgICAgICAgKCh0aGlzLmxpZ2h0RGlzYWJsZWQgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5XSElURSkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5kYXJrRGlzYWJsZWQgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5CTEFDSykpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYWRkRHJhd1BvaW50KFxuICAgICAgICB4OiBudW1iZXIsXG4gICAgICAgIHk6IG51bWJlcixcbiAgICAgICAgY3J0bDogYm9vbGVhbixcbiAgICAgICAgYWx0OiBib29sZWFuLFxuICAgICAgICBzaGlmdDogYm9vbGVhbixcbiAgICAgICAgbGVmdDogbnVtYmVyLFxuICAgICAgICB0b3A6IG51bWJlclxuICAgICkge1xuICAgICAgICBjb25zdCB1cFBvaW50ID0gQ2xpY2tVdGlscy5nZXREcmF3aW5nUG9pbnQoXG4gICAgICAgICAgICB0aGlzLmhlaWdodEFuZFdpZHRoLFxuICAgICAgICAgICAgdGhpcy5jb2xvclN0cmF0ZWd5LFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHksXG4gICAgICAgICAgICBjcnRsLFxuICAgICAgICAgICAgYWx0LFxuICAgICAgICAgICAgc2hpZnQsXG4gICAgICAgICAgICBsZWZ0LFxuICAgICAgICAgICAgdG9wXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhd1BvaW50LmlzRXF1YWwodXBQb2ludCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNpcmNsZSA9IG5ldyBDaXJjbGUoKTtcbiAgICAgICAgICAgIGNpcmNsZS5kcmF3UG9pbnQgPSB1cFBvaW50O1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYXdQcm92aWRlci5jb250YWluc0NpcmNsZShjaXJjbGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuYWRkQ2lyY2xlKGNpcmNsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlb212ZUNpcmNsZShjaXJjbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYXJyb3cgPSBuZXcgQXJyb3coKTtcbiAgICAgICAgICAgIGFycm93LnN0YXJ0ID0gdGhpcy5kcmF3UG9pbnQ7XG4gICAgICAgICAgICBhcnJvdy5lbmQgPSB1cFBvaW50O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhd1Byb3ZpZGVyLmNvbnRhaW5zQXJyb3coYXJyb3cpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuYWRkQXJyb3coYXJyb3cpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5yZW1vdmVBcnJvdyhhcnJvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbmNyZWFzZUZ1bGxNb3ZlQ291bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIpIHtcbiAgICAgICAgICAgICsrdGhpcy5ib2FyZC5mdWxsTW92ZUNvdW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkUGllY2UoXG4gICAgICAgIHBpZWNlVHlwZUlucHV0OiBQaWVjZVR5cGVJbnB1dCxcbiAgICAgICAgY29sb3JJbnB1dDogQ29sb3JJbnB1dCxcbiAgICAgICAgY29vcmRzOiBzdHJpbmdcbiAgICApIHtcbiAgICAgICAgaWYgKHRoaXMuZnJlZU1vZGUgJiYgY29vcmRzICYmIHBpZWNlVHlwZUlucHV0ID4gMCAmJiBjb2xvcklucHV0ID4gMCkge1xuICAgICAgICAgICAgbGV0IGluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcbiAgICAgICAgICAgICAgICBjb29yZHMsXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBleGlzdGluZyA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxuICAgICAgICAgICAgICAgIGluZGV4ZXMueUF4aXMsXG4gICAgICAgICAgICAgICAgaW5kZXhlcy54QXhpc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKGUgPT4gZSAhPT0gZXhpc3RpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRQaWVjZSA9IFBpZWNlRmFjdG9yeS5jcmVhdGUoXG4gICAgICAgICAgICAgICAgaW5kZXhlcyxcbiAgICAgICAgICAgICAgICBwaWVjZVR5cGVJbnB1dCxcbiAgICAgICAgICAgICAgICBjb2xvcklucHV0LFxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMucHVzaChjcmVhdGVkUGllY2UpO1xuICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=