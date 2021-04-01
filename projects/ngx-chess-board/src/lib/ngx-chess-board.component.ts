import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { AbstractEngineFacade } from './engine/abstract-engine-facade';
import { BoardLoader } from './engine/board-state-provider/board-loader/board-loader';
import {
    NotationProcessorFactory, NotationType,
} from './engine/board-state-provider/board-loader/notation-processors/notation-processor-factory';
import { ClickUtils } from './engine/click/click-utils';
import { EngineFacade } from './engine/engine-facade';
import { MoveChange } from './engine/move-change/move-change';
import { HistoryMove } from './history-move-provider/history-move';
import { Board } from './models/board';
import { Piece } from './models/pieces/piece';
import { NgxChessBoardView } from './ngx-chess-board-view';
import { PiecePromotionModalComponent } from './piece-promotion/piece-promotion-modal/piece-promotion-modal.component';
import { NgxChessBoardService } from './service/ngx-chess-board.service';
import { Constants } from './utils/constants';
import { PieceIconInput } from './utils/inputs/piece-icon-input';
import { PieceIconInputManager } from './utils/inputs/piece-icon-input-manager';
import { ColorInput, PieceTypeInput } from './utils/inputs/piece-type-input';


@Component({
    selector: 'ngx-chess-board',
    templateUrl: './ngx-chess-board.component.html',
    styleUrls: ['./ngx-chess-board.component.scss'],
})
export class NgxChessBoardComponent
    implements OnInit, OnChanges, NgxChessBoardView, AfterViewInit {

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

    engineFacade: AbstractEngineFacade;

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

    }

    ngAfterViewInit(): void {
        this.engineFacade.modal = this.modal;
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

    reverse(): void {
        this.selected = false;
        this.engineFacade.board.reverse();
        this.engineFacade.coords.reverse();
    }

    updateBoard(board: Board) {
        this.engineFacade.board = board;
        this.boardLoader.setEngineFacade(this.engineFacade);
        this.engineFacade.board.possibleCaptures = [];
        this.engineFacade.board.possibleMoves = [];
    }

    setFEN(fen: string): void {
        try {
            this.engineFacade.boardLoader.setNotationProcessor(
                NotationProcessorFactory.getProcessor(NotationType.FEN)
            );
            this.engineFacade.boardLoader.loadFEN(fen);
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
            this.engineFacade.coords.reset();
        } catch (exception) {
            this.engineFacade.boardLoader.addPieces();
        }
    }

    setPGN(pgn: string): void {
        try {
            this.engineFacade.boardLoader.setNotationProcessor(
                NotationProcessorFactory.getProcessor(NotationType.PGN)
            );
            this.engineFacade.boardLoader.loadPGN(pgn);
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
            this.engineFacade.coords.reset();
        } catch (exception) {
            console.log(exception);
            this.engineFacade.boardLoader.addPieces();
        }
    }

    getFEN(): string {
        return this.engineFacade.board.fen;
    }

    dragEnded(event: CdkDragEnd): void {
        this.engineFacade.dragEndStrategy.process(event);
    }

    dragStart(event: CdkDragStart): void {
        this.engineFacade.dragStartStrategy.process(event);
    }

    onMouseDown(event: MouseEvent) {
        this.engineFacade.onMouseDown(event, this.getClickPoint(event),
            this.boardRef.nativeElement.getBoundingClientRect().left,
            this.boardRef.nativeElement.getBoundingClientRect().top
        );
    }

    getClickPoint(event) {
        return ClickUtils.getClickPoint(
            event,
            this.boardRef.nativeElement.getBoundingClientRect().top,
            this.boardRef.nativeElement.getBoundingClientRect().height,
            this.boardRef.nativeElement.getBoundingClientRect().left,
            this.boardRef.nativeElement.getBoundingClientRect().width
        );
    }

    private calculatePieceSize() {
        this.pieceSize = this.engineFacade.heightAndWidth / 10;
    }


    getCustomPieceIcons(piece: Piece) {
        return JSON.parse(
            `{ "background-image": "url('${this.engineFacade.pieceIconManager.getPieceIcon(
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

    addPiece(
        pieceTypeInput: PieceTypeInput,
        colorInput: ColorInput,
        coords: string
    ) {
        this.engineFacade.addPiece(pieceTypeInput, colorInput, coords);
    }

}
