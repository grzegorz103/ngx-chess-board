import { Component, EventEmitter, HostListener, Input, Output, ViewChild, } from '@angular/core';
import { NotationProcessorFactory, NotationType, } from './engine/board-state-provider/board-loader/notation-processors/notation-processor-factory';
import { ClickUtils } from './engine/click/click-utils';
import { EngineFacade } from './engine/engine-facade';
import { Board } from './models/board';
import { NgxChessBoardService } from './service/ngx-chess-board.service';
import { Constants } from './utils/constants';
export class NgxChessBoardComponent {
    constructor(ngxChessBoardService) {
        this.ngxChessBoardService = ngxChessBoardService;
        this.darkTileColor = Constants.DEFAULT_DARK_TILE_COLOR;
        this.lightTileColor = Constants.DEFAULT_LIGHT_TILE_COLOR;
        this.showCoords = true;
        /**
         * Enabling free mode removes turn-based restriction and allows to move any piece freely!
         */
        this.moveChange = new EventEmitter();
        this.checkmate = new EventEmitter();
        this.stalemate = new EventEmitter();
        this.selected = false;
        this.engineFacade = new EngineFacade(new Board(), this.moveChange);
    }
    set size(size) {
        if (size &&
            size >= Constants.MIN_BOARD_SIZE &&
            size <= Constants.MAX_BOARD_SIZE) {
            this.engineFacade.heightAndWidth = size;
        }
        else {
            this.engineFacade.heightAndWidth = Constants.DEFAULT_SIZE;
        }
        this.engineFacade.drawProvider.clear();
        this.calculatePieceSize();
    }
    set freeMode(freeMode) {
        this.engineFacade.freeMode = freeMode;
    }
    set dragDisabled(dragDisabled) {
        this.engineFacade.dragDisabled = dragDisabled;
    }
    set drawDisabled(drawDisabled) {
        this.engineFacade.drawDisabled = drawDisabled;
    }
    set pieceIcons(pieceIcons) {
        this.engineFacade.pieceIconManager.pieceIconInput = pieceIcons;
    }
    set lightDisabled(lightDisabled) {
        this.engineFacade.lightDisabled = lightDisabled;
    }
    set darkDisabled(darkDisabled) {
        this.engineFacade.darkDisabled = darkDisabled;
    }
    onRightClick(event) {
        event.preventDefault();
    }
    ngOnChanges(changes) {
        if ((changes.lightDisabled &&
            this.lightDisabled &&
            this.engineFacade.board.currentWhitePlayer) ||
            (changes.darkDisabled &&
                this.darkDisabled &&
                !this.engineFacade.board.currentWhitePlayer)) {
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
        }
    }
    ngOnInit() {
        this.ngxChessBoardService.componentMethodCalled$.subscribe(() => {
            this.engineFacade.reset();
        });
    }
    ngAfterViewInit() {
        this.engineFacade.modal = this.modal;
        this.calculatePieceSize();
    }
    onMouseUp(event) {
        this.engineFacade.onMouseUp(event, this.getClickPoint(event), this.boardRef.nativeElement.getBoundingClientRect().left, this.boardRef.nativeElement.getBoundingClientRect().top);
    }
    reverse() {
        this.selected = false;
        this.engineFacade.board.reverse();
        this.engineFacade.coords.reverse();
    }
    updateBoard(board) {
        this.engineFacade.board = board;
        this.boardLoader.setEngineFacade(this.engineFacade);
        this.engineFacade.board.possibleCaptures = [];
        this.engineFacade.board.possibleMoves = [];
    }
    setFEN(fen) {
        try {
            this.engineFacade.boardLoader.setNotationProcessor(NotationProcessorFactory.getProcessor(NotationType.FEN));
            this.engineFacade.boardLoader.loadFEN(fen);
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
            this.engineFacade.coords.reset();
        }
        catch (exception) {
            this.engineFacade.boardLoader.addPieces();
        }
    }
    setPGN(pgn) {
        try {
            this.engineFacade.pgnProcessor.reset();
            this.engineFacade.boardLoader.setNotationProcessor(NotationProcessorFactory.getProcessor(NotationType.PGN));
            this.engineFacade.boardLoader.loadPGN(pgn);
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
            this.engineFacade.coords.reset();
        }
        catch (exception) {
            console.log(exception);
            this.engineFacade.boardLoader.addPieces();
        }
    }
    getFEN() {
        return this.engineFacade.board.fen;
    }
    dragEnded(event) {
        this.engineFacade.dragEndStrategy.process(event);
    }
    dragStart(event) {
        this.engineFacade.dragStartStrategy.process(event);
    }
    onMouseDown(event) {
        this.engineFacade.onMouseDown(event, this.getClickPoint(event), this.boardRef.nativeElement.getBoundingClientRect().left, this.boardRef.nativeElement.getBoundingClientRect().top);
    }
    getClickPoint(event) {
        return ClickUtils.getClickPoint(event, this.boardRef.nativeElement.getBoundingClientRect().top, this.boardRef.nativeElement.getBoundingClientRect().height, this.boardRef.nativeElement.getBoundingClientRect().left, this.boardRef.nativeElement.getBoundingClientRect().width);
    }
    calculatePieceSize() {
        this.pieceSize = this.engineFacade.heightAndWidth / 10;
    }
    getCustomPieceIcons(piece) {
        return JSON.parse(`{ "background-image": "url('${this.engineFacade.pieceIconManager.getPieceIcon(piece)}')"}`);
    }
    move(coords) {
        this.engineFacade.move(coords);
    }
    getMoveHistory() {
        return this.engineFacade.getMoveHistory();
    }
    reset() {
        this.engineFacade.reset();
    }
    undo() {
        this.engineFacade.undo();
    }
    addPiece(pieceTypeInput, colorInput, coords) {
        this.engineFacade.addPiece(pieceTypeInput, colorInput, coords);
    }
    getPGN() {
        return this.engineFacade.pgnProcessor.getPGN();
    }
}
NgxChessBoardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-chess-board',
                template: "<div\r\n    id=\"board\"\r\n    [style.height.px]=\"engineFacade.heightAndWidth\"\r\n    [style.width.px]=\"engineFacade.heightAndWidth\"\r\n    (pointerdown)=\"!modal.opened && onMouseDown($event)\"\r\n    (pointerup)=\"!modal.opened && onMouseUp($event)\"\r\n    #boardRef\r\n>\r\n    <div id=\"drag\">\r\n        <div\r\n            class=\"board-row\"\r\n            *ngFor=\"let row of engineFacade.board.board; let i = index\"\r\n        >\r\n            <div\r\n                class=\"board-col\"\r\n                [class.current-selection]=\"engineFacade.board.isXYInActiveMove(i,j)\"\r\n                [class.dest-move]=\"engineFacade.board.isXYInDestMove(i,j)\"\r\n                [class.king-check]=\" engineFacade.board.isKingChecked(engineFacade.board.getPieceByPoint(i,j))\"\r\n                [class.point-circle]=\"engineFacade.board.isXYInPointSelection(i, j)\"\r\n                [class.possible-capture]=\"engineFacade.board.isXYInPossibleCaptures(i, j)\"\r\n                [class.possible-point]=\"engineFacade.board.isXYInPossibleMoves(i, j)\"\r\n                [class.source-move]=\"engineFacade.board.isXYInSourceMove(i, j)\"\r\n                [style.background-color]=\"((i + j) % 2 === 0 ) ? lightTileColor : darkTileColor\"\r\n                *ngFor=\"let col of row; let j = index\"\r\n            >\r\n                <span\r\n                    class=\"yCoord\"\r\n                    [style.color]=\"(i % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && j === 7\"\r\n                >\r\n                    {{engineFacade.coords.yCoords[i]}}\r\n                </span>\r\n                <span\r\n                    class=\"xCoord\"\r\n                    [style.color]=\"(j % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && i === 7\"\r\n                >\r\n                    {{engineFacade.coords.xCoords[j]}}\r\n                </span>\r\n                <div\r\n                    *ngIf=\"engineFacade.board.getPieceByPoint(i, j) as piece\"\r\n                    style=\"height:100%; width:100%\"\r\n                >\r\n                    <div\r\n                        [cdkDragDisabled]=\"engineFacade.dragDisabled\"\r\n                        [innerHTML]=\"engineFacade.pieceIconManager.isDefaultIcons() ? engineFacade.board.getPieceByPoint(i,j).constant.icon : ''\"\r\n                        [ngClass]=\"'piece'\"\r\n                        [style.font-size]=\"pieceSize + 'px'\"\r\n                        [ngStyle]=\"engineFacade.pieceIconManager.isDefaultIcons() ? '' : getCustomPieceIcons(engineFacade.board.getPieceByPoint(i,j))\"\r\n                        (cdkDragEnded)=\"dragEnded($event)\"\r\n                        (cdkDragStarted)=\"dragStart($event)\"\r\n                        cdkDrag\r\n                    >\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <svg\r\n        [attr.height]=\"engineFacade.heightAndWidth\"\r\n        [attr.width]=\"engineFacade.heightAndWidth\"\r\n        style=\"position:absolute; top:0; pointer-events: none\"\r\n    >\r\n        <defs *ngFor=\"let color of ['red', 'green', 'blue', 'orange']\">\r\n            <marker\r\n                [id]=\"color + 'Arrow'\"\r\n                markerHeight=\"13\"\r\n                markerWidth=\"13\"\r\n                orient=\"auto\"\r\n                refX=\"9\"\r\n                refY=\"6\"\r\n            >\r\n                <path\r\n                    [style.fill]=\"color\"\r\n                    d=\"M2,2 L2,11 L10,6 L2,2\"\r\n                ></path>\r\n            </marker>\r\n        </defs>\r\n        <line\r\n            class=\"arrow\"\r\n            [attr.marker-end]=\"'url(#' + arrow.end.color + 'Arrow)'\"\r\n            [attr.stroke]=\"arrow.end.color\"\r\n            [attr.x1]=\"arrow.start.x\"\r\n            [attr.x2]=\"arrow.end.x\"\r\n            [attr.y1]=\"arrow.start.y\"\r\n            [attr.y2]=\"arrow.end.y\"\r\n            *ngFor=\"let arrow of engineFacade.drawProvider.arrows$ | async\"\r\n        ></line>\r\n        <circle\r\n            [attr.cx]=\"circle.drawPoint.x\"\r\n            [attr.cy]=\"circle.drawPoint.y\"\r\n            [attr.r]=\"engineFacade.heightAndWidth / 18\"\r\n            [attr.stroke]=\"circle.drawPoint.color\"\r\n            *ngFor=\"let circle of engineFacade.drawProvider.circles$ | async\"\r\n            fill-opacity=\"0.0\"\r\n            stroke-width=\"2\"\r\n        ></circle>\r\n    </svg>\r\n    <app-piece-promotion-modal #modal></app-piece-promotion-modal>\r\n</div>\r\n",
                styles: ["@charset \"UTF-8\";#board{font-family:Courier New,serif;position:relative}.board-row{display:block;height:12.5%;position:relative;width:100%}.board-col{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece,.piece:after{box-sizing:border-box}.piece:after{content:\"\u200B\"}#drag{height:100%;width:100%}.possible-point{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture:hover,.possible-point:hover{opacity:.4}.possible-capture{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move{background-color:rgba(146,111,26,.79)!important}.dest-move{background-color:#b28e1a!important}.current-selection{background-color:#72620b!important}.yCoord{right:.2em}.xCoord,.yCoord{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord{bottom:0;left:.2em}.hovering{background-color:red!important}.arrow{stroke-width:2}svg{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}:host{display:inline-block!important}"]
            },] }
];
NgxChessBoardComponent.ctorParameters = () => [
    { type: NgxChessBoardService }
];
NgxChessBoardComponent.propDecorators = {
    darkTileColor: [{ type: Input }],
    lightTileColor: [{ type: Input }],
    showCoords: [{ type: Input }],
    moveChange: [{ type: Output }],
    checkmate: [{ type: Output }],
    stalemate: [{ type: Output }],
    boardRef: [{ type: ViewChild, args: ['boardRef',] }],
    modal: [{ type: ViewChild, args: ['modal',] }],
    size: [{ type: Input, args: ['size',] }],
    freeMode: [{ type: Input, args: ['freeMode',] }],
    dragDisabled: [{ type: Input, args: ['dragDisabled',] }],
    drawDisabled: [{ type: Input, args: ['drawDisabled',] }],
    pieceIcons: [{ type: Input, args: ['pieceIcons',] }],
    lightDisabled: [{ type: Input, args: ['lightDisabled',] }],
    darkDisabled: [{ type: Input, args: ['darkDisabled',] }],
    onRightClick: [{ type: HostListener, args: ['contextmenu', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBRUgsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUNILHdCQUF3QixFQUFFLFlBQVksR0FDekMsTUFBTSwyRkFBMkYsQ0FBQztBQUNuRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBR3RELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUl2QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFXOUMsTUFBTSxPQUFPLHNCQUFzQjtJQXlCL0IsWUFBb0Isb0JBQTBDO1FBQTFDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUF0QnJELGtCQUFhLEdBQUcsU0FBUyxDQUFDLHVCQUF1QixDQUFDO1FBQ2xELG1CQUFjLEdBQVcsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1FBQzVELGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDM0I7O1dBRUc7UUFDTyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUM1QyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUNyQyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQVEvQyxhQUFRLEdBQUcsS0FBSyxD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WSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxRQUFRLENBQ0osY0FBOEIsRUFDOUIsVUFBc0IsRUFDdEIsTUFBYztRQUVkLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ25ELENBQUM7OztZQXpPSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsNHFKQUErQzs7YUFFbEQ7OztZQVhRLG9CQUFvQjs7OzRCQWV4QixLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFJTCxNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTt1QkFFTixTQUFTLFNBQUMsVUFBVTtvQkFFcEIsU0FBUyxTQUFDLE9BQU87bUJBaUJqQixLQUFLLFNBQUMsTUFBTTt1QkFlWixLQUFLLFNBQUMsVUFBVTsyQkFLaEIsS0FBSyxTQUFDLGNBQWM7MkJBS3BCLEtBQUssU0FBQyxjQUFjO3lCQUtwQixLQUFLLFNBQUMsWUFBWTs0QkFLbEIsS0FBSyxTQUFDLGVBQWU7MkJBS3JCLEtBQUssU0FBQyxjQUFjOzJCQUtwQixZQUFZLFNBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2RrRHJhZ0VuZCwgQ2RrRHJhZ1N0YXJ0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XG5pbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbnB1dCxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdEVuZ2luZUZhY2FkZSB9IGZyb20gJy4vZW5naW5lL2Fic3RyYWN0LWVuZ2luZS1mYWNhZGUnO1xuaW1wb3J0IHsgQm9hcmRMb2FkZXIgfSBmcm9tICcuL2VuZ2luZS9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvYm9hcmQtbG9hZGVyJztcbmltcG9ydCB7XG4gICAgTm90YXRpb25Qcm9jZXNzb3JGYWN0b3J5LCBOb3RhdGlvblR5cGUsXG59IGZyb20gJy4vZW5naW5lL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLWxvYWRlci9ub3RhdGlvbi1wcm9jZXNzb3JzL25vdGF0aW9uLXByb2Nlc3Nvci1mYWN0b3J5JztcbmltcG9ydCB7IENsaWNrVXRpbHMgfSBmcm9tICcuL2VuZ2luZS9jbGljay9jbGljay11dGlscyc7XG5pbXBvcnQgeyBFbmdpbmVGYWNhZGUgfSBmcm9tICcuL2VuZ2luZS9lbmdpbmUtZmFjYWRlJztcbmltcG9ydCB7IE1vdmVDaGFuZ2UgfSBmcm9tICcuL2VuZ2luZS9vdXRwdXRzL21vdmUtY2hhbmdlL21vdmUtY2hhbmdlJztcbmltcG9ydCB7IEhpc3RvcnlNb3ZlIH0gZnJvbSAnLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlJztcbmltcG9ydCB7IEJvYXJkIH0gZnJvbSAnLi9tb2RlbHMvYm9hcmQnO1xuaW1wb3J0IHsgUGllY2UgfSBmcm9tICcuL21vZGVscy9waWVjZXMvcGllY2UnO1xuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFZpZXcgfSBmcm9tICcuL25neC1jaGVzcy1ib2FyZC12aWV3JztcbmltcG9ydCB7IFBpZWNlUHJvbW90aW9uTW9kYWxDb21wb25lbnQgfSBmcm9tICcuL3BpZWNlLXByb21vdGlvbi9waWVjZS1wcm9tb3Rpb24tbW9kYWwvcGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hDaGVzc0JvYXJkU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9uZ3gtY2hlc3MtYm9hcmQuc2VydmljZSc7XG5pbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBQaWVjZUljb25JbnB1dCB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLWljb24taW5wdXQnO1xuaW1wb3J0IHsgUGllY2VJY29uSW5wdXRNYW5hZ2VyIH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtaWNvbi1pbnB1dC1tYW5hZ2VyJztcbmltcG9ydCB7IENvbG9ySW5wdXQsIFBpZWNlVHlwZUlucHV0IH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtdHlwZS1pbnB1dCc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hlc3MtYm9hcmQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL25neC1jaGVzcy1ib2FyZC5jb21wb25lbnQuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hDaGVzc0JvYXJkQ29tcG9uZW50XG4gICAgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgTmd4Q2hlc3NCb2FyZFZpZXcsIEFmdGVyVmlld0luaXQge1xuXG4gICAgQElucHV0KCkgZGFya1RpbGVDb2xvciA9IENvbnN0YW50cy5ERUZBVUxUX0RBUktfVElMRV9DT0xPUjtcbiAgICBASW5wdXQoKSBsaWdodFRpbGVDb2xvcjogc3RyaW5nID0gQ29uc3RhbnRzLkRFRkFVTFRfTElHSFRfVElMRV9DT0xPUjtcbiAgICBASW5wdXQoKSBzaG93Q29vcmRzID0gdHJ1ZTtcbiAgICAvKipcbiAgICAgKiBFbmFibGluZyBmcmVlIG1vZGUgcmVtb3ZlcyB0dXJuLWJhc2VkIHJlc3RyaWN0aW9uIGFuZCBhbGxvd3MgdG8gbW92ZSBhbnkgcGllY2UgZnJlZWx5IVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBtb3ZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNb3ZlQ2hhbmdlPigpO1xuICAgIEBPdXRwdXQoKSBjaGVja21hdGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gICAgQE91dHB1dCgpIHN0YWxlbWF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2JvYXJkUmVmJylcbiAgICBib2FyZFJlZjogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdtb2RhbCcpXG4gICAgbW9kYWw6IFBpZWNlUHJvbW90aW9uTW9kYWxDb21wb25lbnQ7XG5cbiAgICBwaWVjZVNpemU6IG51bWJlcjtcbiAgICBzZWxlY3RlZCA9IGZhbHNlO1xuICAgIGJvYXJkTG9hZGVyOiBCb2FyZExvYWRlcjtcbiAgICBwaWVjZUljb25NYW5hZ2VyOiBQaWVjZUljb25JbnB1dE1hbmFnZXI7XG5cbiAgICBlbmdpbmVGYWNhZGU6IEFic3RyYWN0RW5naW5lRmFjYWRlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hDaGVzc0JvYXJkU2VydmljZTogTmd4Q2hlc3NCb2FyZFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUgPSBuZXcgRW5naW5lRmFjYWRlKFxuICAgICAgICAgICAgbmV3IEJvYXJkKCksXG4gICAgICAgICAgICB0aGlzLm1vdmVDaGFuZ2VcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBASW5wdXQoJ3NpemUnKVxuICAgIHB1YmxpYyBzZXQgc2l6ZShzaXplOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2l6ZSAmJlxuICAgICAgICAgICAgc2l6ZSA+PSBDb25zdGFudHMuTUlOX0JPQVJEX1NJWkUgJiZcbiAgICAgICAgICAgIHNpemUgPD0gQ29uc3RhbnRzLk1BWF9CT0FSRF9TSVpFXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggPSBzaXplO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggPSBDb25zdGFudHMuREVGQVVMVF9TSVpFO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYXdQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBpZWNlU2l6ZSgpO1xuICAgIH1cblxuICAgIEBJbnB1dCgnZnJlZU1vZGUnKVxuICAgIHB1YmxpYyBzZXQgZnJlZU1vZGUoZnJlZU1vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZnJlZU1vZGUgPSBmcmVlTW9kZTtcbiAgICB9XG5cbiAgICBASW5wdXQoJ2RyYWdEaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBkcmFnRGlzYWJsZWQoZHJhZ0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdEaXNhYmxlZCA9IGRyYWdEaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASW5wdXQoJ2RyYXdEaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBkcmF3RGlzYWJsZWQoZHJhd0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYXdEaXNhYmxlZCA9IGRyYXdEaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASW5wdXQoJ3BpZWNlSWNvbnMnKVxuICAgIHB1YmxpYyBzZXQgcGllY2VJY29ucyhwaWVjZUljb25zOiBQaWVjZUljb25JbnB1dCkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5waWVjZUljb25NYW5hZ2VyLnBpZWNlSWNvbklucHV0ID0gcGllY2VJY29ucztcbiAgICB9XG5cbiAgICBASW5wdXQoJ2xpZ2h0RGlzYWJsZWQnKVxuICAgIHB1YmxpYyBzZXQgbGlnaHREaXNhYmxlZChsaWdodERpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmxpZ2h0RGlzYWJsZWQgPSBsaWdodERpc2FibGVkO1xuICAgIH1cblxuICAgIEBJbnB1dCgnZGFya0Rpc2FibGVkJylcbiAgICBwdWJsaWMgc2V0IGRhcmtEaXNhYmxlZChkYXJrRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZGFya0Rpc2FibGVkID0gZGFya0Rpc2FibGVkO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgWyckZXZlbnQnXSlcbiAgICBvblJpZ2h0Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIChjaGFuZ2VzLmxpZ2h0RGlzYWJsZWQgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmxpZ2h0RGlzYWJsZWQgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIpIHx8XG4gICAgICAgICAgICAoY2hhbmdlcy5kYXJrRGlzYWJsZWQgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmRhcmtEaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgICF0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5jdXJyZW50V2hpdGVQbGF5ZXIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMubmd4Q2hlc3NCb2FyZFNlcnZpY2UuY29tcG9uZW50TWV0aG9kQ2FsbGVkJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUucmVzZXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm1vZGFsID0gdGhpcy5tb2RhbDtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQaWVjZVNpemUoKTtcbiAgICB9XG5cbiAgICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUub25Nb3VzZVVwKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmdldENsaWNrUG9pbnQoZXZlbnQpLFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmV2ZXJzZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5yZXZlcnNlKCk7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQm9hcmQoYm9hcmQ6IEJvYXJkKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkID0gYm9hcmQ7XG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuc2V0RW5naW5lRmFjYWRlKHRoaXMuZW5naW5lRmFjYWRlKTtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XG4gICAgfVxuXG4gICAgc2V0RkVOKGZlbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5zZXROb3RhdGlvblByb2Nlc3NvcihcbiAgICAgICAgICAgICAgICBOb3RhdGlvblByb2Nlc3NvckZhY3RvcnkuZ2V0UHJvY2Vzc29yKE5vdGF0aW9uVHlwZS5GRU4pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIubG9hZEZFTihmZW4pO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuY29vcmRzLnJlc2V0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIuYWRkUGllY2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRQR04ocGduOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnBnblByb2Nlc3Nvci5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIuc2V0Tm90YXRpb25Qcm9jZXNzb3IoXG4gICAgICAgICAgICAgICAgTm90YXRpb25Qcm9jZXNzb3JGYWN0b3J5LmdldFByb2Nlc3NvcihOb3RhdGlvblR5cGUuUEdOKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmxvYWRQR04ocGduKTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXNldCgpO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4Y2VwdGlvbik7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEZFTigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuZmVuO1xuICAgIH1cblxuICAgIGRyYWdFbmRlZChldmVudDogQ2RrRHJhZ0VuZCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kcmFnRW5kU3RyYXRlZ3kucHJvY2VzcyhldmVudCk7XG4gICAgfVxuXG4gICAgZHJhZ1N0YXJ0KGV2ZW50OiBDZGtEcmFnU3RhcnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhZ1N0YXJ0U3RyYXRlZ3kucHJvY2VzcyhldmVudCk7XG4gICAgfVxuXG4gICAgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUub25Nb3VzZURvd24oZXZlbnQsIHRoaXMuZ2V0Q2xpY2tQb2ludChldmVudCksXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXRDbGlja1BvaW50KGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBDbGlja1V0aWxzLmdldENsaWNrUG9pbnQoXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZVBpZWNlU2l6ZSgpIHtcbiAgICAgICAgdGhpcy5waWVjZVNpemUgPSB0aGlzLmVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aCAvIDEwO1xuICAgIH1cblxuXG4gICAgZ2V0Q3VzdG9tUGllY2VJY29ucyhwaWVjZTogUGllY2UpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoXG4gICAgICAgICAgICBgeyBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoJyR7dGhpcy5lbmdpbmVGYWNhZGUucGllY2VJY29uTWFuYWdlci5nZXRQaWVjZUljb24oXG4gICAgICAgICAgICAgICAgcGllY2VcbiAgICAgICAgICAgICl9JylcIn1gXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgbW92ZShjb29yZHM6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5tb3ZlKGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgZ2V0TW92ZUhpc3RvcnkoKTogSGlzdG9yeU1vdmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZUZhY2FkZS5nZXRNb3ZlSGlzdG9yeSgpO1xuICAgIH1cblxuICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5yZXNldCgpO1xuICAgIH1cblxuICAgIHVuZG8oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnVuZG8oKTtcbiAgICB9XG5cbiAgICBhZGRQaWVjZShcbiAgICAgICAgcGllY2VUeXBlSW5wdXQ6IFBpZWNlVHlwZUlucHV0LFxuICAgICAgICBjb2xvcklucHV0OiBDb2xvcklucHV0LFxuICAgICAgICBjb29yZHM6IHN0cmluZ1xuICAgICkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5hZGRQaWVjZShwaWVjZVR5cGVJbnB1dCwgY29sb3JJbnB1dCwgY29vcmRzKTtcbiAgICB9XG5cbiAgICBnZXRQR04oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZUZhY2FkZS5wZ25Qcm9jZXNzb3IuZ2V0UEdOKCk7XG4gICAgfVxufVxuIl19