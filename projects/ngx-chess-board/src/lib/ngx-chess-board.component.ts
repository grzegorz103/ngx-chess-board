import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { BoardLoader } from './board-state-provider/board-loader';
import { BoardState } from './board-state-provider/board-state';
import { BoardStateProvider } from './board-state-provider/board-state-provider';
import { MoveStateProvider } from './board-state-provider/move-state-provider';
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
import { Piece } from './models/pieces/piece';
import { Point } from './models/pieces/point';
import { Queen } from './models/pieces/queen';
import { Rook } from './models/pieces/rook';
import { NgxChessBoardView } from './ngx-chess-board-view';
import { AvailableMoveDecorator } from './piece-decorator/available-move-decorator';
import { PiecePromotionModalComponent } from './piece-promotion-modal/piece-promotion-modal.component';
import { NgxChessBoardService } from './service/ngx-chess-board.service';
import { Constants } from './utils/constants';
import { PieceIconInput } from './utils/inputs/piece-icon-input';
import { PieceIconInputManager } from './utils/inputs/piece-icon-input-manager';
import { MoveUtils } from './utils/move-utils';
import { UnicodeConstants } from './utils/unicode-constants';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

export interface MoveChange extends HistoryMove {
    check: boolean;
    stalemate: boolean;
    checkmate: boolean;
}

@Component({
    selector: 'ngx-chess-board',
    templateUrl: './ngx-chess-board.component.html',
    styleUrls: ['./ngx-chess-board.component.scss'],
})
export class NgxChessBoardComponent implements OnInit, NgxChessBoardView {
    @Input() darkTileColor = Constants.DEFAULT_DARK_TILE_COLOR;
    @Input() lightTileColor: string = Constants.DEFAULT_LIGHT_TILE_COLOR;
    @Input() showCoords = true;
    @Input() dragDisabled = false;
    @Input() drawDisabled = false;
    @Output() moveChange = new EventEmitter<MoveChange>();
    @Output() checkmate = new EventEmitter<void>();
    @Output() stalemate = new EventEmitter<void>();
    pieceSize: number;
    selected = false;
    @ViewChild('boardRef', { static: false })
    boardRef: ElementRef;
    @ViewChild('modal', { static: false }) modal: PiecePromotionModalComponent;
    board: Board;
    boardStateProvider: BoardStateProvider;
    moveStateProvider: MoveStateProvider;
    moveHistoryProvider: HistoryMoveProvider;
    boardLoader: BoardLoader;
    coords: CoordsProvider = new CoordsProvider();
    disabling = false;
    drawProvider: DrawProvider;
    drawPoint: DrawPoint;
    pieceIconManager: PieceIconInputManager;

    constructor(private ngxChessBoardService: NgxChessBoardService,private _sanitizer: DomSanitizer) {
        this.board = new Board();
        this.boardLoader = new BoardLoader(this.board);
        this.boardLoader.addPieces();
        this.boardStateProvider = new BoardStateProvider();
        this.moveHistoryProvider = new HistoryMoveProvider();
        this.drawProvider = new DrawProvider();
        this.pieceIconManager = new PieceIconInputManager();
    }

    heightAndWidth: number = Constants.DEFAULT_SIZE;

    @Input('size')
    public set size(size: number) {
        if (
            size &&
            size >= Constants.MIN_BOARD_SIZE &&
            size <= Constants.MAX_BOARD_SIZE
        ) {
            this.heightAndWidth = size;
        } else {
            this.heightAndWidth = Constants.DEFAULT_SIZE;
        }
        this.drawProvider.clear();
        this.calculatePieceSize();
    }

    @Input('pieceIcons')
    public set pieceIcons(pieceIcons: PieceIconInput){
        this.pieceIconManager.pieceIconInput = pieceIcons;
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    ngOnInit() {
        this.ngxChessBoardService.componentMethodCalled$.subscribe(() => {
            this.board.reset();
        });
        this.calculatePieceSize();
    }

    onMouseUp(event: MouseEvent) {
        if (event.button !== 0 && !this.drawDisabled) {
            this.addDrawPoint(
                event.x,
                event.y,
                event.ctrlKey,
                event.altKey,
                event.shiftKey
            );
            return;
        }

        this.drawProvider.clear();

        if (this.dragDisabled) {
            return;
        }
        const pointClicked = this.getClickPoint(event);

        if (
            this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point) &&
            this.disabling
        ) {
            this.disableSelection();
            this.disabling = false;
            return;
        }
        if (this.selected) {
            this.handleClickEvent(pointClicked);
            //   this.possibleMoves = activePiece.getPossibleMoves();
        } else {
            const pieceClicked = this.getPieceByPoint(
                pointClicked.row,
                pointClicked.col
            );
            if (pieceClicked) {
                if (
                    (this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.WHITE)
                ) {
                    return;
                }

                this.prepareActivePiece(pieceClicked, pointClicked);
            }
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

        this.saveBoardToLastMove();
        this.disabling = false;
        this.board.calculateFEN();

        let lastMove = this.moveHistoryProvider.getLastMove();
        if(lastMove && promotionIndex){
            lastMove.move += promotionIndex;
        }
        this.moveChange.emit({
            ...lastMove,
            check,
            checkmate,
            stalemate,
        });
    }

    private saveBoardToLastMove() {
        const clone = this.board.clone();

        if (this.board.reverted) {
            clone.reverse();
        }
        this.moveHistoryProvider.getLastMove().board = clone;
    }

    disableSelection() {
        this.selected = false;
        this.board.possibleCaptures = [];
        this.board.activePiece = null;
        this.board.possibleMoves = [];
    }

    prepareActivePiece(pieceClicked: Piece, pointClicked: Point) {
        this.board.activePiece = pieceClicked;
        this.selected = true;
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

    getPieceByPoint(row: number, col: number): Piece {
        row = Math.floor(row);
        col = Math.floor(col);
        return this.board.pieces.find(
            (piece) => piece.point.col === col && piece.point.row === row
        );
    }

    isKingChecked(piece: Piece) {
        if (piece instanceof King) {
            return piece.color === Color.WHITE
                ? this.board.whiteKingChecked
                : this.board.blackKingChecked;
        }
    }

    getClickPoint(event) {
        return new Point(
            Math.floor(
                (event.y -
                    this.boardRef.nativeElement.getBoundingClientRect().top) /
                    (this.boardRef.nativeElement.getBoundingClientRect()
                        .height /
                        8)
            ),
            Math.floor(
                (event.x -
                    this.boardRef.nativeElement.getBoundingClientRect().left) /
                    (this.boardRef.nativeElement.getBoundingClientRect().width /
                        8)
            )
        );
    }

    movePiece(toMovePiece: Piece, newPoint: Point, promotionIndex?: number) {
        const destPiece = this.board.pieces.find(
            (piece) =>
                piece.point.col === newPoint.col &&
                piece.point.row === newPoint.row
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

        const move = new HistoryMove(
            MoveUtils.format(toMovePiece.point, newPoint, this.board.reverted),
            toMovePiece.constructor.name,
            toMovePiece.color === Color.WHITE ? 'white' : 'black',
            !!destPiece
        );
        this.moveHistoryProvider.addMove(move);

        if (toMovePiece instanceof King) {
            const squaresMoved = Math.abs(newPoint.col - toMovePiece.point.col);
            if (squaresMoved > 1) {
                if (newPoint.col < 3) {
                    const leftRook = this.board.getPieceByField(
                        toMovePiece.point.row,
                        0
                    );
                    leftRook.point.col = 3;
                } else {
                    const rightRook = this.board.getPieceByField(
                        toMovePiece.point.row,
                        7
                    );
                    rightRook.point.col = 5;
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

        if(!this.checkForPawnPromote(toMovePiece, promotionIndex)) {
            this.afterMoveActions();
        }
    }

    checkIfPawnFirstMove(piece: Piece) {
        if (piece instanceof Pawn) {
            piece.isMovedAlready = true;
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
                this.resolvePromotionChoice(toPromotePiece, promotionIndex);
                this.afterMoveActions(promotionIndex);
            }

            return true;
        }
    }

    openPromoteDialog(piece: Piece) {
        this.modal.open(piece.color, (index) => {
            this.resolvePromotionChoice(piece, index);
            this.afterMoveActions(index);
        });
    }

    resolvePromotionChoice(piece: Piece, index: number){
        const isWhite = piece.color === Color.WHITE;
        switch (index) {
            case 1:
                this.board.pieces.push(
                    new Queen(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_QUEEN
                            : UnicodeConstants.BLACK_QUEEN,
                        this.board
                    )
                );
                break;
            case 2:
                this.board.pieces.push(
                    new Rook(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_ROOK
                            : UnicodeConstants.BLACK_ROOK,
                        this.board
                    )
                );
                break;
            case 3:
                this.board.pieces.push(
                    new Bishop(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_BISHOP
                            : UnicodeConstants.BLACK_BISHOP,
                        this.board
                    )
                );
                break;
            case 4:
                this.board.pieces.push(
                    new Knight(
                        piece.point,
                        piece.color,
                        isWhite
                            ? UnicodeConstants.WHITE_KNIGHT
                            : UnicodeConstants.BLACK_KNIGHT,
                        this.board
                    )
                );
                break;
        }
    }

    reset(): void {
        this.boardStateProvider.clear();
        this.moveHistoryProvider.clear();
        this.boardLoader.addPieces();
        this.board.reset();
        this.coords.reset();
        this.drawProvider.clear();
    }

    reverse(): void {
        this.selected = false;
        this.board.reverse();
        this.coords.reverse();
    }

    updateBoard(board: Board) {
        this.board = board;
        this.boardLoader.setBoard(this.board);
        this.board.possibleCaptures = [];
        this.board.possibleMoves = [];
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

    setFEN(fen: string): void {
        try {
            this.boardLoader.loadFEN(fen);
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
        } catch (exception) {
            this.boardLoader.addPieces();
        }
    }

    getFEN(): string {
        return this.board.fen;
    }

    dragEnded(event: CdkDragEnd): void {
        event.source.reset();
        event.source.element.nativeElement.style.zIndex = '0';
        event.source.element.nativeElement.style.pointerEvents = 'auto';
        event.source.element.nativeElement.style.touchAction = 'auto';
    }

    dragStart(event: CdkDragStart): void {
        const style = event.source.element.nativeElement.style;
        style.position = 'relative';
        style.zIndex = '1000';
        style.touchAction = 'none';
        style.pointerEvents = 'none';
    }

    onMouseDown(event: MouseEvent) {
        if (event.button !== 0) {
            this.drawPoint = this.getDrawingPoint(
                event.x,
                event.y,
                event.ctrlKey,
                event.altKey,
                event.shiftKey
            );
            return;
        }
        const pointClicked = this.getClickPoint(event);

        this.drawProvider.clear();

        if (
            this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point)
        ) {
            this.disabling = true;
            return;
        }

        if (this.selected) {
            this.handleClickEvent(pointClicked);
        } else {
            const pieceClicked = this.getPieceByPoint(
                pointClicked.row,
                pointClicked.col
            );
            if (pieceClicked) {
                if (
                    (this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.WHITE)
                ) {
                    return;
                }

                this.prepareActivePiece(pieceClicked, pointClicked);
            }
        }
    }

    getDrawingPoint(
        x: number,
        y: number,
        crtl: boolean,
        alt: boolean,
        shift: boolean
    ) {
        const squareSize = this.heightAndWidth / 8;
        const xx = Math.floor(
            (x - this.boardRef.nativeElement.getBoundingClientRect().left) /
                squareSize
        );
        const yy = Math.floor(
            (y - this.boardRef.nativeElement.getBoundingClientRect().top) /
                squareSize
        );

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
        return new DrawPoint(
            Math.floor(xx * squareSize + squareSize / 2),
            Math.floor(yy * squareSize + squareSize / 2),
            color
        );
    }

    private checkIfRookMoved(piece: Piece) {
        if (piece instanceof Rook) {
            piece.isMovedAlready = true;
        }
    }

    private checkIfKingMoved(piece: Piece) {
        if (piece instanceof King) {
            piece.isMovedAlready = true;
        }
    }

    private checkForPossibleMoves(color: Color): boolean {
        if (
            !this.board.pieces
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
                )
        ) {
            return true;
        } else {
            return false;
        }
    }

    private checkForPat(color: Color) {
        if (color === Color.WHITE && !this.board.whiteKingChecked) {
            return this.checkForPossibleMoves(color);
        } else {
            if (color === Color.BLACK && !this.board.blackKingChecked) {
                return this.checkForPossibleMoves(color);
            }
        }
    }

    private checkIfPawnEnpassanted(piece: Pawn, newPoint: Point) {
        if (Math.abs(piece.point.row - newPoint.row) > 1) {
            this.board.enPassantPiece = piece;
            this.board.enPassantPoint = new Point(
                (piece.point.row + newPoint.row) / 2,
                piece.point.col
            );
        } else {
            this.board.enPassantPoint = null;
            this.board.enPassantPiece = null;
        }
    }

    private checkIfPawnTakesEnPassant(newPoint: Point) {
        if (newPoint.isEqual(this.board.enPassantPoint)) {
            this.board.pieces = this.board.pieces.filter(
                (piece) => piece !== this.board.enPassantPiece
            );
            this.board.enPassantPoint = null;
            this.board.enPassantPiece = null;
        }
    }

    private saveClone() {
        const clone = this.board.clone();

        if (this.board.reverted) {
            clone.reverse();
        }
        this.boardStateProvider.addMove(new BoardState(clone));
    }

    private saveMoveClone() {
        const clone = this.board.clone();

        if (this.board.reverted) {
            clone.reverse();
        }
        this.moveStateProvider.addMove(new BoardState(clone));
    }

    private calculatePieceSize() {
        this.pieceSize = this.heightAndWidth / 10;
    }

    private increaseFullMoveCount() {
        if (!this.board.currentWhitePlayer) {
            ++this.board.fullMoveCount;
        }
    }

    private handleClickEvent(pointClicked: Point) {
        if (
            this.board.isPointInPossibleMoves(pointClicked) ||
            this.board.isPointInPossibleCaptures(pointClicked)
        ) {
            this.saveClone();
            this.board.lastMoveSrc = new Point(
                this.board.activePiece.point.row,
                this.board.activePiece.point.col
            );
            this.board.lastMoveDest = pointClicked;
            this.movePiece(this.board.activePiece, pointClicked);
        }

        this.disableSelection();
        const pieceClicked = this.getPieceByPoint(
            pointClicked.row,
            pointClicked.col
        );
        if (pieceClicked) {
            if (
                (this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.BLACK) ||
                (!this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.WHITE)
            ) {
                return;
            }

            this.prepareActivePiece(pieceClicked, pointClicked);
        }
    }

    private addDrawPoint(
        x: number,
        y: number,
        crtl: boolean,
        alt: boolean,
        shift: boolean
    ) {
        const upPoint = this.getDrawingPoint(x, y, crtl, alt, shift);
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

    move(coords: string) {
        if (coords) {
            const sourceIndexes = MoveUtils.translateCoordsToIndex(
                coords.substring(0, 2),
                this.board.reverted
            );

            const destIndexes = MoveUtils.translateCoordsToIndex(
                coords.substring(2, 4),
                this.board.reverted
            );

            const srcPiece = this.getPieceByPoint(
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

                if(this.board.isPointInPossibleMoves(new Point(destIndexes.yAxis, destIndexes.xAxis))
                    || this.board.isPointInPossibleCaptures(new Point(destIndexes.yAxis, destIndexes.xAxis))) {
                    this.saveClone();
                    this.movePiece(
                        srcPiece,
                        new Point(destIndexes.yAxis, destIndexes.xAxis),
                        coords.length === 5 ? +coords.substring(4,5) : 0
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

    getCustomPieceIcons(piece: Piece) {
        return JSON.parse(`{ "background-image": "url('${this.pieceIconManager.getPieceIcon(piece)}')"}`)
    }

}
