import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges, ViewChild,
} from '@angular/core';
import { BoardLoader } from './board-state-provider/board-loader';

import { DrawProvider } from './drawing-tools/draw-provider';
import { EngineFacade } from './engine/engine-facade';
import { MoveChange } from './engine/move-change';
import { HistoryMove } from './history-move-provider/history-move';
import { Board } from './models/board';
import { Color } from './models/pieces/color';
import { King } from './models/pieces/king';
import { Piece } from './models/pieces/piece';
import { Point } from './models/pieces/point';
import { NgxChessBoardView } from './ngx-chess-board-view';
import { PiecePromotionModalComponent } from './piece-promotion/piece-promotion-modal/piece-promotion-modal.component';

import { NgxChessBoardService } from './service/ngx-chess-board.service';
import { Constants } from './utils/constants';
import { PieceIconInput } from './utils/inputs/piece-icon-input';
import { PieceIconInputManager } from './utils/inputs/piece-icon-input-manager';


@Component({
    selector: 'ngx-chess-board',
    templateUrl: './ngx-chess-board.component.html',
    styleUrls: ['./ngx-chess-board.component.scss'],
})
export class NgxChessBoardComponent
    implements OnInit, OnChanges, NgxChessBoardView {
    @Input() darkTileColor = Constants.DEFAULT_DARK_TILE_COLOR;
    @Input() lightTileColor: string = Constants.DEFAULT_LIGHT_TILE_COLOR;
    @Input() showCoords = true;
    /**
     * Enabling free mode removes turn-based restriction and allows to move any piece freely!
     */
    @Output() moveChange = new EventEmitter<MoveChange>();
    @Output() checkmate = new EventEmitter<void>();
    @Output() stalemate = new EventEmitter<void>();

    @ViewChild('boardRef')
    boardRef: ElementRef;
    @ViewChild('modal')
    modal: PiecePromotionModalComponent;

    pieceSize: number;
    selected = false;
    boardLoader: BoardLoader;
    pieceIconManager: PieceIconInputManager;
    engineFacade: EngineFacade;

    constructor(private ngxChessBoardService: NgxChessBoardService) {
        this.engineFacade = new EngineFacade(
            new Board(),
            this.moveChange
        );
    }

    @Input('size')
    public set size(size: number) {
        if (
            size &&
            size >= Constants.MIN_BOARD_SIZE &&
            size <= Constants.MAX_BOARD_SIZE
        ) {
            this.engineFacade.heightAndWidth = size;
        } else {
            this.engineFacade.heightAndWidth = Constants.DEFAULT_SIZE;
        }
        this.engineFacade.drawProvider.clear();
        this.calculatePieceSize();
    }

    @Input('freeMode')
    public set freeMode(freeMode: boolean) {
        this.engineFacade.freeMode = freeMode;
    }

    @Input('dragDisabled')
    public set dragDisabled(dragDisabled: boolean) {
        this.engineFacade.dragDisabled = dragDisabled;
    }

    @Input('drawDisabled')
    public set drawDisabled(drawDisabled: boolean) {
        this.engineFacade.drawDisabled = drawDisabled;
    }

    @Input('pieceIcons')
    public set pieceIcons(pieceIcons: PieceIconInput) {
        this.pieceIconManager.pieceIconInput = pieceIcons;
    }

    @Input('lightDisabled')
    public set lightDisabled(lightDisabled: boolean) {
        this.engineFacade.lightDisabled = lightDisabled;
    }

    @Input('darkDisabled')
    public set darkDisabled(darkDisabled: boolean) {
        this.engineFacade.darkDisabled = darkDisabled;
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            (changes.lightDisabled &&
                this.lightDisabled &&
                this.engineFacade.board.currentWhitePlayer) ||
            (changes.darkDisabled &&
                this.darkDisabled &&
                !this.engineFacade.board.currentWhitePlayer)
        ) {
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
        }
    }

    ngOnInit() {
        this.ngxChessBoardService.componentMethodCalled$.subscribe(() => {
            this.engineFacade.reset();
        });
        this.calculatePieceSize();
    }

    onMouseUp(event: MouseEvent) {
        this.engineFacade.onMouseUp(
            event,
            this.getClickPoint(event),
            this.boardRef.nativeElement.getBoundingClientRect().left,
            this.boardRef.nativeElement.getBoundingClientRect().top
        );
    }

    /**
     * Validates whether freemode is turned on!
     */
    isFreeMode() {
        return this.freeMode;
    }


    isKingChecked(piece: Piece) {
        if (piece instanceof King) {
            return piece.color === Color.WHITE
                ? this.engineFacade.board.whiteKingChecked
                : this.engineFacade.board.blackKingChecked;
        }
    }

    reverse(): void {
        this.selected = false;
        this.engineFacade.board.reverse();
        this.engineFacade.coords.reverse();
    }

    updateBoard(board: Board) {
        this.engineFacade.board = board;
        this.boardLoader.setBoard(this.engineFacade.board);
        this.engineFacade.board.possibleCaptures = [];
        this.engineFacade.board.possibleMoves = [];
    }


    setFEN(fen: string): void {
        try {
            this.engineFacade.boardLoader.loadFEN(fen);
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
            this.engineFacade.coords.reset();
        } catch (exception) {
            this.engineFacade.boardLoader.addPieces();
        }
    }

    getFEN(): string {
        return this.engineFacade.board.fen;
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
        this.engineFacade.onMouseDown(event, this.getClickPoint(event),
            this.boardRef.nativeElement.getBoundingClientRect().left,
            this.boardRef.nativeElement.getBoundingClientRect().top
        );
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

    private calculatePieceSize() {
        this.pieceSize = this.engineFacade.heightAndWidth / 10;
    }


    getCustomPieceIcons(piece: Piece) {
        return JSON.parse(
            `{ "background-image": "url('${this.pieceIconManager.getPieceIcon(
                piece
            )}')"}`
        );
    }

    move(coords: string): void {
        this.engineFacade.move(coords);
    }

    getMoveHistory(): HistoryMove[] {
        return this.engineFacade.getMoveHistory();
    }

    reset(): void {
        this.engineFacade.reset();
    }

    undo(): void {
        this.engineFacade.undo();
    }
}
