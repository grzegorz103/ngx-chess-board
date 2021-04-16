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
        this.isDragging = false;
        this.startTransition = '';
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
        this.isDragging = false;
        this.engineFacade.dragEndStrategy.process(event, this.engineFacade.moveDone, this.startTransition);
    }
    dragStart(event) {
        this.isDragging = true;
        let trans = event.source.getRootElement().style.transform.split(') ');
        //   this.startTrans= trans;
        this.startTransition = trans.length === 2 ? trans[1] : trans[0];
        this.engineFacade.dragStartStrategy.process(event);
    }
    onMouseDown(event) {
        this.engineFacade.onMouseDown(event, this.getClickPoint(event), this.boardRef.nativeElement.getBoundingClientRect().left, this.boardRef.nativeElement.getBoundingClientRect().top);
    }
    getClickPoint(event) {
        return ClickUtils.getClickPoint(event, this.boardRef.nativeElement.getBoundingClientRect().top, this.boardRef.nativeElement.getBoundingClientRect().height, this.boardRef.nativeElement.getBoundingClientRect().left, this.boardRef.nativeElement.getBoundingClientRect().width);
    }
    calculatePieceSize() {
        this.pieceSize = this.engineFacade.heightAndWidth / 8;
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
    dragMoved($event) {
        let x = ($event.pointerPosition.x - $event.source.getRootElement().parentElement.getBoundingClientRect().left) - (this.pieceSize / 2);
        let y = ($event.pointerPosition.y - $event.source.getRootElement().parentElement.getBoundingClientRect().top) - (this.pieceSize / 2);
        $event.source.getRootElement().style.transform = 'translate3d(' + x + 'px, '
            + (y) + 'px,0px)';
    }
}
NgxChessBoardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-chess-board',
                template: "<div\r\n    id=\"board\"\r\n    [style.height.px]=\"engineFacade.heightAndWidth\"\r\n    [style.width.px]=\"engineFacade.heightAndWidth\"\r\n    (pointerdown)=\"!modal.opened && onMouseDown($event)\"\r\n    (pointerup)=\"!modal.opened && onMouseUp($event)\"\r\n    #boardRef\r\n>\r\n    <div id=\"drag\">\r\n        <div\r\n            [cdkDragDisabled]=\"engineFacade.dragDisabled\"\r\n            (cdkDragEnded)=\"dragEnded($event)\"\r\n            (cdkDragMoved)=\"dragMoved($event)\"\r\n            (cdkDragStarted)=\"dragStart($event)\"\r\n            class=\"single-piece\" [innerHTML]=\"engineFacade.pieceIconManager.isDefaultIcons() ? piece.constant.icon : ''\"\r\n            [ngStyle]=\"engineFacade.pieceIconManager.isDefaultIcons() ? '' : getCustomPieceIcons(piece)\"\r\n            [style.transform]=\"'translate3d(' + piece.point.col * pieceSize + 'px, ' + piece.point.row * pieceSize + 'px,0px)'\"\r\n            [style.max-height]=\"pieceSize + 'px'\"\r\n            [style.font-size]=\"pieceSize * 0.8 + 'px'\"\r\n            [style.width]=\"pieceSize + 'px'\"\r\n            [style.height]=\"pieceSize + 'px'\"\r\n            cdkDrag\r\n            *ngFor=\"let piece of engineFacade.board.pieces; let i = index\"\r\n        >\r\n        </div>\r\n        <div\r\n            class=\"board-row\"\r\n            *ngFor=\"let row of engineFacade.board.board; let i = index\"\r\n        >\r\n            <div\r\n                class=\"board-col\"\r\n                [class.current-selection]=\"engineFacade.board.isXYInActiveMove(i,j)\"\r\n                [class.dest-move]=\"engineFacade.board.isXYInDestMove(i,j)\"\r\n                [class.king-check]=\" engineFacade.board.isKingChecked(engineFacade.board.getPieceByPoint(i,j))\"\r\n                [class.point-circle]=\"engineFacade.board.isXYInPointSelection(i, j)\"\r\n                [class.possible-capture]=\"engineFacade.board.isXYInPossibleCaptures(i, j)\"\r\n                [class.possible-point]=\"engineFacade.board.isXYInPossibleMoves(i, j)\"\r\n                [class.source-move]=\"engineFacade.board.isXYInSourceMove(i, j)\"\r\n                [style.background-color]=\"((i + j) % 2 === 0 ) ? lightTileColor : darkTileColor\"\r\n                *ngFor=\"let col of row; let j = index\"\r\n            >\r\n                <span\r\n                    class=\"yCoord\"\r\n                    [style.color]=\"(i % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && j === 7\"\r\n                >\r\n                    {{engineFacade.coords.yCoords[i]}}\r\n                </span>\r\n                <span\r\n                    class=\"xCoord\"\r\n                    [style.color]=\"(j % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && i === 7\"\r\n                >\r\n                    {{engineFacade.coords.xCoords[j]}}\r\n                </span>\r\n                <div\r\n                    *ngIf=\"engineFacade.board.getPieceByPoint(i, j) as piece\"\r\n                    style=\"height:100%; width:100%\"\r\n                >\r\n                    <div\r\n                        [ngClass]=\"'piece'\"\r\n                        [style.font-size]=\"pieceSize + 'px'\"\r\n\r\n                    >\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <svg\r\n        [attr.height]=\"engineFacade.heightAndWidth\"\r\n        [attr.width]=\"engineFacade.heightAndWidth\"\r\n        style=\"position:absolute; top:0; pointer-events: none\"\r\n    >\r\n        <defs *ngFor=\"let color of ['red', 'green', 'blue', 'orange']\">\r\n            <marker\r\n                [id]=\"color + 'Arrow'\"\r\n                markerHeight=\"13\"\r\n                markerWidth=\"13\"\r\n                orient=\"auto\"\r\n                refX=\"9\"\r\n                refY=\"6\"\r\n            >\r\n                <path\r\n                    [style.fill]=\"color\"\r\n                    d=\"M2,2 L2,11 L10,6 L2,2\"\r\n                ></path>\r\n            </marker>\r\n        </defs>\r\n        <line\r\n            class=\"arrow\"\r\n            [attr.marker-end]=\"'url(#' + arrow.end.color + 'Arrow)'\"\r\n            [attr.stroke]=\"arrow.end.color\"\r\n            [attr.x1]=\"arrow.start.x\"\r\n            [attr.x2]=\"arrow.end.x\"\r\n            [attr.y1]=\"arrow.start.y\"\r\n            [attr.y2]=\"arrow.end.y\"\r\n            *ngFor=\"let arrow of engineFacade.drawProvider.arrows$ | async\"\r\n        ></line>\r\n        <circle\r\n            [attr.cx]=\"circle.drawPoint.x\"\r\n            [attr.cy]=\"circle.drawPoint.y\"\r\n            [attr.r]=\"engineFacade.heightAndWidth / 18\"\r\n            [attr.stroke]=\"circle.drawPoint.color\"\r\n            *ngFor=\"let circle of engineFacade.drawProvider.circles$ | async\"\r\n            fill-opacity=\"0.0\"\r\n            stroke-width=\"2\"\r\n        ></circle>\r\n    </svg>\r\n    <app-piece-promotion-modal #modal></app-piece-promotion-modal>\r\n</div>\r\n",
                styles: ["@charset \"UTF-8\";#board{font-family:Courier New,serif;position:relative}.board-row{display:block;height:12.5%;position:relative;width:100%}.board-col{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece,.piece:after{box-sizing:border-box}.piece:after{content:\"\u200B\"}#drag{height:100%;width:100%}.possible-point{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture:hover,.possible-point:hover{opacity:.4}.possible-capture{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move{background-color:rgba(146,111,26,.79)!important}.dest-move{background-color:#b28e1a!important}.current-selection{background-color:#72620b!important}.yCoord{right:.2em}.xCoord,.yCoord{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord{bottom:0;left:.2em}.hovering{background-color:red!important}.arrow{stroke-width:2}svg{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}:host{display:inline-block!important}.single-piece{-moz-user-select:none;-webkit-user-select:none;color:#000!important;cursor:-webkit-grab;cursor:grab;justify-content:center;position:absolute;text-align:center;user-select:none;z-index:999}.single-piece:after{box-sizing:border-box;content:\"\u200B\"}.cdk-drag:not(.cdk-drag-dragging){transition:transform .2s cubic-bezier(0,.3,.14,.49)}"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBRUgsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUNILHdCQUF3QixFQUFFLFlBQVksR0FDekMsTUFBTSwyRkFBMkYsQ0FBQztBQUNuRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBR3RELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUl2QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFXOUMsTUFBTSxPQUFPLHNCQUFzQjtJQTJCL0IsWUFBb0Isb0JBQTBDO1FBQTFDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUF4QnJELGtCQUFhLEdBQUcsU0FBUyxDQUFDLHVCQUF1QixDQUFDO1FBQ2xELG1CQUFjLEdBQVcsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1FBQzVELGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDM0I7O1dBRUc7UUFDTyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUM1QyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUNyQyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQVEvQyxhQUFRLEdBQUcsS0FBSyxD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RyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNySSxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsY0FBYyxHQUFHLENBQUMsR0FBRyxNQUFNO2NBQ3RFLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQzFCLENBQUM7OztZQTNQSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsMmtLQUErQzs7YUFFbEQ7OztZQVhRLG9CQUFvQjs7OzRCQWV4QixLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFJTCxNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTt1QkFFTixTQUFTLFNBQUMsVUFBVTtvQkFFcEIsU0FBUyxTQUFDLE9BQU87bUJBbUJqQixLQUFLLFNBQUMsTUFBTTt1QkFlWixLQUFLLFNBQUMsVUFBVTsyQkFLaEIsS0FBSyxTQUFDLGNBQWM7MkJBS3BCLEtBQUssU0FBQyxjQUFjO3lCQUtwQixLQUFLLFNBQUMsWUFBWTs0QkFLbEIsS0FBSyxTQUFDLGVBQWU7MkJBS3JCLEtBQUssU0FBQyxjQUFjOzJCQUtwQixZQUFZLFNBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2RrRHJhZ0VuZCwgQ2RrRHJhZ01vdmUsIENka0RyYWdTdGFydCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xyXG5pbXBvcnQge1xyXG4gICAgQWZ0ZXJWaWV3SW5pdCxcclxuICAgIENvbXBvbmVudCxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBFdmVudEVtaXR0ZXIsXHJcbiAgICBIb3N0TGlzdGVuZXIsXHJcbiAgICBJbnB1dCxcclxuICAgIE9uQ2hhbmdlcyxcclxuICAgIE9uSW5pdCxcclxuICAgIE91dHB1dCxcclxuICAgIFNpbXBsZUNoYW5nZXMsXHJcbiAgICBWaWV3Q2hpbGQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFic3RyYWN0RW5naW5lRmFjYWRlIH0gZnJvbSAnLi9lbmdpbmUvYWJzdHJhY3QtZW5naW5lLWZhY2FkZSc7XHJcbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9lbmdpbmUvYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtbG9hZGVyL2JvYXJkLWxvYWRlcic7XHJcbmltcG9ydCB7XHJcbiAgICBOb3RhdGlvblByb2Nlc3NvckZhY3RvcnksIE5vdGF0aW9uVHlwZSxcclxufSBmcm9tICcuL2VuZ2luZS9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvbm90YXRpb24tcHJvY2Vzc29ycy9ub3RhdGlvbi1wcm9jZXNzb3ItZmFjdG9yeSc7XHJcbmltcG9ydCB7IENsaWNrVXRpbHMgfSBmcm9tICcuL2VuZ2luZS9jbGljay9jbGljay11dGlscyc7XHJcbmltcG9ydCB7IEVuZ2luZUZhY2FkZSB9IGZyb20gJy4vZW5naW5lL2VuZ2luZS1mYWNhZGUnO1xyXG5pbXBvcnQgeyBNb3ZlQ2hhbmdlIH0gZnJvbSAnLi9lbmdpbmUvb3V0cHV0cy9tb3ZlLWNoYW5nZS9tb3ZlLWNoYW5nZSc7XHJcbmltcG9ydCB7IEhpc3RvcnlNb3ZlIH0gZnJvbSAnLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlJztcclxuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuL21vZGVscy9ib2FyZCc7XHJcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL3BpZWNlJztcclxuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFZpZXcgfSBmcm9tICcuL25neC1jaGVzcy1ib2FyZC12aWV3JztcclxuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4vcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2Uvbmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0IH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtaWNvbi1pbnB1dCc7XHJcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0TWFuYWdlciB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLWljb24taW5wdXQtbWFuYWdlcic7XHJcbmltcG9ydCB7IENvbG9ySW5wdXQsIFBpZWNlVHlwZUlucHV0IH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtdHlwZS1pbnB1dCc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ25neC1jaGVzcy1ib2FyZCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL25neC1jaGVzcy1ib2FyZC5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4Q2hlc3NCb2FyZENvbXBvbmVudFxyXG4gICAgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgTmd4Q2hlc3NCb2FyZFZpZXcsIEFmdGVyVmlld0luaXQge1xyXG5cclxuICAgIEBJbnB1dCgpIGRhcmtUaWxlQ29sb3IgPSBDb25zdGFudHMuREVGQVVMVF9EQVJLX1RJTEVfQ09MT1I7XHJcbiAgICBASW5wdXQoKSBsaWdodFRpbGVDb2xvcjogc3RyaW5nID0gQ29uc3RhbnRzLkRFRkFVTFRfTElHSFRfVElMRV9DT0xPUjtcclxuICAgIEBJbnB1dCgpIHNob3dDb29yZHMgPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBFbmFibGluZyBmcmVlIG1vZGUgcmVtb3ZlcyB0dXJuLWJhc2VkIHJlc3RyaWN0aW9uIGFuZCBhbGxvd3MgdG8gbW92ZSBhbnkgcGllY2UgZnJlZWx5IVxyXG4gICAgICovXHJcbiAgICBAT3V0cHV0KCkgbW92ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TW92ZUNoYW5nZT4oKTtcclxuICAgIEBPdXRwdXQoKSBjaGVja21hdGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgICBAT3V0cHV0KCkgc3RhbGVtYXRlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICAgIEBWaWV3Q2hpbGQoJ2JvYXJkUmVmJylcclxuICAgIGJvYXJkUmVmOiBFbGVtZW50UmVmO1xyXG4gICAgQFZpZXdDaGlsZCgnbW9kYWwnKVxyXG4gICAgbW9kYWw6IFBpZWNlUHJvbW90aW9uTW9kYWxDb21wb25lbnQ7XHJcblxyXG4gICAgcGllY2VTaXplOiBudW1iZXI7XHJcbiAgICBzZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgYm9hcmRMb2FkZXI6IEJvYXJkTG9hZGVyO1xyXG4gICAgcGllY2VJY29uTWFuYWdlcjogUGllY2VJY29uSW5wdXRNYW5hZ2VyO1xyXG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgc3RhcnRUcmFuc2l0aW9uID0gJyc7XHJcblxyXG4gICAgZW5naW5lRmFjYWRlOiBBYnN0cmFjdEVuZ2luZUZhY2FkZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5neENoZXNzQm9hcmRTZXJ2aWNlOiBOZ3hDaGVzc0JvYXJkU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlID0gbmV3IEVuZ2luZUZhY2FkZShcclxuICAgICAgICAgICAgbmV3IEJvYXJkKCksXHJcbiAgICAgICAgICAgIHRoaXMubW92ZUNoYW5nZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCdzaXplJylcclxuICAgIHB1YmxpYyBzZXQgc2l6ZShzaXplOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHNpemUgJiZcclxuICAgICAgICAgICAgc2l6ZSA+PSBDb25zdGFudHMuTUlOX0JPQVJEX1NJWkUgJiZcclxuICAgICAgICAgICAgc2l6ZSA8PSBDb25zdGFudHMuTUFYX0JPQVJEX1NJWkVcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggPSBzaXplO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoID0gQ29uc3RhbnRzLkRFRkFVTFRfU0laRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQaWVjZVNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoJ2ZyZWVNb2RlJylcclxuICAgIHB1YmxpYyBzZXQgZnJlZU1vZGUoZnJlZU1vZGU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5mcmVlTW9kZSA9IGZyZWVNb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnZHJhZ0Rpc2FibGVkJylcclxuICAgIHB1YmxpYyBzZXQgZHJhZ0Rpc2FibGVkKGRyYWdEaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdEaXNhYmxlZCA9IGRyYWdEaXNhYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoJ2RyYXdEaXNhYmxlZCcpXHJcbiAgICBwdWJsaWMgc2V0IGRyYXdEaXNhYmxlZChkcmF3RGlzYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kcmF3RGlzYWJsZWQgPSBkcmF3RGlzYWJsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCdwaWVjZUljb25zJylcclxuICAgIHB1YmxpYyBzZXQgcGllY2VJY29ucyhwaWVjZUljb25zOiBQaWVjZUljb25JbnB1dCkge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnBpZWNlSWNvbk1hbmFnZXIucGllY2VJY29uSW5wdXQgPSBwaWVjZUljb25zO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnbGlnaHREaXNhYmxlZCcpXHJcbiAgICBwdWJsaWMgc2V0IGxpZ2h0RGlzYWJsZWQobGlnaHREaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmxpZ2h0RGlzYWJsZWQgPSBsaWdodERpc2FibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnZGFya0Rpc2FibGVkJylcclxuICAgIHB1YmxpYyBzZXQgZGFya0Rpc2FibGVkKGRhcmtEaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRhcmtEaXNhYmxlZCA9IGRhcmtEaXNhYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXHJcbiAgICBvblJpZ2h0Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIChjaGFuZ2VzLmxpZ2h0RGlzYWJsZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHREaXNhYmxlZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKSB8fFxyXG4gICAgICAgICAgICAoY2hhbmdlcy5kYXJrRGlzYWJsZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuZGFya0Rpc2FibGVkICYmXHJcbiAgICAgICAgICAgICAgICAhdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5uZ3hDaGVzc0JvYXJkU2VydmljZS5jb21wb25lbnRNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnJlc2V0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5tb2RhbCA9IHRoaXMubW9kYWw7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQaWVjZVNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5vbk1vdXNlVXAoXHJcbiAgICAgICAgICAgIGV2ZW50LFxyXG4gICAgICAgICAgICB0aGlzLmdldENsaWNrUG9pbnQoZXZlbnQpLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucmV2ZXJzZSgpO1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQm9hcmQoYm9hcmQ6IEJvYXJkKSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQgPSBib2FyZDtcclxuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyLnNldEVuZ2luZUZhY2FkZSh0aGlzLmVuZ2luZUZhY2FkZSk7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRGRU4oZmVuOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5zZXROb3RhdGlvblByb2Nlc3NvcihcclxuICAgICAgICAgICAgICAgIE5vdGF0aW9uUHJvY2Vzc29yRmFjdG9yeS5nZXRQcm9jZXNzb3IoTm90YXRpb25UeXBlLkZFTilcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIubG9hZEZFTihmZW4pO1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuY29vcmRzLnJlc2V0KCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRQR04ocGduOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5wZ25Qcm9jZXNzb3IucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIuc2V0Tm90YXRpb25Qcm9jZXNzb3IoXHJcbiAgICAgICAgICAgICAgICBOb3RhdGlvblByb2Nlc3NvckZhY3RvcnkuZ2V0UHJvY2Vzc29yKE5vdGF0aW9uVHlwZS5QR04pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmxvYWRQR04ocGduKTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXNldCgpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhleGNlcHRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RkVOKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLmZlbjtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnRW5kZWQoZXZlbnQ6IENka0RyYWdFbmQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kcmFnRW5kU3RyYXRlZ3kucHJvY2VzcyhcclxuICAgICAgICAgICAgZXZlbnQsXHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm1vdmVEb25lLFxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvblxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZ1N0YXJ0KGV2ZW50OiBDZGtEcmFnU3RhcnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIGxldCB0cmFucyA9IGV2ZW50LnNvdXJjZS5nZXRSb290RWxlbWVudCgpLnN0eWxlLnRyYW5zZm9ybS5zcGxpdCgnKSAnKTtcclxuICAgICAgICAvLyAgIHRoaXMuc3RhcnRUcmFucz0gdHJhbnM7XHJcbiAgICAgICAgdGhpcy5zdGFydFRyYW5zaXRpb24gPSB0cmFucy5sZW5ndGggPT09IDIgPyB0cmFuc1sxXSA6IHRyYW5zWzBdO1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdTdGFydFN0cmF0ZWd5LnByb2Nlc3MoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUub25Nb3VzZURvd24oZXZlbnQsIHRoaXMuZ2V0Q2xpY2tQb2ludChldmVudCksXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDbGlja1BvaW50KGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIENsaWNrVXRpbHMuZ2V0Q2xpY2tQb2ludChcclxuICAgICAgICAgICAgZXZlbnQsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FsY3VsYXRlUGllY2VTaXplKCkge1xyXG4gICAgICAgIHRoaXMucGllY2VTaXplID0gdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggLyA4O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRDdXN0b21QaWVjZUljb25zKHBpZWNlOiBQaWVjZSkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKFxyXG4gICAgICAgICAgICBgeyBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoJyR7dGhpcy5lbmdpbmVGYWNhZGUucGllY2VJY29uTWFuYWdlci5nZXRQaWVjZUljb24oXHJcbiAgICAgICAgICAgICAgICBwaWVjZVxyXG4gICAgICAgICAgICApfScpXCJ9YFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZShjb29yZHM6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm1vdmUoY29vcmRzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRNb3ZlSGlzdG9yeSgpOiBIaXN0b3J5TW92ZVtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmdpbmVGYWNhZGUuZ2V0TW92ZUhpc3RvcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVuZG8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUudW5kbygpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBpZWNlKFxyXG4gICAgICAgIHBpZWNlVHlwZUlucHV0OiBQaWVjZVR5cGVJbnB1dCxcclxuICAgICAgICBjb2xvcklucHV0OiBDb2xvcklucHV0LFxyXG4gICAgICAgIGNvb3Jkczogc3RyaW5nXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5hZGRQaWVjZShwaWVjZVR5cGVJbnB1dCwgY29sb3JJbnB1dCwgY29vcmRzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQR04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5naW5lRmFjYWRlLnBnblByb2Nlc3Nvci5nZXRQR04oKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnTW92ZWQoJGV2ZW50OiBDZGtEcmFnTW92ZTxhbnk+KSB7XHJcbiAgICAgICAgbGV0IHggPSAoJGV2ZW50LnBvaW50ZXJQb3NpdGlvbi54IC0gJGV2ZW50LnNvdXJjZS5nZXRSb290RWxlbWVudCgpLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkgLSAodGhpcy5waWVjZVNpemUgLyAyKTtcclxuICAgICAgICBsZXQgeSA9ICgkZXZlbnQucG9pbnRlclBvc2l0aW9uLnkgLSAkZXZlbnQuc291cmNlLmdldFJvb3RFbGVtZW50KCkucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApIC0gKHRoaXMucGllY2VTaXplIC8gMik7XHJcbiAgICAgICAgJGV2ZW50LnNvdXJjZS5nZXRSb290RWxlbWVudCgpLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgnICsgeCArICdweCwgJ1xyXG4gICAgICAgICAgICArICh5KSArICdweCwwcHgpJztcclxuICAgIH1cclxufVxyXG4iXX0=