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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLWZhY2FkZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvZW5naW5lL2VuZ2luZS1mYWNhZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXBFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUMvRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seURBQXlELENBQUM7QUFFN0YsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFJdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRS9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVoRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFckQs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TSxFQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUN0QixDQUFDO1lBQ0YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQ3JDLE9BQU8sQ0FBQyxLQUFLLEVBQ2IsT0FBTyxDQUFDLEtBQUssQ0FDaEIsQ0FBQztZQUNGLElBQUksUUFBUSxFQUFFO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQzthQUNyRTtZQUNELElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQ2xDLE9BQU8sRUFDUCxjQUFjLEVBQ2QsVUFBVSxFQUNWLElBQUksQ0FBQyxLQUFLLENBQ2IsQ0FBQztZQUNGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSGlzdG9yeU1vdmUgfSBmcm9tICcuLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlJztcclxuaW1wb3J0IHsgQ29sb3JJbnB1dCwgUGllY2VUeXBlSW5wdXQgfSBmcm9tICcuLi91dGlscy9pbnB1dHMvcGllY2UtdHlwZS1pbnB1dCc7XHJcbmltcG9ydCB7IEFic3RyYWN0RW5naW5lRmFjYWRlIH0gZnJvbSAnLi9hYnN0cmFjdC1lbmdpbmUtZmFjYWRlJztcclxuXHJcbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvYm9hcmQtbG9hZGVyJztcclxuaW1wb3J0IHsgQm9hcmRTdGF0ZSB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtc3RhdGUvYm9hcmQtc3RhdGUnO1xyXG5pbXBvcnQgeyBCb2FyZFN0YXRlUHJvdmlkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlL2JvYXJkLXN0YXRlLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgTW92ZVN0YXRlUHJvdmlkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlL21vdmUtc3RhdGUtcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBDbGlja1V0aWxzIH0gZnJvbSAnLi9jbGljay9jbGljay11dGlscyc7XHJcbmltcG9ydCB7IEFycm93IH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL3NoYXBlcy9hcnJvdyc7XHJcbmltcG9ydCB7IENpcmNsZSB9IGZyb20gJy4vZHJhd2luZy10b29scy9zaGFwZXMvY2lyY2xlJztcclxuaW1wb3J0IHsgRHJhd1BvaW50IH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL2RyYXctcG9pbnQnO1xyXG5pbXBvcnQgeyBEcmF3UHJvdmlkZXIgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvZHJhdy1wcm92aWRlcic7XHJcbmltcG9ydCB7IEJvYXJkIH0gZnJvbSAnLi4vbW9kZWxzL2JvYXJkJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL2NvbG9yJztcclxuaW1wb3J0IHsgS2luZyB9IGZyb20gJy4uL21vZGVscy9waWVjZXMva2luZyc7XHJcbmltcG9ydCB7IFBhd24gfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL3Bhd24nO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcGllY2UnO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcG9pbnQnO1xyXG5pbXBvcnQgeyBEZWZhdWx0UGduUHJvY2Vzc29yIH0gZnJvbSAnLi9wZ24vZGVmYXVsdC1wZ24tcHJvY2Vzc29yJztcclxuaW1wb3J0IHsgQXZhaWxhYmxlTW92ZURlY29yYXRvciB9IGZyb20gJy4vcGllY2UtZGVjb3JhdG9yL2F2YWlsYWJsZS1tb3ZlLWRlY29yYXRvcic7XHJcbmltcG9ydCB7IFBpZWNlUHJvbW90aW9uUmVzb2x2ZXIgfSBmcm9tICcuLi9waWVjZS1wcm9tb3Rpb24vcGllY2UtcHJvbW90aW9uLXJlc29sdmVyJztcclxuaW1wb3J0IHsgTW92ZVV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvbW92ZS11dGlscyc7XHJcbmltcG9ydCB7IE1vdmVDaGFuZ2UgfSBmcm9tICcuL291dHB1dHMvbW92ZS1jaGFuZ2UvbW92ZS1jaGFuZ2UnO1xyXG5pbXBvcnQgeyBQaWVjZUZhY3RvcnkgfSBmcm9tICcuL3V0aWxzL3BpZWNlLWZhY3RvcnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuZ2luZUZhY2FkZSBleHRlbmRzIEFic3RyYWN0RW5naW5lRmFjYWRlIHtcclxuXHJcbiAgICBfc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgIGRyYXdQb2ludDogRHJhd1BvaW50O1xyXG4gICAgZHJhd1Byb3ZpZGVyOiBEcmF3UHJvdmlkZXI7XHJcbiAgICBib2FyZFN0YXRlUHJvdmlkZXI6IEJvYXJkU3RhdGVQcm92aWRlcjtcclxuICAgIG1vdmVTdGF0ZVByb3ZpZGVyOiBNb3ZlU3RhdGVQcm92aWRlcjtcclxuICAgIG1vdmVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNb3ZlQ2hhbmdlPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBib2FyZDogQm9hcmQsXHJcbiAgICAgICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihib2FyZCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlQ2hhbmdlID0gbW92ZUNoYW5nZTtcclxuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyID0gbmV3IEJvYXJkTG9hZGVyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuYWRkUGllY2VzKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIgPSBuZXcgQm9hcmRTdGF0ZVByb3ZpZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcclxuICAgICAgICB0aGlzLmJvYXJkLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5jb29yZHMucmVzZXQoKTtcclxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucGduUHJvY2Vzc29yLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5mcmVlTW9kZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RCb2FyZCA9IHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLnBvcCgpLmJvYXJkO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZC5yZXZlcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdEJvYXJkLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbGFzdEJvYXJkO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5wb3AoKTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcclxuICAgICAgICAgICAgdGhpcy5wZ25Qcm9jZXNzb3IucmVtb3ZlTGFzdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzYXZlTW92ZUNsb25lKCkge1xyXG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5ib2FyZC5jbG9uZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib2FyZC5yZXZlcnRlZCkge1xyXG4gICAgICAgICAgICBjbG9uZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubW92ZVN0YXRlUHJvdmlkZXIuYWRkTW92ZShuZXcgQm9hcmRTdGF0ZShjbG9uZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtb3ZlKGNvb3Jkczogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvb3Jkcykge1xyXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VJbmRleGVzID0gTW92ZVV0aWxzLnRyYW5zbGF0ZUNvb3Jkc1RvSW5kZXgoXHJcbiAgICAgICAgICAgICAgICBjb29yZHMuc3Vic3RyaW5nKDAsIDIpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVzdEluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcclxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMiwgNCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnJldmVydGVkXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcmNQaWVjZSA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4ZXMueEF4aXNcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzcmNQaWVjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQWN0aXZlUGllY2Uoc3JjUGllY2UsIHNyY1BpZWNlLnBvaW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZU1vdmVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoZGVzdEluZGV4ZXMueUF4aXMsIGRlc3RJbmRleGVzLnhBeGlzKVxyXG4gICAgICAgICAgICAgICAgICAgICkgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlQ2FwdHVyZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVQaWVjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGllY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yZHMubGVuZ3RoID09PSA1ID8gK2Nvb3Jkcy5zdWJzdHJpbmcoNCwgNSkgOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZVNyYyA9IG5ldyBQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZURlc3QgPSBuZXcgUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RJbmRleGVzLnlBeGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0SW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGFyZUFjdGl2ZVBpZWNlKHBpZWNlQ2xpY2tlZDogUGllY2UsIHBvaW50Q2xpY2tlZDogUG9pbnQpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlID0gcGllY2VDbGlja2VkO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBuZXcgQXZhaWxhYmxlTW92ZURlY29yYXRvcihcclxuICAgICAgICAgICAgcGllY2VDbGlja2VkLFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID8gQ29sb3IuV0hJVEUgOiBDb2xvci5CTEFDSyxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFxyXG4gICAgICAgICkuZ2V0UG9zc2libGVDYXB0dXJlcygpO1xyXG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IG5ldyBBdmFpbGFibGVNb3ZlRGVjb3JhdG9yKFxyXG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQsXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZCxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPyBDb2xvci5XSElURSA6IENvbG9yLkJMQUNLLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkXHJcbiAgICAgICAgKS5nZXRQb3NzaWJsZU1vdmVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICh0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLkJMQUNLKSB8fFxyXG4gICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJlcGFyZUFjdGl2ZVBpZWNlKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFuZGxlQ2xpY2tFdmVudChwb2ludENsaWNrZWQ6IFBvaW50LCBpc01vdXNlRG93bjogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCBtb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAoKFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlTW92ZXMocG9pbnRDbGlja2VkKSB8fFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlQ2FwdHVyZXMocG9pbnRDbGlja2VkKVxyXG4gICAgICAgICkgfHwgdGhpcy5mcmVlTW9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlU3JjID0gbmV3IFBvaW50KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmNvbFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlRGVzdCA9IHBvaW50Q2xpY2tlZC5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVQaWVjZSh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLCBwb2ludENsaWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmlzRXF1YWwodGhpcy5ib2FyZC5sYXN0TW92ZVNyYykpIHtcclxuICAgICAgICAgICAgICAgIG1vdmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdXNlRG93biB8fCBtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAocGllY2VDbGlja2VkICYmICFtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgIHRoaXMub25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bihcclxuICAgICAgICBldmVudDogTW91c2VFdmVudCxcclxuICAgICAgICBwb2ludENsaWNrZWQ6IFBvaW50LFxyXG4gICAgICAgIGxlZnQ/OiBudW1iZXIsXHJcbiAgICAgICAgdG9wPzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLm1vdmVEb25lID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdQb2ludCA9IENsaWNrVXRpbHMuZ2V0RHJhd2luZ1BvaW50KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRBbmRXaWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JTdHJhdGVneSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LngsXHJcbiAgICAgICAgICAgICAgICBldmVudC55LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgICAgICAgICAgICAgbGVmdCxcclxuICAgICAgICAgICAgICAgIHRvcFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgJiZcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwaWVjZUNsaWNrZWQgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlQb2ludChcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLnJvdyxcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmNvbFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmZyZWVNb2RlKSB7XHJcbiAgICAgICAgICAgIGlmIChwaWVjZUNsaWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoZSA9PiBlICE9PSBwaWVjZUNsaWNrZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gKHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGllY2VDbGlja2VkKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoXHJcbiAgICAgICAgZXZlbnQ6IE1vdXNlRXZlbnQsXHJcbiAgICAgICAgcG9pbnRDbGlja2VkOiBQb2ludCxcclxuICAgICAgICBsZWZ0OiBudW1iZXIsXHJcbiAgICAgICAgdG9wOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMubW92ZURvbmUgPSBmYWxzZTtcclxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwICYmICF0aGlzLmRyYXdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZERyYXdQb2ludChcclxuICAgICAgICAgICAgICAgIGV2ZW50LngsXHJcbiAgICAgICAgICAgICAgICBldmVudC55LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgICAgICAgICAgICAgbGVmdCwgdG9wXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRyYWdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgJiZcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludCkgJiZcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmdcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGllY2VDbGlja2VkID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5jb2xcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgIHRoaXMucG9zc2libGVNb3ZlcyA9IGFjdGl2ZVBpZWNlLmdldFBvc3NpYmxlTW92ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZUNsb25lKCkge1xyXG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5ib2FyZC5jbG9uZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib2FyZC5yZXZlcnRlZCkge1xyXG4gICAgICAgICAgICBjbG9uZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmFkZE1vdmUobmV3IEJvYXJkU3RhdGUoY2xvbmUpKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlUGllY2UodG9Nb3ZlUGllY2U6IFBpZWNlLCBuZXdQb2ludDogUG9pbnQsIHByb21vdGlvbkluZGV4PzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGVzdFBpZWNlID0gdGhpcy5ib2FyZC5waWVjZXMuZmluZChcclxuICAgICAgICAgICAgKHBpZWNlKSA9PlxyXG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sID09PSBuZXdQb2ludC5jb2wgJiZcclxuICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyA9PT0gbmV3UG9pbnQucm93XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wZ25Qcm9jZXNzb3IucHJvY2VzcyhcclxuICAgICAgICAgICAgdGhpcy5ib2FyZCxcclxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UsXHJcbiAgICAgICAgICAgIG5ld1BvaW50LFxyXG4gICAgICAgICAgICBkZXN0UGllY2VcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoZGVzdFBpZWNlICYmIHRvTW92ZVBpZWNlLmNvbG9yICE9PSBkZXN0UGllY2UuY29sb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAocGllY2UpID0+IHBpZWNlICE9PSBkZXN0UGllY2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZGVzdFBpZWNlICYmIHRvTW92ZVBpZWNlLmNvbG9yID09PSBkZXN0UGllY2UuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbW92ZSA9IG5ldyBIaXN0b3J5TW92ZShcclxuICAgICAgICAgICAgTW92ZVV0aWxzLmZvcm1hdCh0b01vdmVQaWVjZS5wb2ludCwgbmV3UG9pbnQsIHRoaXMuYm9hcmQucmV2ZXJ0ZWQpLFxyXG4gICAgICAgICAgICB0b01vdmVQaWVjZS5jb25zdGFudC5uYW1lLFxyXG4gICAgICAgICAgICB0b01vdmVQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUgPyAnd2hpdGUnIDogJ2JsYWNrJyxcclxuICAgICAgICAgICAgISFkZXN0UGllY2VcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5hZGRNb3ZlKG1vdmUpO1xyXG5cclxuICAgICAgICBpZiAodG9Nb3ZlUGllY2UgaW5zdGFuY2VvZiBLaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZXNNb3ZlZCA9IE1hdGguYWJzKG5ld1BvaW50LmNvbCAtIHRvTW92ZVBpZWNlLnBvaW50LmNvbCk7XHJcbiAgICAgICAgICAgIGlmIChzcXVhcmVzTW92ZWQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3UG9pbnQuY29sIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRSb29rID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5RmllbGQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTW92ZVBpZWNlLnBvaW50LnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZyZWVNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyAyIDogMztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b01vdmVQaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5mcmVlTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodFJvb2sucG9pbnQuY29sID0gdGhpcy5ib2FyZC5yZXZlcnRlZCA/IDQgOiA1O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRvTW92ZVBpZWNlIGluc3RhbmNlb2YgUGF3bikge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSWZQYXduVGFrZXNFblBhc3NhbnQobmV3UG9pbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSWZQYXduRW5wYXNzYW50ZWQodG9Nb3ZlUGllY2UsIG5ld1BvaW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBvaW50ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQaWVjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b01vdmVQaWVjZS5wb2ludCA9IG5ld1BvaW50O1xyXG4gICAgICAgIHRoaXMuaW5jcmVhc2VGdWxsTW92ZUNvdW50KCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSAhdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXI7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jaGVja0ZvclBhd25Qcm9tb3RlKHRvTW92ZVBpZWNlLCBwcm9tb3Rpb25JbmRleCkpIHtcclxuICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrRm9yUGF3blByb21vdGUodG9Qcm9tb3RlUGllY2U6IFBpZWNlLCBwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xyXG4gICAgICAgIGlmICghKHRvUHJvbW90ZVBpZWNlIGluc3RhbmNlb2YgUGF3bikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRvUHJvbW90ZVBpZWNlLnBvaW50LnJvdyA9PT0gMCB8fCB0b1Byb21vdGVQaWVjZS5wb2ludC5yb3cgPT09IDcpIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAocGllY2UpID0+IHBpZWNlICE9PSB0b1Byb21vdGVQaWVjZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gV2hlbiB3ZSBtYWtlIG1vdmUgbWFudWFsbHksIHdlIHBhc3MgcHJvbW90aW9uIGluZGV4IGFscmVhZHksIHNvIHdlIGRvbid0IG5lZWRcclxuICAgICAgICAgICAgLy8gdG8gYWNxdWlyZSBpdCBmcm9tIHByb21vdGUgZGlhbG9nXHJcbiAgICAgICAgICAgIGlmICghcHJvbW90aW9uSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblByb21vdGVEaWFsb2codG9Qcm9tb3RlUGllY2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgUGllY2VQcm9tb3Rpb25SZXNvbHZlci5yZXNvbHZlUHJvbW90aW9uQ2hvaWNlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9Qcm9tb3RlUGllY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbW90aW9uSW5kZXhcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWZ0ZXJNb3ZlQWN0aW9ucyhwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY2hlY2tJZlBhd25GaXJzdE1vdmUodGhpcy5ib2FyZC5hY3RpdmVQaWVjZSk7XHJcbiAgICAgICAgdGhpcy5jaGVja0lmUm9va01vdmVkKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tJZktpbmdNb3ZlZCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkID0gdGhpcy5ib2FyZC5pc0tpbmdJbkNoZWNrKFxyXG4gICAgICAgICAgICBDb2xvci5CTEFDSyxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuYm9hcmQud2hpdGVLaW5nQ2hlY2tlZCA9IHRoaXMuYm9hcmQuaXNLaW5nSW5DaGVjayhcclxuICAgICAgICAgICAgQ29sb3IuV0hJVEUsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBjaGVjayA9XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCB8fCB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQ7XHJcbiAgICAgICAgY29uc3QgY2hlY2ttYXRlID1cclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoQ29sb3IuQkxBQ0spIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLldISVRFKTtcclxuICAgICAgICBjb25zdCBzdGFsZW1hdGUgPVxyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yUGF0KENvbG9yLkJMQUNLKSB8fCB0aGlzLmNoZWNrRm9yUGF0KENvbG9yLldISVRFKTtcclxuXHJcbiAgICAgICAgdGhpcy5wZ25Qcm9jZXNzb3IucHJvY2Vzc0NoZWNrcyhjaGVja21hdGUsIGNoZWNrLCBzdGFsZW1hdGUpO1xyXG4gICAgICAgIHRoaXMucGduUHJvY2Vzc29yLmFkZFByb21vdGlvbkNob2ljZShwcm9tb3Rpb25JbmRleCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzYWJsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFzdE1vdmUgPSB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0TGFzdE1vdmUoKTtcclxuICAgICAgICBpZiAobGFzdE1vdmUgJiYgcHJvbW90aW9uSW5kZXgpIHtcclxuICAgICAgICAgICAgbGFzdE1vdmUubW92ZSArPSBwcm9tb3Rpb25JbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubW92ZUNoYW5nZS5lbWl0KHtcclxuICAgICAgICAgICAgLi4ubGFzdE1vdmUsXHJcbiAgICAgICAgICAgIGNoZWNrLFxyXG4gICAgICAgICAgICBjaGVja21hdGUsXHJcbiAgICAgICAgICAgIHN0YWxlbWF0ZSxcclxuICAgICAgICAgICAgZmVuOiB0aGlzLmJvYXJkLmZlbixcclxuICAgICAgICAgICAgcGduOiB7XHJcbiAgICAgICAgICAgICAgcGduOiB0aGlzLnBnblByb2Nlc3Nvci5nZXRQR04oKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmcmVlTW9kZTogdGhpcy5mcmVlTW9kZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm1vdmVEb25lID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0ZvclBhdChjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLldISVRFICYmICF0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT09IENvbG9yLkJMQUNLICYmICF0aGlzLmJvYXJkLmJsYWNrS2luZ0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3BlblByb21vdGVEaWFsb2cocGllY2U6IFBpZWNlKSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5vcGVuKChpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBQaWVjZVByb21vdGlvblJlc29sdmVyLnJlc29sdmVQcm9tb3Rpb25DaG9pY2UoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgcGllY2UsXHJcbiAgICAgICAgICAgICAgICBpbmRleFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoaW5kZXgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrRm9yUG9zc2libGVNb3Zlcyhjb2xvcjogQ29sb3IpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuYm9hcmQucGllY2VzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKHBpZWNlKSA9PiBwaWVjZS5jb2xvciA9PT0gY29sb3IpXHJcbiAgICAgICAgICAgIC5zb21lKFxyXG4gICAgICAgICAgICAgICAgKHBpZWNlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRQb3NzaWJsZU1vdmVzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobW92ZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhTW92ZVV0aWxzLndpbGxNb3ZlQ2F1c2VDaGVjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlLnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92ZS5jb2wsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgfHxcclxuICAgICAgICAgICAgICAgICAgICBwaWVjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0UG9zc2libGVDYXB0dXJlcygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNhcHR1cmUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIU1vdmVVdGlscy53aWxsTW92ZUNhdXNlQ2hlY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LmNvbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmUuY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZVNlbGVjdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvY2Vzc2VzIGxvZ2ljIHRvIGFsbG93IGZyZWVNb2RlIGJhc2VkIGxvZ2ljIHByb2Nlc3NpbmdcclxuICAgICAqL1xyXG4gICAgb25GcmVlTW9kZShwaWVjZUNsaWNrZWQpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICF0aGlzLmZyZWVNb2RlIHx8XHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCA9PT0gbnVsbFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldHMgcGxheWVyIGFzIHdoaXRlIGluLWNhc2Ugd2hpdGUgcGllY2VzIGFyZSBzZWxlY3RlZCwgYW5kIHZpY2UtdmVyc2Egd2hlbiBibGFjayBpcyBzZWxlY3RlZFxyXG4gICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5XSElURTtcclxuICAgIH1cclxuXHJcbiAgICBpc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkOiBQaWVjZSkge1xyXG4gICAgICAgIGlmIChwaWVjZUNsaWNrZWQgJiYgcGllY2VDbGlja2VkLnBvaW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kQ2FwdHVyZSA9IHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcy5maW5kKFxyXG4gICAgICAgICAgICAgICAgKGNhcHR1cmUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5jb2wgPT09IHBpZWNlQ2xpY2tlZC5wb2ludC5jb2wgJiZcclxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyA9PT0gcGllY2VDbGlja2VkLnBvaW50LnJvd1xyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZvdW5kQ2FwdHVyZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHBpZWNlQ2xpY2tlZCAmJlxyXG4gICAgICAgICAgICAoKHRoaXMubGlnaHREaXNhYmxlZCAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuZGFya0Rpc2FibGVkICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuQkxBQ0spKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRHJhd1BvaW50KFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgY3J0bDogYm9vbGVhbixcclxuICAgICAgICBhbHQ6IGJvb2xlYW4sXHJcbiAgICAgICAgc2hpZnQ6IGJvb2xlYW4sXHJcbiAgICAgICAgbGVmdDogbnVtYmVyLFxyXG4gICAgICAgIHRvcDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB1cFBvaW50ID0gQ2xpY2tVdGlscy5nZXREcmF3aW5nUG9pbnQoXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0QW5kV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JTdHJhdGVneSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgY3J0bCxcclxuICAgICAgICAgICAgYWx0LFxyXG4gICAgICAgICAgICBzaGlmdCxcclxuICAgICAgICAgICAgbGVmdCxcclxuICAgICAgICAgICAgdG9wXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZHJhd1BvaW50LmlzRXF1YWwodXBQb2ludCkpIHtcclxuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gbmV3IENpcmNsZSgpO1xyXG4gICAgICAgICAgICBjaXJjbGUuZHJhd1BvaW50ID0gdXBQb2ludDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYXdQcm92aWRlci5jb250YWluc0NpcmNsZShjaXJjbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5hZGRDaXJjbGUoY2lyY2xlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlb212ZUNpcmNsZShjaXJjbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyb3cgPSBuZXcgQXJyb3coKTtcclxuICAgICAgICAgICAgYXJyb3cuc3RhcnQgPSB0aGlzLmRyYXdQb2ludDtcclxuICAgICAgICAgICAgYXJyb3cuZW5kID0gdXBQb2ludDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kcmF3UHJvdmlkZXIuY29udGFpbnNBcnJvdyhhcnJvdykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmFkZEFycm93KGFycm93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLnJlbW92ZUFycm93KGFycm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbmNyZWFzZUZ1bGxNb3ZlQ291bnQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcikge1xyXG4gICAgICAgICAgICArK3RoaXMuYm9hcmQuZnVsbE1vdmVDb3VudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGllY2UoXHJcbiAgICAgICAgcGllY2VUeXBlSW5wdXQ6IFBpZWNlVHlwZUlucHV0LFxyXG4gICAgICAgIGNvbG9ySW5wdXQ6IENvbG9ySW5wdXQsXHJcbiAgICAgICAgY29vcmRzOiBzdHJpbmdcclxuICAgICkge1xyXG4gICAgICAgIGlmICh0aGlzLmZyZWVNb2RlICYmIGNvb3JkcyAmJiBwaWVjZVR5cGVJbnB1dCA+IDAgJiYgY29sb3JJbnB1dCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcclxuICAgICAgICAgICAgICAgIGNvb3JkcyxcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucmV2ZXJ0ZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbGV0IGV4aXN0aW5nID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXHJcbiAgICAgICAgICAgICAgICBpbmRleGVzLnlBeGlzLFxyXG4gICAgICAgICAgICAgICAgaW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzID0gdGhpcy5ib2FyZC5waWVjZXMuZmlsdGVyKGUgPT4gZSAhPT0gZXhpc3RpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVkUGllY2UgPSBQaWVjZUZhY3RvcnkuY3JlYXRlKFxyXG4gICAgICAgICAgICAgICAgaW5kZXhlcyxcclxuICAgICAgICAgICAgICAgIHBpZWNlVHlwZUlucHV0LFxyXG4gICAgICAgICAgICAgICAgY29sb3JJbnB1dCxcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMucHVzaChjcmVhdGVkUGllY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19