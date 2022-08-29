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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLWZhY2FkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvbGliL2VuZ2luZS9lbmdpbmUtZmFjYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUVwRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVoRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDL0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQzVFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBRTdGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDckQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBSXZELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUUvQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNwRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNyRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXJELE1BQU0sT0FBTyxZQUFhLFNBQVEsb0JBQW9CO0lBV2xELFlB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QWEsQ0FBQztTQUM5QjtJQUNMLENBQUM7SUFFRCxRQUFRLENBQ0osY0FBOEIsRUFDOUIsVUFBc0IsRUFDdEIsTUFBYztRQUVkLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLElBQUksY0FBYyxHQUFHLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQ2pFLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxzQkFBc0IsQ0FDMUMsTUFBTSxFQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUN0QixDQUFDO1lBQ0YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQ3JDLE9BQU8sQ0FBQyxLQUFLLEVBQ2IsT0FBTyxDQUFDLEtBQUssQ0FDaEIsQ0FBQztZQUNGLElBQUksUUFBUSxFQUFFO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQzthQUNyRTtZQUNELElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQ2xDLE9BQU8sRUFDUCxjQUFjLEVBQ2QsVUFBVSxFQUNWLElBQUksQ0FBQyxLQUFLLENBQ2IsQ0FBQztZQUNGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSGlzdG9yeU1vdmUgfSBmcm9tICcuLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlJztcclxuaW1wb3J0IHsgQ29sb3JJbnB1dCwgUGllY2VUeXBlSW5wdXQgfSBmcm9tICcuLi91dGlscy9pbnB1dHMvcGllY2UtdHlwZS1pbnB1dCc7XHJcbmltcG9ydCB7IEFic3RyYWN0RW5naW5lRmFjYWRlIH0gZnJvbSAnLi9hYnN0cmFjdC1lbmdpbmUtZmFjYWRlJztcclxuXHJcbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvYm9hcmQtbG9hZGVyJztcclxuaW1wb3J0IHsgQm9hcmRTdGF0ZSB9IGZyb20gJy4vYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtc3RhdGUvYm9hcmQtc3RhdGUnO1xyXG5pbXBvcnQgeyBCb2FyZFN0YXRlUHJvdmlkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlL2JvYXJkLXN0YXRlLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgTW92ZVN0YXRlUHJvdmlkZXIgfSBmcm9tICcuL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLXN0YXRlL21vdmUtc3RhdGUtcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBDbGlja1V0aWxzIH0gZnJvbSAnLi9jbGljay9jbGljay11dGlscyc7XHJcbmltcG9ydCB7IEFycm93IH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL3NoYXBlcy9hcnJvdyc7XHJcbmltcG9ydCB7IENpcmNsZSB9IGZyb20gJy4vZHJhd2luZy10b29scy9zaGFwZXMvY2lyY2xlJztcclxuaW1wb3J0IHsgRHJhd1BvaW50IH0gZnJvbSAnLi9kcmF3aW5nLXRvb2xzL2RyYXctcG9pbnQnO1xyXG5pbXBvcnQgeyBEcmF3UHJvdmlkZXIgfSBmcm9tICcuL2RyYXdpbmctdG9vbHMvZHJhdy1wcm92aWRlcic7XHJcbmltcG9ydCB7IEJvYXJkIH0gZnJvbSAnLi4vbW9kZWxzL2JvYXJkJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL2NvbG9yJztcclxuaW1wb3J0IHsgS2luZyB9IGZyb20gJy4uL21vZGVscy9waWVjZXMva2luZyc7XHJcbmltcG9ydCB7IFBhd24gfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL3Bhd24nO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcGllY2UnO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvcG9pbnQnO1xyXG5pbXBvcnQgeyBEZWZhdWx0UGduUHJvY2Vzc29yIH0gZnJvbSAnLi9wZ24vZGVmYXVsdC1wZ24tcHJvY2Vzc29yJztcclxuaW1wb3J0IHsgQXZhaWxhYmxlTW92ZURlY29yYXRvciB9IGZyb20gJy4vcGllY2UtZGVjb3JhdG9yL2F2YWlsYWJsZS1tb3ZlLWRlY29yYXRvcic7XHJcbmltcG9ydCB7IFBpZWNlUHJvbW90aW9uUmVzb2x2ZXIgfSBmcm9tICcuLi9waWVjZS1wcm9tb3Rpb24vcGllY2UtcHJvbW90aW9uLXJlc29sdmVyJztcclxuaW1wb3J0IHsgTW92ZVV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvbW92ZS11dGlscyc7XHJcbmltcG9ydCB7IE1vdmVDaGFuZ2UgfSBmcm9tICcuL291dHB1dHMvbW92ZS1jaGFuZ2UvbW92ZS1jaGFuZ2UnO1xyXG5pbXBvcnQgeyBQaWVjZUZhY3RvcnkgfSBmcm9tICcuL3V0aWxzL3BpZWNlLWZhY3RvcnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuZ2luZUZhY2FkZSBleHRlbmRzIEFic3RyYWN0RW5naW5lRmFjYWRlIHtcclxuXHJcbiAgICBfc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgIGRyYXdQb2ludDogRHJhd1BvaW50O1xyXG4gICAgZHJhd1Byb3ZpZGVyOiBEcmF3UHJvdmlkZXI7XHJcbiAgICBib2FyZFN0YXRlUHJvdmlkZXI6IEJvYXJkU3RhdGVQcm92aWRlcjtcclxuICAgIG1vdmVTdGF0ZVByb3ZpZGVyOiBNb3ZlU3RhdGVQcm92aWRlcjtcclxuICAgIG1vdmVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNb3ZlQ2hhbmdlPjtcclxuXHJcbiAgICBwcml2YXRlIGhpc3RvcnlNb3ZlQ2FuZGlkYXRlOiBIaXN0b3J5TW92ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBib2FyZDogQm9hcmQsXHJcbiAgICAgICAgbW92ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihib2FyZCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlQ2hhbmdlID0gbW92ZUNoYW5nZTtcclxuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyID0gbmV3IEJvYXJkTG9hZGVyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuYWRkUGllY2VzKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIgPSBuZXcgQm9hcmRTdGF0ZVByb3ZpZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5tb3ZlSGlzdG9yeVByb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcclxuICAgICAgICB0aGlzLmJvYXJkLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5jb29yZHMucmVzZXQoKTtcclxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucGduUHJvY2Vzc29yLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG8oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkU3RhdGVQcm92aWRlci5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFzdEJvYXJkID0gdGhpcy5ib2FyZFN0YXRlUHJvdmlkZXIucG9wKCkuYm9hcmQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkLnJldmVydGVkKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0Qm9hcmQucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQgPSBsYXN0Qm9hcmQ7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5wb3AoKTtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcclxuICAgICAgICAgICAgdGhpcy5wZ25Qcm9jZXNzb3IucmVtb3ZlTGFzdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzYXZlTW92ZUNsb25lKCkge1xyXG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5ib2FyZC5jbG9uZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib2FyZC5yZXZlcnRlZCkge1xyXG4gICAgICAgICAgICBjbG9uZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubW92ZVN0YXRlUHJvdmlkZXIuYWRkTW92ZShuZXcgQm9hcmRTdGF0ZShjbG9uZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtb3ZlKGNvb3Jkczogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvb3Jkcykge1xyXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VJbmRleGVzID0gTW92ZVV0aWxzLnRyYW5zbGF0ZUNvb3Jkc1RvSW5kZXgoXHJcbiAgICAgICAgICAgICAgICBjb29yZHMuc3Vic3RyaW5nKDAsIDIpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVzdEluZGV4ZXMgPSBNb3ZlVXRpbHMudHJhbnNsYXRlQ29vcmRzVG9JbmRleChcclxuICAgICAgICAgICAgICAgIGNvb3Jkcy5zdWJzdHJpbmcoMiwgNCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnJldmVydGVkXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcmNQaWVjZSA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4ZXMueEF4aXNcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzcmNQaWVjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuQkxBQ0spIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKCF0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQWN0aXZlUGllY2Uoc3JjUGllY2UsIHNyY1BpZWNlLnBvaW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZU1vdmVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoZGVzdEluZGV4ZXMueUF4aXMsIGRlc3RJbmRleGVzLnhBeGlzKVxyXG4gICAgICAgICAgICAgICAgICAgICkgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmlzUG9pbnRJblBvc3NpYmxlQ2FwdHVyZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVQaWVjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGllY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChkZXN0SW5kZXhlcy55QXhpcywgZGVzdEluZGV4ZXMueEF4aXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yZHMubGVuZ3RoID09PSA1ID8gK2Nvb3Jkcy5zdWJzdHJpbmcoNCwgNSkgOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZVNyYyA9IG5ldyBQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy55QXhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5sYXN0TW92ZURlc3QgPSBuZXcgUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RJbmRleGVzLnlBeGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0SW5kZXhlcy54QXhpc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGFyZUFjdGl2ZVBpZWNlKHBpZWNlQ2xpY2tlZDogUGllY2UsIHBvaW50Q2xpY2tlZDogUG9pbnQpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlID0gcGllY2VDbGlja2VkO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBuZXcgQXZhaWxhYmxlTW92ZURlY29yYXRvcihcclxuICAgICAgICAgICAgcGllY2VDbGlja2VkLFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID8gQ29sb3IuV0hJVEUgOiBDb2xvci5CTEFDSyxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFxyXG4gICAgICAgICkuZ2V0UG9zc2libGVDYXB0dXJlcygpO1xyXG4gICAgICAgIHRoaXMuYm9hcmQucG9zc2libGVNb3ZlcyA9IG5ldyBBdmFpbGFibGVNb3ZlRGVjb3JhdG9yKFxyXG4gICAgICAgICAgICBwaWVjZUNsaWNrZWQsXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZCxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPyBDb2xvci5XSElURSA6IENvbG9yLkJMQUNLLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkXHJcbiAgICAgICAgKS5nZXRQb3NzaWJsZU1vdmVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICh0aGlzLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllciAmJiBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLkJMQUNLKSB8fFxyXG4gICAgICAgICAgICAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJlcGFyZUFjdGl2ZVBpZWNlKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFuZGxlQ2xpY2tFdmVudChwb2ludENsaWNrZWQ6IFBvaW50LCBpc01vdXNlRG93bjogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCBtb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAoKChcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZU1vdmVzKHBvaW50Q2xpY2tlZCkgfHxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5pc1BvaW50SW5Qb3NzaWJsZUNhcHR1cmVzKHBvaW50Q2xpY2tlZClcclxuICAgICAgICApIHx8IHRoaXMuZnJlZU1vZGUpICYmIHBvaW50Q2xpY2tlZC5pc0luUmFuZ2UoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlU3JjID0gbmV3IFBvaW50KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmNvbFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmxhc3RNb3ZlRGVzdCA9IHBvaW50Q2xpY2tlZC5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVQaWVjZSh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLCBwb2ludENsaWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlLnBvaW50LmlzRXF1YWwodGhpcy5ib2FyZC5sYXN0TW92ZVNyYykpIHtcclxuICAgICAgICAgICAgICAgIG1vdmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdXNlRG93biB8fCBtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IHBpZWNlQ2xpY2tlZCA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeVBvaW50KFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQucm93LFxyXG4gICAgICAgICAgICBwb2ludENsaWNrZWQuY29sXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAocGllY2VDbGlja2VkICYmICFtb3ZpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgIHRoaXMub25QaWVjZUNsaWNrZWQocGllY2VDbGlja2VkLCBwb2ludENsaWNrZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bihcclxuICAgICAgICBldmVudDogTW91c2VFdmVudCxcclxuICAgICAgICBwb2ludENsaWNrZWQ6IFBvaW50LFxyXG4gICAgICAgIGxlZnQ/OiBudW1iZXIsXHJcbiAgICAgICAgdG9wPzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLm1vdmVEb25lID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdQb2ludCA9IENsaWNrVXRpbHMuZ2V0RHJhd2luZ1BvaW50KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRBbmRXaWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JTdHJhdGVneSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LngsXHJcbiAgICAgICAgICAgICAgICBldmVudC55LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgICAgICAgICAgICAgbGVmdCxcclxuICAgICAgICAgICAgICAgIHRvcFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgJiZcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwaWVjZUNsaWNrZWQgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlQb2ludChcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLnJvdyxcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmNvbFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmZyZWVNb2RlKSB7XHJcbiAgICAgICAgICAgIGlmIChwaWVjZUNsaWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoZSA9PiBlICE9PSBwaWVjZUNsaWNrZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyID0gKHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGllY2VDbGlja2VkKHBpZWNlQ2xpY2tlZCwgcG9pbnRDbGlja2VkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoXHJcbiAgICAgICAgZXZlbnQ6IE1vdXNlRXZlbnQsXHJcbiAgICAgICAgcG9pbnRDbGlja2VkOiBQb2ludCxcclxuICAgICAgICBsZWZ0OiBudW1iZXIsXHJcbiAgICAgICAgdG9wOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMubW92ZURvbmUgPSBmYWxzZTtcclxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwICYmICF0aGlzLmRyYXdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZERyYXdQb2ludChcclxuICAgICAgICAgICAgICAgIGV2ZW50LngsXHJcbiAgICAgICAgICAgICAgICBldmVudC55LFxyXG4gICAgICAgICAgICAgICAgZXZlbnQuY3RybEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcclxuICAgICAgICAgICAgICAgIGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgICAgICAgICAgICAgbGVmdCwgdG9wXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRyYWdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYWN0aXZlUGllY2UgJiZcclxuICAgICAgICAgICAgcG9pbnRDbGlja2VkLmlzRXF1YWwodGhpcy5ib2FyZC5hY3RpdmVQaWVjZS5wb2ludCkgJiZcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxpbmdcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGllY2VDbGlja2VkID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5yb3csXHJcbiAgICAgICAgICAgIHBvaW50Q2xpY2tlZC5jb2xcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1BpZWNlRGlzYWJsZWQocGllY2VDbGlja2VkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGlja0V2ZW50KHBvaW50Q2xpY2tlZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgIHRoaXMucG9zc2libGVNb3ZlcyA9IGFjdGl2ZVBpZWNlLmdldFBvc3NpYmxlTW92ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZUNsb25lKCkge1xyXG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5ib2FyZC5jbG9uZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib2FyZC5yZXZlcnRlZCkge1xyXG4gICAgICAgICAgICBjbG9uZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYm9hcmRTdGF0ZVByb3ZpZGVyLmFkZE1vdmUobmV3IEJvYXJkU3RhdGUoY2xvbmUpKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlUGllY2UodG9Nb3ZlUGllY2U6IFBpZWNlLCBuZXdQb2ludDogUG9pbnQsIHByb21vdGlvbkluZGV4PzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGVzdFBpZWNlID0gdGhpcy5ib2FyZC5waWVjZXMuZmluZChcclxuICAgICAgICAgICAgKHBpZWNlKSA9PlxyXG4gICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sID09PSBuZXdQb2ludC5jb2wgJiZcclxuICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyA9PT0gbmV3UG9pbnQucm93XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wZ25Qcm9jZXNzb3IucHJvY2VzcyhcclxuICAgICAgICAgICAgdGhpcy5ib2FyZCxcclxuICAgICAgICAgICAgdG9Nb3ZlUGllY2UsXHJcbiAgICAgICAgICAgIG5ld1BvaW50LFxyXG4gICAgICAgICAgICBkZXN0UGllY2VcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoZGVzdFBpZWNlICYmIHRvTW92ZVBpZWNlLmNvbG9yICE9PSBkZXN0UGllY2UuY29sb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAocGllY2UpID0+IHBpZWNlICE9PSBkZXN0UGllY2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZGVzdFBpZWNlICYmIHRvTW92ZVBpZWNlLmNvbG9yID09PSBkZXN0UGllY2UuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oaXN0b3J5TW92ZUNhbmRpZGF0ZSA9IG5ldyBIaXN0b3J5TW92ZShcclxuICAgICAgICAgICAgTW92ZVV0aWxzLmZvcm1hdCh0b01vdmVQaWVjZS5wb2ludCwgbmV3UG9pbnQsIHRoaXMuYm9hcmQucmV2ZXJ0ZWQpLFxyXG4gICAgICAgICAgICB0b01vdmVQaWVjZS5jb25zdGFudC5uYW1lLFxyXG4gICAgICAgICAgICB0b01vdmVQaWVjZS5jb2xvciA9PT0gQ29sb3IuV0hJVEUgPyAnd2hpdGUnIDogJ2JsYWNrJyxcclxuICAgICAgICAgICAgISFkZXN0UGllY2VcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMubW92ZUhpc3RvcnlQcm92aWRlci5hZGRNb3ZlKHRoaXMuaGlzdG9yeU1vdmVDYW5kaWRhdGUpO1xyXG5cclxuICAgICAgICBpZiAodG9Nb3ZlUGllY2UgaW5zdGFuY2VvZiBLaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZXNNb3ZlZCA9IE1hdGguYWJzKG5ld1BvaW50LmNvbCAtIHRvTW92ZVBpZWNlLnBvaW50LmNvbCk7XHJcbiAgICAgICAgICAgIGlmIChzcXVhcmVzTW92ZWQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3UG9pbnQuY29sIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRSb29rID0gdGhpcy5ib2FyZC5nZXRQaWVjZUJ5RmllbGQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTW92ZVBpZWNlLnBvaW50LnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZyZWVNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRSb29rLnBvaW50LmNvbCA9IHRoaXMuYm9hcmQucmV2ZXJ0ZWQgPyAyIDogMztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0Um9vayA9IHRoaXMuYm9hcmQuZ2V0UGllY2VCeUZpZWxkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b01vdmVQaWVjZS5wb2ludC5yb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5mcmVlTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodFJvb2sucG9pbnQuY29sID0gdGhpcy5ib2FyZC5yZXZlcnRlZCA/IDQgOiA1O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRvTW92ZVBpZWNlIGluc3RhbmNlb2YgUGF3bikge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSWZQYXduVGFrZXNFblBhc3NhbnQobmV3UG9pbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSWZQYXduRW5wYXNzYW50ZWQodG9Nb3ZlUGllY2UsIG5ld1BvaW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmVuUGFzc2FudFBvaW50ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5lblBhc3NhbnRQaWVjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b01vdmVQaWVjZS5wb2ludCA9IG5ld1BvaW50O1xyXG4gICAgICAgIHRoaXMuaW5jcmVhc2VGdWxsTW92ZUNvdW50KCk7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSAhdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXI7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jaGVja0ZvclBhd25Qcm9tb3RlKHRvTW92ZVBpZWNlLCBwcm9tb3Rpb25JbmRleCkpIHtcclxuICAgICAgICAgICAgdGhpcy5hZnRlck1vdmVBY3Rpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrRm9yUGF3blByb21vdGUodG9Qcm9tb3RlUGllY2U6IFBpZWNlLCBwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xyXG4gICAgICAgIGlmICghKHRvUHJvbW90ZVBpZWNlIGluc3RhbmNlb2YgUGF3bikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRvUHJvbW90ZVBpZWNlLnBvaW50LnJvdyA9PT0gMCB8fCB0b1Byb21vdGVQaWVjZS5wb2ludC5yb3cgPT09IDcpIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAocGllY2UpID0+IHBpZWNlICE9PSB0b1Byb21vdGVQaWVjZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gV2hlbiB3ZSBtYWtlIG1vdmUgbWFudWFsbHksIHdlIHBhc3MgcHJvbW90aW9uIGluZGV4IGFscmVhZHksIHNvIHdlIGRvbid0IG5lZWRcclxuICAgICAgICAgICAgLy8gdG8gYWNxdWlyZSBpdCBmcm9tIHByb21vdGUgZGlhbG9nXHJcbiAgICAgICAgICAgIGlmICghcHJvbW90aW9uSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblByb21vdGVEaWFsb2codG9Qcm9tb3RlUGllY2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgUGllY2VQcm9tb3Rpb25SZXNvbHZlci5yZXNvbHZlUHJvbW90aW9uQ2hvaWNlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9Qcm9tb3RlUGllY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbW90aW9uSW5kZXhcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMocHJvbW90aW9uSW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWZ0ZXJNb3ZlQWN0aW9ucyhwcm9tb3Rpb25JbmRleD86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY2hlY2tJZlBhd25GaXJzdE1vdmUodGhpcy5ib2FyZC5hY3RpdmVQaWVjZSk7XHJcbiAgICAgICAgdGhpcy5jaGVja0lmUm9va01vdmVkKHRoaXMuYm9hcmQuYWN0aXZlUGllY2UpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tJZktpbmdNb3ZlZCh0aGlzLmJvYXJkLmFjdGl2ZVBpZWNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib2FyZC5ibGFja0tpbmdDaGVja2VkID0gdGhpcy5ib2FyZC5pc0tpbmdJbkNoZWNrKFxyXG4gICAgICAgICAgICBDb2xvci5CTEFDSyxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuYm9hcmQud2hpdGVLaW5nQ2hlY2tlZCA9IHRoaXMuYm9hcmQuaXNLaW5nSW5DaGVjayhcclxuICAgICAgICAgICAgQ29sb3IuV0hJVEUsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucGllY2VzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBjaGVjayA9XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCB8fCB0aGlzLmJvYXJkLndoaXRlS2luZ0NoZWNrZWQ7XHJcbiAgICAgICAgY29uc3QgY2hlY2ttYXRlID1cclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoQ29sb3IuQkxBQ0spIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKENvbG9yLldISVRFKTtcclxuICAgICAgICBjb25zdCBzdGFsZW1hdGUgPVxyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yUGF0KENvbG9yLkJMQUNLKSB8fCB0aGlzLmNoZWNrRm9yUGF0KENvbG9yLldISVRFKTtcclxuXHJcbiAgICAgICAgdGhpcy5oaXN0b3J5TW92ZUNhbmRpZGF0ZS5zZXRHYW1lU3RhdGVzKGNoZWNrLCBzdGFsZW1hdGUsIGNoZWNrbWF0ZSk7XHJcbiAgICAgICAgdGhpcy5wZ25Qcm9jZXNzb3IucHJvY2Vzc0NoZWNrcyhjaGVja21hdGUsIGNoZWNrLCBzdGFsZW1hdGUpO1xyXG4gICAgICAgIHRoaXMucGduUHJvY2Vzc29yLmFkZFByb21vdGlvbkNob2ljZShwcm9tb3Rpb25JbmRleCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzYWJsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jYWxjdWxhdGVGRU4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFzdE1vdmUgPSB0aGlzLm1vdmVIaXN0b3J5UHJvdmlkZXIuZ2V0TGFzdE1vdmUoKTtcclxuICAgICAgICBpZiAobGFzdE1vdmUgJiYgcHJvbW90aW9uSW5kZXgpIHtcclxuICAgICAgICAgICAgbGFzdE1vdmUubW92ZSArPSBwcm9tb3Rpb25JbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubW92ZUNoYW5nZS5lbWl0KHtcclxuICAgICAgICAgICAgLi4ubGFzdE1vdmUsXHJcbiAgICAgICAgICAgIGNoZWNrLFxyXG4gICAgICAgICAgICBjaGVja21hdGUsXHJcbiAgICAgICAgICAgIHN0YWxlbWF0ZSxcclxuICAgICAgICAgICAgZmVuOiB0aGlzLmJvYXJkLmZlbixcclxuICAgICAgICAgICAgcGduOiB7XHJcbiAgICAgICAgICAgICAgICBwZ246IHRoaXMucGduUHJvY2Vzc29yLmdldFBHTigpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZyZWVNb2RlOiB0aGlzLmZyZWVNb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubW92ZURvbmUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrRm9yUGF0KGNvbG9yOiBDb2xvcikge1xyXG4gICAgICAgIGlmIChjb2xvciA9PT0gQ29sb3IuV0hJVEUgJiYgIXRoaXMuYm9hcmQud2hpdGVLaW5nQ2hlY2tlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0ZvclBvc3NpYmxlTW92ZXMoY29sb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gQ29sb3IuQkxBQ0sgJiYgIXRoaXMuYm9hcmQuYmxhY2tLaW5nQ2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuUHJvbW90ZURpYWxvZyhwaWVjZTogUGllY2UpIHtcclxuICAgICAgICBpZiAocGllY2UuY29sb3IgPT09IHRoaXMuYm9hcmQuYWN0aXZlUGllY2UuY29sb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RhbC5vcGVuKChpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGllY2VQcm9tb3Rpb25SZXNvbHZlci5yZXNvbHZlUHJvbW90aW9uQ2hvaWNlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgcGllY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyTW92ZUFjdGlvbnMoaW5kZXgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tGb3JQb3NzaWJsZU1vdmVzKGNvbG9yOiBDb2xvcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5ib2FyZC5waWVjZXNcclxuICAgICAgICAgICAgLmZpbHRlcigocGllY2UpID0+IHBpZWNlLmNvbG9yID09PSBjb2xvcilcclxuICAgICAgICAgICAgLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAocGllY2UpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgcGllY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldFBvc3NpYmxlTW92ZXMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc29tZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3ZlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFNb3ZlVXRpbHMud2lsbE1vdmVDYXVzZUNoZWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQucm93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5wb2ludC5jb2wsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmUucm93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlLmNvbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRQb3NzaWJsZUNhcHR1cmVzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2FwdHVyZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhTW92ZVV0aWxzLndpbGxNb3ZlQ2F1c2VDaGVjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnBvaW50LnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UucG9pbnQuY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLnJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FwdHVyZS5jb2wsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNhYmxlU2VsZWN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgdGhpcy5ib2FyZC5hY3RpdmVQaWVjZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9jZXNzZXMgbG9naWMgdG8gYWxsb3cgZnJlZU1vZGUgYmFzZWQgbG9naWMgcHJvY2Vzc2luZ1xyXG4gICAgICovXHJcbiAgICBvbkZyZWVNb2RlKHBpZWNlQ2xpY2tlZCkge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgIXRoaXMuZnJlZU1vZGUgfHxcclxuICAgICAgICAgICAgcGllY2VDbGlja2VkID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgcGllY2VDbGlja2VkID09PSBudWxsXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0cyBwbGF5ZXIgYXMgd2hpdGUgaW4tY2FzZSB3aGl0ZSBwaWVjZXMgYXJlIHNlbGVjdGVkLCBhbmQgdmljZS12ZXJzYSB3aGVuIGJsYWNrIGlzIHNlbGVjdGVkXHJcbiAgICAgICAgdGhpcy5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIgPSBwaWVjZUNsaWNrZWQuY29sb3IgPT09IENvbG9yLldISVRFO1xyXG4gICAgfVxyXG5cclxuICAgIGlzUGllY2VEaXNhYmxlZChwaWVjZUNsaWNrZWQ6IFBpZWNlKSB7XHJcbiAgICAgICAgaWYgKHBpZWNlQ2xpY2tlZCAmJiBwaWVjZUNsaWNrZWQucG9pbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgZm91bmRDYXB0dXJlID0gdGhpcy5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAoY2FwdHVyZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlLmNvbCA9PT0gcGllY2VDbGlja2VkLnBvaW50LmNvbCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmUucm93ID09PSBwaWVjZUNsaWNrZWQucG9pbnQucm93XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm91bmRDYXB0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcGllY2VDbGlja2VkICYmXHJcbiAgICAgICAgICAgICgodGhpcy5saWdodERpc2FibGVkICYmIHBpZWNlQ2xpY2tlZC5jb2xvciA9PT0gQ29sb3IuV0hJVEUpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5kYXJrRGlzYWJsZWQgJiYgcGllY2VDbGlja2VkLmNvbG9yID09PSBDb2xvci5CTEFDSykpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGREcmF3UG9pbnQoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICBjcnRsOiBib29sZWFuLFxyXG4gICAgICAgIGFsdDogYm9vbGVhbixcclxuICAgICAgICBzaGlmdDogYm9vbGVhbixcclxuICAgICAgICBsZWZ0OiBudW1iZXIsXHJcbiAgICAgICAgdG9wOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IHVwUG9pbnQgPSBDbGlja1V0aWxzLmdldERyYXdpbmdQb2ludChcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHRBbmRXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy5jb2xvclN0cmF0ZWd5LFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICBjcnRsLFxyXG4gICAgICAgICAgICBhbHQsXHJcbiAgICAgICAgICAgIHNoaWZ0LFxyXG4gICAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgICAgICB0b3BcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kcmF3UG9pbnQuaXNFcXVhbCh1cFBvaW50KSkge1xyXG4gICAgICAgICAgICBjb25zdCBjaXJjbGUgPSBuZXcgQ2lyY2xlKCk7XHJcbiAgICAgICAgICAgIGNpcmNsZS5kcmF3UG9pbnQgPSB1cFBvaW50O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhd1Byb3ZpZGVyLmNvbnRhaW5zQ2lyY2xlKGNpcmNsZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Byb3ZpZGVyLmFkZENpcmNsZShjaXJjbGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIucmVvbXZlQ2lyY2xlKGNpcmNsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcnJvdyA9IG5ldyBBcnJvdygpO1xyXG4gICAgICAgICAgICBhcnJvdy5zdGFydCA9IHRoaXMuZHJhd1BvaW50O1xyXG4gICAgICAgICAgICBhcnJvdy5lbmQgPSB1cFBvaW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYXdQcm92aWRlci5jb250YWluc0Fycm93KGFycm93KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIuYWRkQXJyb3coYXJyb3cpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3UHJvdmlkZXIucmVtb3ZlQXJyb3coYXJyb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluY3JlYXNlRnVsbE1vdmVDb3VudCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKSB7XHJcbiAgICAgICAgICAgICsrdGhpcy5ib2FyZC5mdWxsTW92ZUNvdW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRQaWVjZShcclxuICAgICAgICBwaWVjZVR5cGVJbnB1dDogUGllY2VUeXBlSW5wdXQsXHJcbiAgICAgICAgY29sb3JJbnB1dDogQ29sb3JJbnB1dCxcclxuICAgICAgICBjb29yZHM6IHN0cmluZ1xyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJlZU1vZGUgJiYgY29vcmRzICYmIHBpZWNlVHlwZUlucHV0ID4gMCAmJiBjb2xvcklucHV0ID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhlcyA9IE1vdmVVdGlscy50cmFuc2xhdGVDb29yZHNUb0luZGV4KFxyXG4gICAgICAgICAgICAgICAgY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZXZlcnRlZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBsZXQgZXhpc3RpbmcgPSB0aGlzLmJvYXJkLmdldFBpZWNlQnlQb2ludChcclxuICAgICAgICAgICAgICAgIGluZGV4ZXMueUF4aXMsXHJcbiAgICAgICAgICAgICAgICBpbmRleGVzLnhBeGlzXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5waWVjZXMgPSB0aGlzLmJvYXJkLnBpZWNlcy5maWx0ZXIoZSA9PiBlICE9PSBleGlzdGluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRQaWVjZSA9IFBpZWNlRmFjdG9yeS5jcmVhdGUoXHJcbiAgICAgICAgICAgICAgICBpbmRleGVzLFxyXG4gICAgICAgICAgICAgICAgcGllY2VUeXBlSW5wdXQsXHJcbiAgICAgICAgICAgICAgICBjb2xvcklucHV0LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVDbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnBpZWNlcy5wdXNoKGNyZWF0ZWRQaWVjZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJNb3ZlQWN0aW9ucygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=