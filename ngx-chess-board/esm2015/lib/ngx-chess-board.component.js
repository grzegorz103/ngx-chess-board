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
        this.pieceIconManager.pieceIconInput = pieceIcons;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBRUgsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUNILHdCQUF3QixFQUFFLFlBQVksR0FDekMsTUFBTSwyRkFBMkYsQ0FBQztBQUNuRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBR3RELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUl2QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFXOUMsTUFBTSxPQUFPLHNCQUFzQjtJQXlCL0IsWUFBb0Isb0JBQTBDO1FBQTFDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUF0QnJELGtCQUFhLEdBQUcsU0FBUyxDQUFDLHVCQUF1QixDQUFDO1FBQ2xELG1CQUFjLEdBQVcsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1FBQzVELGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDM0I7O1dBRUc7UUFDTyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUM1QyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUNyQyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQVEvQyxhQUFRLEdBQUcsS0FBSyxD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QUFzQixFQUN0QixNQUFjO1FBRWQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRSxDQUFDOzs7WUFwT0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLDRxSkFBK0M7O2FBRWxEOzs7WUFYUSxvQkFBb0I7Ozs0QkFleEIsS0FBSzs2QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBSUwsTUFBTTt3QkFDTixNQUFNO3dCQUNOLE1BQU07dUJBRU4sU0FBUyxTQUFDLFVBQVU7b0JBRXBCLFNBQVMsU0FBQyxPQUFPO21CQWlCakIsS0FBSyxTQUFDLE1BQU07dUJBZVosS0FBSyxTQUFDLFVBQVU7MkJBS2hCLEtBQUssU0FBQyxjQUFjOzJCQUtwQixLQUFLLFNBQUMsY0FBYzt5QkFLcEIsS0FBSyxTQUFDLFlBQVk7NEJBS2xCLEtBQUssU0FBQyxlQUFlOzJCQUtyQixLQUFLLFNBQUMsY0FBYzsyQkFLcEIsWUFBWSxTQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENka0RyYWdFbmQsIENka0RyYWdTdGFydCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuaW1wb3J0IHtcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENvbXBvbmVudCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgSW5wdXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RFbmdpbmVGYWNhZGUgfSBmcm9tICcuL2VuZ2luZS9hYnN0cmFjdC1lbmdpbmUtZmFjYWRlJztcbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9lbmdpbmUvYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtbG9hZGVyL2JvYXJkLWxvYWRlcic7XG5pbXBvcnQge1xuICAgIE5vdGF0aW9uUHJvY2Vzc29yRmFjdG9yeSwgTm90YXRpb25UeXBlLFxufSBmcm9tICcuL2VuZ2luZS9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvbm90YXRpb24tcHJvY2Vzc29ycy9ub3RhdGlvbi1wcm9jZXNzb3ItZmFjdG9yeSc7XG5pbXBvcnQgeyBDbGlja1V0aWxzIH0gZnJvbSAnLi9lbmdpbmUvY2xpY2svY2xpY2stdXRpbHMnO1xuaW1wb3J0IHsgRW5naW5lRmFjYWRlIH0gZnJvbSAnLi9lbmdpbmUvZW5naW5lLWZhY2FkZSc7XG5pbXBvcnQgeyBNb3ZlQ2hhbmdlIH0gZnJvbSAnLi9lbmdpbmUvbW92ZS1jaGFuZ2UvbW92ZS1jaGFuZ2UnO1xuaW1wb3J0IHsgSGlzdG9yeU1vdmUgfSBmcm9tICcuL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUnO1xuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuL21vZGVscy9ib2FyZCc7XG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9waWVjZSc7XG5pbXBvcnQgeyBOZ3hDaGVzc0JvYXJkVmlldyB9IGZyb20gJy4vbmd4LWNoZXNzLWJvYXJkLXZpZXcnO1xuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4vcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50JztcbmltcG9ydCB7IE5neENoZXNzQm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlL25neC1jaGVzcy1ib2FyZC5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnN0YW50cyB9IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0IH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtaWNvbi1pbnB1dCc7XG5pbXBvcnQgeyBQaWVjZUljb25JbnB1dE1hbmFnZXIgfSBmcm9tICcuL3V0aWxzL2lucHV0cy9waWVjZS1pY29uLWlucHV0LW1hbmFnZXInO1xuaW1wb3J0IHsgQ29sb3JJbnB1dCwgUGllY2VUeXBlSW5wdXQgfSBmcm9tICcuL3V0aWxzL2lucHV0cy9waWVjZS10eXBlLWlucHV0JztcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1jaGVzcy1ib2FyZCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL25neC1jaGVzcy1ib2FyZC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5zY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIE5neENoZXNzQm9hcmRDb21wb25lbnRcbiAgICBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBOZ3hDaGVzc0JvYXJkVmlldywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBASW5wdXQoKSBkYXJrVGlsZUNvbG9yID0gQ29uc3RhbnRzLkRFRkFVTFRfREFSS19USUxFX0NPTE9SO1xuICAgIEBJbnB1dCgpIGxpZ2h0VGlsZUNvbG9yOiBzdHJpbmcgPSBDb25zdGFudHMuREVGQVVMVF9MSUdIVF9USUxFX0NPTE9SO1xuICAgIEBJbnB1dCgpIHNob3dDb29yZHMgPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIEVuYWJsaW5nIGZyZWUgbW9kZSByZW1vdmVzIHR1cm4tYmFzZWQgcmVzdHJpY3Rpb24gYW5kIGFsbG93cyB0byBtb3ZlIGFueSBwaWVjZSBmcmVlbHkhXG4gICAgICovXG4gICAgQE91dHB1dCgpIG1vdmVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdmVDaGFuZ2U+KCk7XG4gICAgQE91dHB1dCgpIGNoZWNrbWF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgICBAT3V0cHV0KCkgc3RhbGVtYXRlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gICAgQFZpZXdDaGlsZCgnYm9hcmRSZWYnKVxuICAgIGJvYXJkUmVmOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ21vZGFsJylcbiAgICBtb2RhbDogUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudDtcblxuICAgIHBpZWNlU2l6ZTogbnVtYmVyO1xuICAgIHNlbGVjdGVkID0gZmFsc2U7XG4gICAgYm9hcmRMb2FkZXI6IEJvYXJkTG9hZGVyO1xuICAgIHBpZWNlSWNvbk1hbmFnZXI6IFBpZWNlSWNvbklucHV0TWFuYWdlcjtcblxuICAgIGVuZ2luZUZhY2FkZTogQWJzdHJhY3RFbmdpbmVGYWNhZGU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5neENoZXNzQm9hcmRTZXJ2aWNlOiBOZ3hDaGVzc0JvYXJkU2VydmljZSkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZSA9IG5ldyBFbmdpbmVGYWNhZGUoXG4gICAgICAgICAgICBuZXcgQm9hcmQoKSxcbiAgICAgICAgICAgIHRoaXMubW92ZUNoYW5nZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIEBJbnB1dCgnc2l6ZScpXG4gICAgcHVibGljIHNldCBzaXplKHNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzaXplICYmXG4gICAgICAgICAgICBzaXplID49IENvbnN0YW50cy5NSU5fQk9BUkRfU0laRSAmJlxuICAgICAgICAgICAgc2l6ZSA8PSBDb25zdGFudHMuTUFYX0JPQVJEX1NJWkVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aCA9IHNpemU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aCA9IENvbnN0YW50cy5ERUZBVUxUX1NJWkU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUGllY2VTaXplKCk7XG4gICAgfVxuXG4gICAgQElucHV0KCdmcmVlTW9kZScpXG4gICAgcHVibGljIHNldCBmcmVlTW9kZShmcmVlTW9kZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5mcmVlTW9kZSA9IGZyZWVNb2RlO1xuICAgIH1cblxuICAgIEBJbnB1dCgnZHJhZ0Rpc2FibGVkJylcbiAgICBwdWJsaWMgc2V0IGRyYWdEaXNhYmxlZChkcmFnRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhZ0Rpc2FibGVkID0gZHJhZ0Rpc2FibGVkO1xuICAgIH1cblxuICAgIEBJbnB1dCgnZHJhd0Rpc2FibGVkJylcbiAgICBwdWJsaWMgc2V0IGRyYXdEaXNhYmxlZChkcmF3RGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhd0Rpc2FibGVkID0gZHJhd0Rpc2FibGVkO1xuICAgIH1cblxuICAgIEBJbnB1dCgncGllY2VJY29ucycpXG4gICAgcHVibGljIHNldCBwaWVjZUljb25zKHBpZWNlSWNvbnM6IFBpZWNlSWNvbklucHV0KSB7XG4gICAgICAgIHRoaXMucGllY2VJY29uTWFuYWdlci5waWVjZUljb25JbnB1dCA9IHBpZWNlSWNvbnM7XG4gICAgfVxuXG4gICAgQElucHV0KCdsaWdodERpc2FibGVkJylcbiAgICBwdWJsaWMgc2V0IGxpZ2h0RGlzYWJsZWQobGlnaHREaXNhYmxlZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5saWdodERpc2FibGVkID0gbGlnaHREaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASW5wdXQoJ2RhcmtEaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBkYXJrRGlzYWJsZWQoZGFya0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRhcmtEaXNhYmxlZCA9IGRhcmtEaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gICAgb25SaWdodENsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAoY2hhbmdlcy5saWdodERpc2FibGVkICYmXG4gICAgICAgICAgICAgICAgdGhpcy5saWdodERpc2FibGVkICYmXG4gICAgICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKSB8fFxuICAgICAgICAgICAgKGNoYW5nZXMuZGFya0Rpc2FibGVkICYmXG4gICAgICAgICAgICAgICAgdGhpcy5kYXJrRGlzYWJsZWQgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm5neENoZXNzQm9hcmRTZXJ2aWNlLmNvbXBvbmVudE1ldGhvZENhbGxlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnJlc2V0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5tb2RhbCA9IHRoaXMubW9kYWw7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUGllY2VTaXplKCk7XG4gICAgfVxuXG4gICAgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm9uTW91c2VVcChcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5nZXRDbGlja1BvaW50KGV2ZW50KSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldmVyc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucmV2ZXJzZSgpO1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5jb29yZHMucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZUJvYXJkKGJvYXJkOiBCb2FyZCkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZCA9IGJvYXJkO1xuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyLnNldEVuZ2luZUZhY2FkZSh0aGlzLmVuZ2luZUZhY2FkZSk7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgIH1cblxuICAgIHNldEZFTihmZW46IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIuc2V0Tm90YXRpb25Qcm9jZXNzb3IoXG4gICAgICAgICAgICAgICAgTm90YXRpb25Qcm9jZXNzb3JGYWN0b3J5LmdldFByb2Nlc3NvcihOb3RhdGlvblR5cGUuRkVOKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmxvYWRGRU4oZmVuKTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXNldCgpO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0UEdOKHBnbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5zZXROb3RhdGlvblByb2Nlc3NvcihcbiAgICAgICAgICAgICAgICBOb3RhdGlvblByb2Nlc3NvckZhY3RvcnkuZ2V0UHJvY2Vzc29yKE5vdGF0aW9uVHlwZS5QR04pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIubG9hZFBHTihwZ24pO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuY29vcmRzLnJlc2V0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXhjZXB0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RkVOKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5mZW47XG4gICAgfVxuXG4gICAgZHJhZ0VuZGVkKGV2ZW50OiBDZGtEcmFnRW5kKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdFbmRTdHJhdGVneS5wcm9jZXNzKGV2ZW50KTtcbiAgICB9XG5cbiAgICBkcmFnU3RhcnQoZXZlbnQ6IENka0RyYWdTdGFydCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kcmFnU3RhcnRTdHJhdGVneS5wcm9jZXNzKGV2ZW50KTtcbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5vbk1vdXNlRG93bihldmVudCwgdGhpcy5nZXRDbGlja1BvaW50KGV2ZW50KSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldENsaWNrUG9pbnQoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIENsaWNrVXRpbHMuZ2V0Q2xpY2tQb2ludChcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlUGllY2VTaXplKCkge1xuICAgICAgICB0aGlzLnBpZWNlU2l6ZSA9IHRoaXMuZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoIC8gMTA7XG4gICAgfVxuXG5cbiAgICBnZXRDdXN0b21QaWVjZUljb25zKHBpZWNlOiBQaWVjZSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShcbiAgICAgICAgICAgIGB7IFwiYmFja2dyb3VuZC1pbWFnZVwiOiBcInVybCgnJHt0aGlzLmVuZ2luZUZhY2FkZS5waWVjZUljb25NYW5hZ2VyLmdldFBpZWNlSWNvbihcbiAgICAgICAgICAgICAgICBwaWVjZVxuICAgICAgICAgICAgKX0nKVwifWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBtb3ZlKGNvb3Jkczogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm1vdmUoY29vcmRzKTtcbiAgICB9XG5cbiAgICBnZXRNb3ZlSGlzdG9yeSgpOiBIaXN0b3J5TW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5naW5lRmFjYWRlLmdldE1vdmVIaXN0b3J5KCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgdW5kbygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUudW5kbygpO1xuICAgIH1cblxuICAgIGFkZFBpZWNlKFxuICAgICAgICBwaWVjZVR5cGVJbnB1dDogUGllY2VUeXBlSW5wdXQsXG4gICAgICAgIGNvbG9ySW5wdXQ6IENvbG9ySW5wdXQsXG4gICAgICAgIGNvb3Jkczogc3RyaW5nXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmFkZFBpZWNlKHBpZWNlVHlwZUlucHV0LCBjb2xvcklucHV0LCBjb29yZHMpO1xuICAgIH1cblxufVxuIl19