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
        this.sourcePointColor = Constants.DEFAULT_SOURCE_POINT_COLOR;
        this.destinationPointColor = Constants.DEFAULT_DESTINATION_POINT_COLOR;
        this.legalMovesPointColor = Constants.DEFAULT_LEGAL_MOVE_POINT_COLOR;
        this.showLastMove = true;
        this.showLegalMoves = true;
        this.showActivePiece = true;
        this.showPossibleCaptures = true;
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
    getTileBackgroundColor(i, j) {
        let color = ((i + j) % 2 === 0) ? this.lightTileColor : this.darkTileColor;
        if (this.showLastMove) {
            if (this.engineFacade.board.isXYInSourceMove(i, j)) {
                color = this.sourcePointColor;
            }
            if (this.engineFacade.board.isXYInDestMove(i, j)) {
                color = this.destinationPointColor;
            }
        }
        return color;
    }
}
NgxChessBoardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-chess-board',
                template: "<div\n    id=\"board\"\n    [style.height.px]=\"engineFacade.heightAndWidth\"\n    [style.width.px]=\"engineFacade.heightAndWidth\"\n    (pointerdown)=\"!modal.opened && onMouseDown($event)\"\n    (pointerup)=\"!modal.opened && onMouseUp($event)\"\n    #boardRef\n>\n    <div id=\"drag\">\n        <div\n            [cdkDragDisabled]=\"engineFacade.dragDisabled\"\n            (cdkDragEnded)=\"dragEnded($event)\"\n            (cdkDragMoved)=\"dragMoved($event)\"\n            (cdkDragStarted)=\"dragStart($event)\"\n            class=\"single-piece\" [innerHTML]=\"engineFacade.pieceIconManager.isDefaultIcons() ? piece.constant.icon : ''\"\n            [ngStyle]=\"engineFacade.pieceIconManager.isDefaultIcons() ? '' : getCustomPieceIcons(piece)\"\n            [style.transform]=\"'translate3d(' + piece.point.col * pieceSize + 'px, ' + piece.point.row * pieceSize + 'px,0px)'\"\n            [style.max-height]=\"pieceSize + 'px'\"\n            [style.font-size]=\"pieceSize * 0.8 + 'px'\"\n            [style.width]=\"pieceSize + 'px'\"\n            [style.height]=\"pieceSize + 'px'\"\n            cdkDrag\n            *ngFor=\"let piece of engineFacade.board.pieces; let i = index\"\n        >\n        </div>\n        <div\n            class=\"board-row\"\n            *ngFor=\"let row of engineFacade.board.board; let i = index\"\n        >\n            <div\n                class=\"board-col\"\n                [class.current-selection]=\"showActivePiece && engineFacade.board.isXYInActiveMove(i,j)\"\n                [class.king-check]=\" engineFacade.board.isKingChecked(engineFacade.board.getPieceByPoint(i,j))\"\n                [class.point-circle]=\"engineFacade.board.isXYInPointSelection(i, j)\"\n                [class.possible-capture]=\"showPossibleCaptures && engineFacade.board.isXYInPossibleCaptures(i, j)\"\n                [class.possible-point]=\"engineFacade.board.isXYInPossibleMoves(i, j) && showLegalMoves\"\n                [style.background-color]=\"getTileBackgroundColor(i, j)\"\n                *ngFor=\"let col of row; let j = index\"\n            >\n                <span\n                    class=\"yCoord\"\n                    [style.color]=\"(i % 2 === 0) ? lightTileColor : darkTileColor\"\n                    [style.font-size.px]=\"pieceSize / 4\"\n                    *ngIf=\"showCoords && j === 7\"\n                >\n                    {{engineFacade.coords.yCoords[i]}}\n                </span>\n                <span\n                    class=\"xCoord\"\n                    [style.color]=\"(j % 2 === 0) ? lightTileColor : darkTileColor\"\n                    [style.font-size.px]=\"pieceSize / 4\"\n                    *ngIf=\"showCoords && i === 7\"\n                >\n                    {{engineFacade.coords.xCoords[j]}}\n                </span>\n                <div\n                    *ngIf=\"engineFacade.board.getPieceByPoint(i, j) as piece\"\n                    style=\"height:100%; width:100%\"\n                >\n                    <div\n                        [ngClass]=\"'piece'\"\n                        [style.font-size]=\"pieceSize + 'px'\"\n\n                    >\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <svg\n        [attr.height]=\"engineFacade.heightAndWidth\"\n        [attr.width]=\"engineFacade.heightAndWidth\"\n        style=\"position:absolute; top:0; pointer-events: none\"\n    >\n        <defs *ngFor=\"let color of ['red', 'green', 'blue', 'orange']\">\n            <marker\n                [id]=\"color + 'Arrow'\"\n                markerHeight=\"13\"\n                markerWidth=\"13\"\n                orient=\"auto\"\n                refX=\"9\"\n                refY=\"6\"\n            >\n                <path\n                    [style.fill]=\"color\"\n                    d=\"M2,2 L2,11 L10,6 L2,2\"\n                ></path>\n            </marker>\n        </defs>\n        <line\n            class=\"arrow\"\n            [attr.marker-end]=\"'url(#' + arrow.end.color + 'Arrow)'\"\n            [attr.stroke]=\"arrow.end.color\"\n            [attr.x1]=\"arrow.start.x\"\n            [attr.x2]=\"arrow.end.x\"\n            [attr.y1]=\"arrow.start.y\"\n            [attr.y2]=\"arrow.end.y\"\n            *ngFor=\"let arrow of engineFacade.drawProvider.arrows$ | async\"\n        ></line>\n        <circle\n            [attr.cx]=\"circle.drawPoint.x\"\n            [attr.cy]=\"circle.drawPoint.y\"\n            [attr.r]=\"engineFacade.heightAndWidth / 18\"\n            [attr.stroke]=\"circle.drawPoint.color\"\n            *ngFor=\"let circle of engineFacade.drawProvider.circles$ | async\"\n            fill-opacity=\"0.0\"\n            stroke-width=\"2\"\n        ></circle>\n    </svg>\n    <app-piece-promotion-modal #modal\n                               [pieceIconInput]=\"engineFacade.pieceIconManager.pieceIconInput\"\n                               [color]=\"engineFacade.board.getCurrentPlayerColor() ? 'white' : 'black'\"></app-piece-promotion-modal>\n</div>\n",
                styles: ["@charset \"UTF-8\";#board{font-family:Courier New,serif;position:relative}.board-row{display:block;height:12.5%;position:relative;width:100%}.board-col{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece,.piece:after{box-sizing:border-box}.piece:after{content:\"\u200B\"}#drag{height:100%;width:100%}.possible-point{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture:hover,.possible-point:hover{opacity:.4}.possible-capture{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.current-selection{background-color:#72620b!important}.yCoord{right:.2em}.xCoord,.yCoord{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord{bottom:0;left:.2em}.hovering{background-color:red!important}.arrow{stroke-width:2}svg{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}:host{display:inline-block!important}.single-piece{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;justify-content:center;position:absolute;text-align:center;user-select:none;z-index:999}.single-piece:after{box-sizing:border-box;content:\"\u200B\"}.cdk-drag:not(.cdk-drag-dragging){transition:transform .2s cubic-bezier(0,.3,.14,.49)}"]
            },] }
];
NgxChessBoardComponent.ctorParameters = () => [
    { type: NgxChessBoardService }
];
NgxChessBoardComponent.propDecorators = {
    darkTileColor: [{ type: Input }],
    lightTileColor: [{ type: Input }],
    showCoords: [{ type: Input }],
    sourcePointColor: [{ type: Input }],
    destinationPointColor: [{ type: Input }],
    legalMovesPointColor: [{ type: Input }],
    showLastMove: [{ type: Input }],
    showLegalMoves: [{ type: Input }],
    showActivePiece: [{ type: Input }],
    showPossibleCaptures: [{ type: Input }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBRUgsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUNILHdCQUF3QixFQUFFLFlBQVksR0FDekMsTUFBTSwyRkFBMkYsQ0FBQztBQUNuRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBR3RELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUl2QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFXOUMsTUFBTSxPQUFPLHNCQUFzQjtJQWtDL0IsWUFBb0Isb0JBQTBDO1FBQTFDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUEvQnJELGtCQUFhLEdBQUcsU0FBUyxDQUFDLHVCQUF1QixDQUFDO1FBQ2xELG1CQUFjLEdBQVcsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1FBQzVELGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIscUJBQWdCLEdBQVcsU0FBUyxDQUFDLDBCQUEwQixDQUFDO1FBQ2hFLDBCQUFxQixHQUFXLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQztRQUMxRSx5QkFBb0IsR0FBVyxTQUFTLENBQUMsOEJBQThCLENBQUM7UUFDeEUsaUJBQVksR0FBRyxJQUFJ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SUFBSSxDQUFDLHFCQUFxQixDQUFDO2FBQ3RDO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDOzs7WUFsUkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLHk3SkFBK0M7O2FBRWxEOzs7WUFYUSxvQkFBb0I7Ozs0QkFleEIsS0FBSzs2QkFDTCxLQUFLO3lCQUNMLEtBQUs7K0JBQ0wsS0FBSztvQ0FDTCxLQUFLO21DQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLOzhCQUNMLEtBQUs7bUNBQ0wsS0FBSzt5QkFJTCxNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTt1QkFFTixTQUFTLFNBQUMsVUFBVTtvQkFFcEIsU0FBUyxTQUFDLE9BQU87bUJBbUJqQixLQUFLLFNBQUMsTUFBTTt1QkFlWixLQUFLLFNBQUMsVUFBVTsyQkFLaEIsS0FBSyxTQUFDLGNBQWM7MkJBS3BCLEtBQUssU0FBQyxjQUFjO3lCQUtwQixLQUFLLFNBQUMsWUFBWTs0QkFLbEIsS0FBSyxTQUFDLGVBQWU7MkJBS3JCLEtBQUssU0FBQyxjQUFjOzJCQUtwQixZQUFZLFNBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2RrRHJhZ0VuZCwgQ2RrRHJhZ01vdmUsIENka0RyYWdTdGFydCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuaW1wb3J0IHtcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENvbXBvbmVudCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgSW5wdXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RFbmdpbmVGYWNhZGUgfSBmcm9tICcuL2VuZ2luZS9hYnN0cmFjdC1lbmdpbmUtZmFjYWRlJztcbmltcG9ydCB7IEJvYXJkTG9hZGVyIH0gZnJvbSAnLi9lbmdpbmUvYm9hcmQtc3RhdGUtcHJvdmlkZXIvYm9hcmQtbG9hZGVyL2JvYXJkLWxvYWRlcic7XG5pbXBvcnQge1xuICAgIE5vdGF0aW9uUHJvY2Vzc29yRmFjdG9yeSwgTm90YXRpb25UeXBlLFxufSBmcm9tICcuL2VuZ2luZS9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvbm90YXRpb24tcHJvY2Vzc29ycy9ub3RhdGlvbi1wcm9jZXNzb3ItZmFjdG9yeSc7XG5pbXBvcnQgeyBDbGlja1V0aWxzIH0gZnJvbSAnLi9lbmdpbmUvY2xpY2svY2xpY2stdXRpbHMnO1xuaW1wb3J0IHsgRW5naW5lRmFjYWRlIH0gZnJvbSAnLi9lbmdpbmUvZW5naW5lLWZhY2FkZSc7XG5pbXBvcnQgeyBNb3ZlQ2hhbmdlIH0gZnJvbSAnLi9lbmdpbmUvb3V0cHV0cy9tb3ZlLWNoYW5nZS9tb3ZlLWNoYW5nZSc7XG5pbXBvcnQgeyBIaXN0b3J5TW92ZSB9IGZyb20gJy4vaGlzdG9yeS1tb3ZlLXByb3ZpZGVyL2hpc3RvcnktbW92ZSc7XG5pbXBvcnQgeyBCb2FyZCB9IGZyb20gJy4vbW9kZWxzL2JvYXJkJztcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL3BpZWNlJztcbmltcG9ydCB7IE5neENoZXNzQm9hcmRWaWV3IH0gZnJvbSAnLi9uZ3gtY2hlc3MtYm9hcmQtdmlldyc7XG5pbXBvcnQgeyBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50IH0gZnJvbSAnLi9waWVjZS1wcm9tb3Rpb24vcGllY2UtcHJvbW90aW9uLW1vZGFsL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2Uvbmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgUGllY2VJY29uSW5wdXQgfSBmcm9tICcuL3V0aWxzL2lucHV0cy9waWVjZS1pY29uLWlucHV0JztcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0TWFuYWdlciB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLWljb24taW5wdXQtbWFuYWdlcic7XG5pbXBvcnQgeyBDb2xvcklucHV0LCBQaWVjZVR5cGVJbnB1dCB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLXR5cGUtaW5wdXQnO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWNoZXNzLWJvYXJkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50LnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgTmd4Q2hlc3NCb2FyZENvbXBvbmVudFxuICAgIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE5neENoZXNzQm9hcmRWaWV3LCBBZnRlclZpZXdJbml0IHtcblxuICAgIEBJbnB1dCgpIGRhcmtUaWxlQ29sb3IgPSBDb25zdGFudHMuREVGQVVMVF9EQVJLX1RJTEVfQ09MT1I7XG4gICAgQElucHV0KCkgbGlnaHRUaWxlQ29sb3I6IHN0cmluZyA9IENvbnN0YW50cy5ERUZBVUxUX0xJR0hUX1RJTEVfQ09MT1I7XG4gICAgQElucHV0KCkgc2hvd0Nvb3JkcyA9IHRydWU7XG4gICAgQElucHV0KCkgc291cmNlUG9pbnRDb2xvcjogc3RyaW5nID0gQ29uc3RhbnRzLkRFRkFVTFRfU09VUkNFX1BPSU5UX0NPTE9SO1xuICAgIEBJbnB1dCgpIGRlc3RpbmF0aW9uUG9pbnRDb2xvcjogc3RyaW5nID0gQ29uc3RhbnRzLkRFRkFVTFRfREVTVElOQVRJT05fUE9JTlRfQ09MT1I7XG4gICAgQElucHV0KCkgbGVnYWxNb3Zlc1BvaW50Q29sb3I6IHN0cmluZyA9IENvbnN0YW50cy5ERUZBVUxUX0xFR0FMX01PVkVfUE9JTlRfQ09MT1I7XG4gICAgQElucHV0KCkgc2hvd0xhc3RNb3ZlID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBzaG93TGVnYWxNb3ZlcyA9IHRydWU7XG4gICAgQElucHV0KCkgc2hvd0FjdGl2ZVBpZWNlID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBzaG93UG9zc2libGVDYXB0dXJlcyA9IHRydWU7XG4gICAgLyoqXG4gICAgICogRW5hYmxpbmcgZnJlZSBtb2RlIHJlbW92ZXMgdHVybi1iYXNlZCByZXN0cmljdGlvbiBhbmQgYWxsb3dzIHRvIG1vdmUgYW55IHBpZWNlIGZyZWVseSFcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgbW92ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TW92ZUNoYW5nZT4oKTtcbiAgICBAT3V0cHV0KCkgY2hlY2ttYXRlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICAgIEBPdXRwdXQoKSBzdGFsZW1hdGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgICBAVmlld0NoaWxkKCdib2FyZFJlZicpXG4gICAgYm9hcmRSZWY6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnbW9kYWwnKVxuICAgIG1vZGFsOiBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50O1xuXG4gICAgcGllY2VTaXplOiBudW1iZXI7XG4gICAgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICBib2FyZExvYWRlcjogQm9hcmRMb2FkZXI7XG4gICAgcGllY2VJY29uTWFuYWdlcjogUGllY2VJY29uSW5wdXRNYW5hZ2VyO1xuICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICBzdGFydFRyYW5zaXRpb24gPSAnJztcblxuICAgIGVuZ2luZUZhY2FkZTogQWJzdHJhY3RFbmdpbmVGYWNhZGU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5neENoZXNzQm9hcmRTZXJ2aWNlOiBOZ3hDaGVzc0JvYXJkU2VydmljZSkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZSA9IG5ldyBFbmdpbmVGYWNhZGUoXG4gICAgICAgICAgICBuZXcgQm9hcmQoKSxcbiAgICAgICAgICAgIHRoaXMubW92ZUNoYW5nZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIEBJbnB1dCgnc2l6ZScpXG4gICAgcHVibGljIHNldCBzaXplKHNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzaXplICYmXG4gICAgICAgICAgICBzaXplID49IENvbnN0YW50cy5NSU5fQk9BUkRfU0laRSAmJlxuICAgICAgICAgICAgc2l6ZSA8PSBDb25zdGFudHMuTUFYX0JPQVJEX1NJWkVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aCA9IHNpemU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aCA9IENvbnN0YW50cy5ERUZBVUxUX1NJWkU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhd1Byb3ZpZGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUGllY2VTaXplKCk7XG4gICAgfVxuXG4gICAgQElucHV0KCdmcmVlTW9kZScpXG4gICAgcHVibGljIHNldCBmcmVlTW9kZShmcmVlTW9kZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5mcmVlTW9kZSA9IGZyZWVNb2RlO1xuICAgIH1cblxuICAgIEBJbnB1dCgnZHJhZ0Rpc2FibGVkJylcbiAgICBwdWJsaWMgc2V0IGRyYWdEaXNhYmxlZChkcmFnRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhZ0Rpc2FibGVkID0gZHJhZ0Rpc2FibGVkO1xuICAgIH1cblxuICAgIEBJbnB1dCgnZHJhd0Rpc2FibGVkJylcbiAgICBwdWJsaWMgc2V0IGRyYXdEaXNhYmxlZChkcmF3RGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhd0Rpc2FibGVkID0gZHJhd0Rpc2FibGVkO1xuICAgIH1cblxuICAgIEBJbnB1dCgncGllY2VJY29ucycpXG4gICAgcHVibGljIHNldCBwaWVjZUljb25zKHBpZWNlSWNvbnM6IFBpZWNlSWNvbklucHV0KSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnBpZWNlSWNvbk1hbmFnZXIucGllY2VJY29uSW5wdXQgPSBwaWVjZUljb25zO1xuICAgIH1cblxuICAgIEBJbnB1dCgnbGlnaHREaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBsaWdodERpc2FibGVkKGxpZ2h0RGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUubGlnaHREaXNhYmxlZCA9IGxpZ2h0RGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgQElucHV0KCdkYXJrRGlzYWJsZWQnKVxuICAgIHB1YmxpYyBzZXQgZGFya0Rpc2FibGVkKGRhcmtEaXNhYmxlZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kYXJrRGlzYWJsZWQgPSBkYXJrRGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnLCBbJyRldmVudCddKVxuICAgIG9uUmlnaHRDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGNoYW5nZXMubGlnaHREaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHREaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcikgfHxcbiAgICAgICAgICAgIChjaGFuZ2VzLmRhcmtEaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZGFya0Rpc2FibGVkICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5uZ3hDaGVzc0JvYXJkU2VydmljZS5jb21wb25lbnRNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5yZXNldCgpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUubW9kYWwgPSB0aGlzLm1vZGFsO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBpZWNlU2l6ZSgpO1xuICAgIH1cblxuICAgIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5vbk1vdXNlVXAoXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpY2tQb2ludChldmVudCksXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXZlcnNlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnJldmVyc2UoKTtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuY29vcmRzLnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCb2FyZChib2FyZDogQm9hcmQpIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQgPSBib2FyZDtcbiAgICAgICAgdGhpcy5ib2FyZExvYWRlci5zZXRFbmdpbmVGYWNhZGUodGhpcy5lbmdpbmVGYWNhZGUpO1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBzZXRGRU4oZmVuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLnNldE5vdGF0aW9uUHJvY2Vzc29yKFxuICAgICAgICAgICAgICAgIE5vdGF0aW9uUHJvY2Vzc29yRmFjdG9yeS5nZXRQcm9jZXNzb3IoTm90YXRpb25UeXBlLkZFTilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5sb2FkRkVOKGZlbik7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5jb29yZHMucmVzZXQoKTtcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5hZGRQaWVjZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFBHTihwZ246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUucGduUHJvY2Vzc29yLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5zZXROb3RhdGlvblByb2Nlc3NvcihcbiAgICAgICAgICAgICAgICBOb3RhdGlvblByb2Nlc3NvckZhY3RvcnkuZ2V0UHJvY2Vzc29yKE5vdGF0aW9uVHlwZS5QR04pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIubG9hZFBHTihwZ24pO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVNb3ZlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuY29vcmRzLnJlc2V0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXhjZXB0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RkVOKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5mZW47XG4gICAgfVxuXG4gICAgZHJhZ0VuZGVkKGV2ZW50OiBDZGtEcmFnRW5kKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kcmFnRW5kU3RyYXRlZ3kucHJvY2VzcyhcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUubW92ZURvbmUsXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvblxuICAgICAgICApO1xuICAgIH1cblxuICAgIGRyYWdTdGFydChldmVudDogQ2RrRHJhZ1N0YXJ0KTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIGxldCB0cmFucyA9IGV2ZW50LnNvdXJjZS5nZXRSb290RWxlbWVudCgpLnN0eWxlLnRyYW5zZm9ybS5zcGxpdCgnKSAnKTtcbiAgICAgICAgLy8gICB0aGlzLnN0YXJ0VHJhbnM9IHRyYW5zO1xuICAgICAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbiA9IHRyYW5zLmxlbmd0aCA9PT0gMiA/IHRyYW5zWzFdIDogdHJhbnNbMF07XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdTdGFydFN0cmF0ZWd5LnByb2Nlc3MoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm9uTW91c2VEb3duKGV2ZW50LCB0aGlzLmdldENsaWNrUG9pbnQoZXZlbnQpLFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0Q2xpY2tQb2ludChldmVudCkge1xuICAgICAgICByZXR1cm4gQ2xpY2tVdGlscy5nZXRDbGlja1BvaW50KFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wLFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVQaWVjZVNpemUoKSB7XG4gICAgICAgIHRoaXMucGllY2VTaXplID0gdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggLyA4O1xuICAgIH1cblxuXG4gICAgZ2V0Q3VzdG9tUGllY2VJY29ucyhwaWVjZTogUGllY2UpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoXG4gICAgICAgICAgICBgeyBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoJyR7dGhpcy5lbmdpbmVGYWNhZGUucGllY2VJY29uTWFuYWdlci5nZXRQaWVjZUljb24oXG4gICAgICAgICAgICAgICAgcGllY2VcbiAgICAgICAgICAgICl9JylcIn1gXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgbW92ZShjb29yZHM6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5tb3ZlKGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgZ2V0TW92ZUhpc3RvcnkoKTogSGlzdG9yeU1vdmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZUZhY2FkZS5nZXRNb3ZlSGlzdG9yeSgpO1xuICAgIH1cblxuICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5yZXNldCgpO1xuICAgIH1cblxuICAgIHVuZG8oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnVuZG8oKTtcbiAgICB9XG5cbiAgICBhZGRQaWVjZShcbiAgICAgICAgcGllY2VUeXBlSW5wdXQ6IFBpZWNlVHlwZUlucHV0LFxuICAgICAgICBjb2xvcklucHV0OiBDb2xvcklucHV0LFxuICAgICAgICBjb29yZHM6IHN0cmluZ1xuICAgICkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5hZGRQaWVjZShwaWVjZVR5cGVJbnB1dCwgY29sb3JJbnB1dCwgY29vcmRzKTtcbiAgICB9XG5cbiAgICBnZXRQR04oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZUZhY2FkZS5wZ25Qcm9jZXNzb3IuZ2V0UEdOKCk7XG4gICAgfVxuXG4gICAgZHJhZ01vdmVkKCRldmVudDogQ2RrRHJhZ01vdmU8YW55Pikge1xuICAgICAgICBsZXQgeCA9ICgkZXZlbnQucG9pbnRlclBvc2l0aW9uLnggLSAkZXZlbnQuc291cmNlLmdldFJvb3RFbGVtZW50KCkucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSAtICh0aGlzLnBpZWNlU2l6ZSAvIDIpO1xuICAgICAgICBsZXQgeSA9ICgkZXZlbnQucG9pbnRlclBvc2l0aW9uLnkgLSAkZXZlbnQuc291cmNlLmdldFJvb3RFbGVtZW50KCkucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApIC0gKHRoaXMucGllY2VTaXplIC8gMik7XG4gICAgICAgICRldmVudC5zb3VyY2UuZ2V0Um9vdEVsZW1lbnQoKS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArIHggKyAncHgsICdcbiAgICAgICAgICAgICsgKHkpICsgJ3B4LDBweCknO1xuICAgIH1cblxuICAgIGdldFRpbGVCYWNrZ3JvdW5kQ29sb3IoaSwgaik6IHN0cmluZyB7XG4gICAgICAgIGxldCBjb2xvciA9ICgoaSArIGopICUgMiA9PT0gMCkgPyB0aGlzLmxpZ2h0VGlsZUNvbG9yIDogdGhpcy5kYXJrVGlsZUNvbG9yO1xuXG4gICAgICAgIGlmICh0aGlzLnNob3dMYXN0TW92ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLmlzWFlJblNvdXJjZU1vdmUoaSwgaikpIHtcbiAgICAgICAgICAgICAgICBjb2xvciA9IHRoaXMuc291cmNlUG9pbnRDb2xvcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLmlzWFlJbkRlc3RNb3ZlKGksIGopKSB7XG4gICAgICAgICAgICAgICAgY29sb3IgPSB0aGlzLmRlc3RpbmF0aW9uUG9pbnRDb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG59XG4iXX0=