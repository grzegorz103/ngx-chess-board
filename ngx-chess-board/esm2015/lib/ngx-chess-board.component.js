import { Component, EventEmitter, HostListener, Input, Output, ViewChild, } from '@angular/core';
import { NotationProcessorFactory, NotationType, } from './engine/board-state-provider/board-loader/notation-processors/notation-processor-factory';
import { ClickUtils } from './engine/click/click-utils';
import { EngineFacade } from './engine/engine-facade';
import { Board } from './models/board';
import { Constants } from './utils/constants';
import * as i0 from "@angular/core";
import * as i1 from "./service/ngx-chess-board.service";
import * as i2 from "@angular/common";
import * as i3 from "./piece-promotion/piece-promotion-modal/piece-promotion-modal.component";
import * as i4 from "@angular/cdk/drag-drop";
const _c0 = ["boardRef"];
const _c1 = ["modal"];
function NgxChessBoardComponent_div_3_div_1_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r7 = i0.ɵɵnextContext(2).index;
    const ctx_r11 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("color", i_r7 % 2 === 0 ? ctx_r11.lightTileColor : ctx_r11.darkTileColor)("font-size", ctx_r11.pieceSize / 4, "px");
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", ctx_r11.engineFacade.coords.yCoords[i_r7], " ");
} }
function NgxChessBoardComponent_div_3_div_1_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = i0.ɵɵnextContext().index;
    const ctx_r12 = i0.ɵɵnextContext(2);
    i0.ɵɵstyleProp("color", j_r10 % 2 === 0 ? ctx_r12.lightTileColor : ctx_r12.darkTileColor)("font-size", ctx_r12.pieceSize / 4, "px");
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", ctx_r12.engineFacade.coords.xCoords[j_r10], " ");
} }
function NgxChessBoardComponent_div_3_div_1_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17);
    i0.ɵɵelementStart(1, "div", 18);
    i0.ɵɵlistener("cdkDragEnded", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragEnded_1_listener($event) { i0.ɵɵrestoreView(_r18); const ctx_r17 = i0.ɵɵnextContext(3); return ctx_r17.dragEnded($event); })("cdkDragStarted", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragStarted_1_listener($event) { i0.ɵɵrestoreView(_r18); const ctx_r19 = i0.ɵɵnextContext(3); return ctx_r19.dragStart($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = i0.ɵɵnextContext().index;
    const i_r7 = i0.ɵɵnextContext().index;
    const ctx_r13 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵstyleProp("font-size", ctx_r13.pieceSize + "px");
    i0.ɵɵproperty("cdkDragDisabled", ctx_r13.engineFacade.dragDisabled)("innerHTML", ctx_r13.engineFacade.pieceIconManager.isDefaultIcons() ? ctx_r13.engineFacade.board.getPieceByPoint(i_r7, j_r10).constant.icon : "", i0.ɵɵsanitizeHtml)("ngClass", "piece")("ngStyle", ctx_r13.engineFacade.pieceIconManager.isDefaultIcons() ? "" : ctx_r13.getCustomPieceIcons(ctx_r13.engineFacade.board.getPieceByPoint(i_r7, j_r10)));
} }
function NgxChessBoardComponent_div_3_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_span_1_Template, 2, 5, "span", 12);
    i0.ɵɵtemplate(2, NgxChessBoardComponent_div_3_div_1_span_2_Template, 2, 5, "span", 13);
    i0.ɵɵtemplate(3, NgxChessBoardComponent_div_3_div_1_div_3_Template, 2, 6, "div", 14);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = ctx.index;
    const i_r7 = i0.ɵɵnextContext().index;
    const ctx_r8 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("background-color", (i_r7 + j_r10) % 2 === 0 ? ctx_r8.lightTileColor : ctx_r8.darkTileColor);
    i0.ɵɵclassProp("current-selection", ctx_r8.engineFacade.board.isXYInActiveMove(i_r7, j_r10))("dest-move", ctx_r8.engineFacade.board.isXYInDestMove(i_r7, j_r10))("king-check", ctx_r8.engineFacade.board.isKingChecked(ctx_r8.engineFacade.board.getPieceByPoint(i_r7, j_r10)))("point-circle", ctx_r8.engineFacade.board.isXYInPointSelection(i_r7, j_r10))("possible-capture", ctx_r8.engineFacade.board.isXYInPossibleCaptures(i_r7, j_r10))("possible-point", ctx_r8.engineFacade.board.isXYInPossibleMoves(i_r7, j_r10))("source-move", ctx_r8.engineFacade.board.isXYInSourceMove(i_r7, j_r10));
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r8.showCoords && j_r10 === 7);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r8.showCoords && i_r7 === 7);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r8.engineFacade.board.getPieceByPoint(i_r7, j_r10));
} }
function NgxChessBoardComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_Template, 4, 19, "div", 10);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r6 = ctx.$implicit;
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngForOf", row_r6);
} }
function NgxChessBoardComponent__svg_defs_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(0, "defs");
    i0.ɵɵelementStart(1, "marker", 19);
    i0.ɵɵelement(2, "path", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const color_r23 = ctx.$implicit;
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("id", color_r23 + "Arrow");
    i0.ɵɵadvance(1);
    i0.ɵɵstyleProp("fill", color_r23);
} }
function NgxChessBoardComponent__svg_line_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelement(0, "line", 21);
} if (rf & 2) {
    const arrow_r24 = ctx.$implicit;
    i0.ɵɵattribute("marker-end", "url(#" + arrow_r24.end.color + "Arrow)")("stroke", arrow_r24.end.color)("x1", arrow_r24.start.x)("x2", arrow_r24.end.x)("y1", arrow_r24.start.y)("y2", arrow_r24.end.y);
} }
function NgxChessBoardComponent__svg_circle_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelement(0, "circle", 22);
} if (rf & 2) {
    const circle_r25 = ctx.$implicit;
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵattribute("cx", circle_r25.drawPoint.x)("cy", circle_r25.drawPoint.y)("r", ctx_r4.engineFacade.heightAndWidth / 18)("stroke", circle_r25.drawPoint.color);
} }
const _c2 = function () { return ["red", "green", "blue", "orange"]; };
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
NgxChessBoardComponent.ɵfac = function NgxChessBoardComponent_Factory(t) { return new (t || NgxChessBoardComponent)(i0.ɵɵdirectiveInject(i1.NgxChessBoardService)); };
NgxChessBoardComponent.ɵcmp = i0.ɵɵdefineComponent({ type: NgxChessBoardComponent, selectors: [["ngx-chess-board"]], viewQuery: function NgxChessBoardComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, true);
        i0.ɵɵviewQuery(_c1, true);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.boardRef = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.modal = _t.first);
    } }, hostBindings: function NgxChessBoardComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("contextmenu", function NgxChessBoardComponent_contextmenu_HostBindingHandler($event) { return ctx.onRightClick($event); });
    } }, inputs: { darkTileColor: "darkTileColor", lightTileColor: "lightTileColor", showCoords: "showCoords", size: "size", freeMode: "freeMode", dragDisabled: "dragDisabled", drawDisabled: "drawDisabled", pieceIcons: "pieceIcons", lightDisabled: "lightDisabled", darkDisabled: "darkDisabled" }, outputs: { moveChange: "moveChange", checkmate: "checkmate", stalemate: "stalemate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 12, vars: 15, consts: [["id", "board", 3, "pointerdown", "pointerup"], ["boardRef", ""], ["id", "drag"], ["class", "board-row", 4, "ngFor", "ngForOf"], [2, "position", "absolute", "top", "0", "pointer-events", "none"], [4, "ngFor", "ngForOf"], ["class", "arrow", 4, "ngFor", "ngForOf"], ["fill-opacity", "0.0", "stroke-width", "2", 4, "ngFor", "ngForOf"], ["modal", ""], [1, "board-row"], ["class", "board-col", 3, "current-selection", "dest-move", "king-check", "point-circle", "possible-capture", "possible-point", "source-move", "background-color", 4, "ngFor", "ngForOf"], [1, "board-col"], ["class", "yCoord", 3, "color", "font-size", 4, "ngIf"], ["class", "xCoord", 3, "color", "font-size", 4, "ngIf"], ["style", "height:100%; width:100%", 4, "ngIf"], [1, "yCoord"], [1, "xCoord"], [2, "height", "100%", "width", "100%"], ["cdkDrag", "", 3, "cdkDragDisabled", "innerHTML", "ngClass", "ngStyle", "cdkDragEnded", "cdkDragStarted"], ["markerHeight", "13", "markerWidth", "13", "orient", "auto", "refX", "9", "refY", "6", 3, "id"], ["d", "M2,2 L2,11 L10,6 L2,2"], [1, "arrow"], ["fill-opacity", "0.0", "stroke-width", "2"]], template: function NgxChessBoardComponent_Template(rf, ctx) { if (rf & 1) {
        const _r26 = i0.ɵɵgetCurrentView();
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵlistener("pointerdown", function NgxChessBoardComponent_Template_div_pointerdown_0_listener($event) { i0.ɵɵrestoreView(_r26); const _r5 = i0.ɵɵreference(11); return !_r5.opened && ctx.onMouseDown($event); })("pointerup", function NgxChessBoardComponent_Template_div_pointerup_0_listener($event) { i0.ɵɵrestoreView(_r26); const _r5 = i0.ɵɵreference(11); return !_r5.opened && ctx.onMouseUp($event); });
        i0.ɵɵelementStart(2, "div", 2);
        i0.ɵɵtemplate(3, NgxChessBoardComponent_div_3_Template, 2, 1, "div", 3);
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(4, "svg", 4);
        i0.ɵɵtemplate(5, NgxChessBoardComponent__svg_defs_5_Template, 3, 3, "defs", 5);
        i0.ɵɵtemplate(6, NgxChessBoardComponent__svg_line_6_Template, 1, 6, "line", 6);
        i0.ɵɵpipe(7, "async");
        i0.ɵɵtemplate(8, NgxChessBoardComponent__svg_circle_8_Template, 1, 4, "circle", 7);
        i0.ɵɵpipe(9, "async");
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelement(10, "app-piece-promotion-modal", null, 8);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵstyleProp("height", ctx.engineFacade.heightAndWidth, "px")("width", ctx.engineFacade.heightAndWidth, "px");
        i0.ɵɵadvance(3);
        i0.ɵɵproperty("ngForOf", ctx.engineFacade.board.board);
        i0.ɵɵadvance(1);
        i0.ɵɵattribute("height", ctx.engineFacade.heightAndWidth)("width", ctx.engineFacade.heightAndWidth);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", i0.ɵɵpureFunction0(14, _c2));
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind1(7, 10, ctx.engineFacade.drawProvider.arrows$));
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind1(9, 12, ctx.engineFacade.drawProvider.circles$));
    } }, directives: [i2.NgForOf, i3.PiecePromotionModalComponent, i2.NgIf, i4.CdkDrag, i2.NgClass, i2.NgStyle], pipes: [i2.AsyncPipe], styles: ["@charset \"UTF-8\";#board[_ngcontent-%COMP%]{font-family:Courier New,serif;position:relative}.board-row[_ngcontent-%COMP%]{display:block;height:12.5%;position:relative;width:100%}.board-col[_ngcontent-%COMP%]{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece[_ngcontent-%COMP%], .piece[_ngcontent-%COMP%]:after{box-sizing:border-box}.piece[_ngcontent-%COMP%]:after{content:\"\u200B\"}#drag[_ngcontent-%COMP%]{height:100%;width:100%}.possible-point[_ngcontent-%COMP%]{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture[_ngcontent-%COMP%]:hover, .possible-point[_ngcontent-%COMP%]:hover{opacity:.4}.possible-capture[_ngcontent-%COMP%]{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check[_ngcontent-%COMP%]{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move[_ngcontent-%COMP%]{background-color:rgba(146,111,26,.79)!important}.dest-move[_ngcontent-%COMP%]{background-color:#b28e1a!important}.current-selection[_ngcontent-%COMP%]{background-color:#72620b!important}.yCoord[_ngcontent-%COMP%]{right:.2em}.xCoord[_ngcontent-%COMP%], .yCoord[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord[_ngcontent-%COMP%]{bottom:0;left:.2em}.hovering[_ngcontent-%COMP%]{background-color:red!important}.arrow[_ngcontent-%COMP%]{stroke-width:2}svg[_ngcontent-%COMP%]{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}[_nghost-%COMP%]{display:inline-block!important}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxChessBoardComponent, [{
        type: Component,
        args: [{
                selector: 'ngx-chess-board',
                templateUrl: './ngx-chess-board.component.html',
                styleUrls: ['./ngx-chess-board.component.scss'],
            }]
    }], function () { return [{ type: i1.NgxChessBoardService }]; }, { darkTileColor: [{
            type: Input
        }], lightTileColor: [{
            type: Input
        }], showCoords: [{
            type: Input
        }], moveChange: [{
            type: Output
        }], checkmate: [{
            type: Output
        }], stalemate: [{
            type: Output
        }], boardRef: [{
            type: ViewChild,
            args: ['boardRef']
        }], modal: [{
            type: ViewChild,
            args: ['modal']
        }], size: [{
            type: Input,
            args: ['size']
        }], freeMode: [{
            type: Input,
            args: ['freeMode']
        }], dragDisabled: [{
            type: Input,
            args: ['dragDisabled']
        }], drawDisabled: [{
            type: Input,
            args: ['drawDisabled']
        }], pieceIcons: [{
            type: Input,
            args: ['pieceIcons']
        }], lightDisabled: [{
            type: Input,
            args: ['lightDisabled']
        }], darkDisabled: [{
            type: Input,
            args: ['darkDisabled']
        }], onRightClick: [{
            type: HostListener,
            args: ['contextmenu', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyIsImxpYi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUVILFNBQVMsRUFFVCxZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRU4sU0FBUyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFDSCx3QkFBd0IsRUFBRSxZQUFZLEdBQ3pDLE1BQU0sMkZBQTJGLENBQUM7QUFDbkcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUd0RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFLdkMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7Ozs7SUNIOUIsZ0NBTUk7SUFBQSxZQUNKO0lBQUEsaUJBQU87Ozs7SUFMSCx3RkFBOEQsMENBQUE7SUFJOUQsZUFDSjtJQURJLDBFQUNKOzs7SUFDQSxnQ0FNSTtJQUFBLFlBQ0o7SUFBQSxpQkFBTzs7OztJQUxILHlGQUE4RCwwQ0FBQTtJQUk5RCxlQUNKO0lBREksMkVBQ0o7Ozs7SUFDQSwrQkFJSTtJQUFBLCtCQVVNO0lBSkYsZ09BQWtDLHVOQUFBO0lBSXRDLGlCQUFNO0lBQ1YsaUJBQU07Ozs7O0lBUEUsZUFBb0M7SUFBcEMscURBQW9DO0lBSHBDLG1FQUE2QyxxS0FBQSxvQkFBQSwrSkFBQTs7O0lBakN6RCwrQkFZSTtJQUFBLHNGQU1JO0lBRUosc0ZBTUk7SUFFSixv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bUJBQUMsY0FBYztZQU1yQixZQUFZO2tCQURYLFlBQVk7bUJBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2RrRHJhZ0VuZCwgQ2RrRHJhZ1N0YXJ0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XHJcbmltcG9ydCB7XHJcbiAgICBBZnRlclZpZXdJbml0LFxyXG4gICAgQ29tcG9uZW50LFxyXG4gICAgRWxlbWVudFJlZixcclxuICAgIEV2ZW50RW1pdHRlcixcclxuICAgIEhvc3RMaXN0ZW5lcixcclxuICAgIElucHV0LFxyXG4gICAgT25DaGFuZ2VzLFxyXG4gICAgT25Jbml0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgU2ltcGxlQ2hhbmdlcyxcclxuICAgIFZpZXdDaGlsZCxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWJzdHJhY3RFbmdpbmVGYWNhZGUgfSBmcm9tICcuL2VuZ2luZS9hYnN0cmFjdC1lbmdpbmUtZmFjYWRlJztcclxuaW1wb3J0IHsgQm9hcmRMb2FkZXIgfSBmcm9tICcuL2VuZ2luZS9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXIvYm9hcmQtbG9hZGVyJztcclxuaW1wb3J0IHtcclxuICAgIE5vdGF0aW9uUHJvY2Vzc29yRmFjdG9yeSwgTm90YXRpb25UeXBlLFxyXG59IGZyb20gJy4vZW5naW5lL2JvYXJkLXN0YXRlLXByb3ZpZGVyL2JvYXJkLWxvYWRlci9ub3RhdGlvbi1wcm9jZXNzb3JzL25vdGF0aW9uLXByb2Nlc3Nvci1mYWN0b3J5JztcclxuaW1wb3J0IHsgQ2xpY2tVdGlscyB9IGZyb20gJy4vZW5naW5lL2NsaWNrL2NsaWNrLXV0aWxzJztcclxuaW1wb3J0IHsgRW5naW5lRmFjYWRlIH0gZnJvbSAnLi9lbmdpbmUvZW5naW5lLWZhY2FkZSc7XHJcbmltcG9ydCB7IE1vdmVDaGFuZ2UgfSBmcm9tICcuL2VuZ2luZS9tb3ZlLWNoYW5nZS9tb3ZlLWNoYW5nZSc7XHJcbmltcG9ydCB7IEhpc3RvcnlNb3ZlIH0gZnJvbSAnLi9oaXN0b3J5LW1vdmUtcHJvdmlkZXIvaGlzdG9yeS1tb3ZlJztcclxuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuL21vZGVscy9ib2FyZCc7XHJcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSAnLi9tb2RlbHMvcGllY2VzL3BpZWNlJztcclxuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFZpZXcgfSBmcm9tICcuL25neC1jaGVzcy1ib2FyZC12aWV3JztcclxuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4vcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2Uvbmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0IH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtaWNvbi1pbnB1dCc7XHJcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0TWFuYWdlciB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLWljb24taW5wdXQtbWFuYWdlcic7XHJcbmltcG9ydCB7IENvbG9ySW5wdXQsIFBpZWNlVHlwZUlucHV0IH0gZnJvbSAnLi91dGlscy9pbnB1dHMvcGllY2UtdHlwZS1pbnB1dCc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ25neC1jaGVzcy1ib2FyZCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL25neC1jaGVzcy1ib2FyZC5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4Q2hlc3NCb2FyZENvbXBvbmVudFxyXG4gICAgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgTmd4Q2hlc3NCb2FyZFZpZXcsIEFmdGVyVmlld0luaXQge1xyXG5cclxuICAgIEBJbnB1dCgpIGRhcmtUaWxlQ29sb3IgPSBDb25zdGFudHMuREVGQVVMVF9EQVJLX1RJTEVfQ09MT1I7XHJcbiAgICBASW5wdXQoKSBsaWdodFRpbGVDb2xvcjogc3RyaW5nID0gQ29uc3RhbnRzLkRFRkFVTFRfTElHSFRfVElMRV9DT0xPUjtcclxuICAgIEBJbnB1dCgpIHNob3dDb29yZHMgPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBFbmFibGluZyBmcmVlIG1vZGUgcmVtb3ZlcyB0dXJuLWJhc2VkIHJlc3RyaWN0aW9uIGFuZCBhbGxvd3MgdG8gbW92ZSBhbnkgcGllY2UgZnJlZWx5IVxyXG4gICAgICovXHJcbiAgICBAT3V0cHV0KCkgbW92ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TW92ZUNoYW5nZT4oKTtcclxuICAgIEBPdXRwdXQoKSBjaGVja21hdGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgICBAT3V0cHV0KCkgc3RhbGVtYXRlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICAgIEBWaWV3Q2hpbGQoJ2JvYXJkUmVmJylcclxuICAgIGJvYXJkUmVmOiBFbGVtZW50UmVmO1xyXG4gICAgQFZpZXdDaGlsZCgnbW9kYWwnKVxyXG4gICAgbW9kYWw6IFBpZWNlUHJvbW90aW9uTW9kYWxDb21wb25lbnQ7XHJcblxyXG4gICAgcGllY2VTaXplOiBudW1iZXI7XHJcbiAgICBzZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgYm9hcmRMb2FkZXI6IEJvYXJkTG9hZGVyO1xyXG4gICAgcGllY2VJY29uTWFuYWdlcjogUGllY2VJY29uSW5wdXRNYW5hZ2VyO1xyXG5cclxuICAgIGVuZ2luZUZhY2FkZTogQWJzdHJhY3RFbmdpbmVGYWNhZGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hDaGVzc0JvYXJkU2VydmljZTogTmd4Q2hlc3NCb2FyZFNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZSA9IG5ldyBFbmdpbmVGYWNhZGUoXHJcbiAgICAgICAgICAgIG5ldyBCb2FyZCgpLFxyXG4gICAgICAgICAgICB0aGlzLm1vdmVDaGFuZ2VcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnc2l6ZScpXHJcbiAgICBwdWJsaWMgc2V0IHNpemUoc2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBzaXplICYmXHJcbiAgICAgICAgICAgIHNpemUgPj0gQ29uc3RhbnRzLk1JTl9CT0FSRF9TSVpFICYmXHJcbiAgICAgICAgICAgIHNpemUgPD0gQ29uc3RhbnRzLk1BWF9CT0FSRF9TSVpFXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoID0gc2l6ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aCA9IENvbnN0YW50cy5ERUZBVUxUX1NJWkU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYXdQcm92aWRlci5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUGllY2VTaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCdmcmVlTW9kZScpXHJcbiAgICBwdWJsaWMgc2V0IGZyZWVNb2RlKGZyZWVNb2RlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZnJlZU1vZGUgPSBmcmVlTW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoJ2RyYWdEaXNhYmxlZCcpXHJcbiAgICBwdWJsaWMgc2V0IGRyYWdEaXNhYmxlZChkcmFnRGlzYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kcmFnRGlzYWJsZWQgPSBkcmFnRGlzYWJsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCdkcmF3RGlzYWJsZWQnKVxyXG4gICAgcHVibGljIHNldCBkcmF3RGlzYWJsZWQoZHJhd0Rpc2FibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZHJhd0Rpc2FibGVkID0gZHJhd0Rpc2FibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgncGllY2VJY29ucycpXHJcbiAgICBwdWJsaWMgc2V0IHBpZWNlSWNvbnMocGllY2VJY29uczogUGllY2VJY29uSW5wdXQpIHtcclxuICAgICAgICB0aGlzLnBpZWNlSWNvbk1hbmFnZXIucGllY2VJY29uSW5wdXQgPSBwaWVjZUljb25zO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnbGlnaHREaXNhYmxlZCcpXHJcbiAgICBwdWJsaWMgc2V0IGxpZ2h0RGlzYWJsZWQobGlnaHREaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmxpZ2h0RGlzYWJsZWQgPSBsaWdodERpc2FibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnZGFya0Rpc2FibGVkJylcclxuICAgIHB1YmxpYyBzZXQgZGFya0Rpc2FibGVkKGRhcmtEaXNhYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRhcmtEaXNhYmxlZCA9IGRhcmtEaXNhYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXHJcbiAgICBvblJpZ2h0Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIChjaGFuZ2VzLmxpZ2h0RGlzYWJsZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHREaXNhYmxlZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKSB8fFxyXG4gICAgICAgICAgICAoY2hhbmdlcy5kYXJrRGlzYWJsZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuZGFya0Rpc2FibGVkICYmXHJcbiAgICAgICAgICAgICAgICAhdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuY3VycmVudFdoaXRlUGxheWVyKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5uZ3hDaGVzc0JvYXJkU2VydmljZS5jb21wb25lbnRNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnJlc2V0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5tb2RhbCA9IHRoaXMubW9kYWw7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQaWVjZVNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5vbk1vdXNlVXAoXHJcbiAgICAgICAgICAgIGV2ZW50LFxyXG4gICAgICAgICAgICB0aGlzLmdldENsaWNrUG9pbnQoZXZlbnQpLFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucmV2ZXJzZSgpO1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQm9hcmQoYm9hcmQ6IEJvYXJkKSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQgPSBib2FyZDtcclxuICAgICAgICB0aGlzLmJvYXJkTG9hZGVyLnNldEVuZ2luZUZhY2FkZSh0aGlzLmVuZ2luZUZhY2FkZSk7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQucG9zc2libGVDYXB0dXJlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRGRU4oZmVuOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5zZXROb3RhdGlvblByb2Nlc3NvcihcclxuICAgICAgICAgICAgICAgIE5vdGF0aW9uUHJvY2Vzc29yRmFjdG9yeS5nZXRQcm9jZXNzb3IoTm90YXRpb25UeXBlLkZFTilcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIubG9hZEZFTihmZW4pO1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuY29vcmRzLnJlc2V0KCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRQR04ocGduOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZExvYWRlci5zZXROb3RhdGlvblByb2Nlc3NvcihcclxuICAgICAgICAgICAgICAgIE5vdGF0aW9uUHJvY2Vzc29yRmFjdG9yeS5nZXRQcm9jZXNzb3IoTm90YXRpb25UeXBlLlBHTilcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmRMb2FkZXIubG9hZFBHTihwZ24pO1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuY29vcmRzLnJlc2V0KCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4Y2VwdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRGRU4oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQuZmVuO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWdFbmRlZChldmVudDogQ2RrRHJhZ0VuZCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdFbmRTdHJhdGVneS5wcm9jZXNzKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnU3RhcnQoZXZlbnQ6IENka0RyYWdTdGFydCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdTdGFydFN0cmF0ZWd5LnByb2Nlc3MoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUub25Nb3VzZURvd24oZXZlbnQsIHRoaXMuZ2V0Q2xpY2tQb2ludChldmVudCksXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDbGlja1BvaW50KGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIENsaWNrVXRpbHMuZ2V0Q2xpY2tQb2ludChcclxuICAgICAgICAgICAgZXZlbnQsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FsY3VsYXRlUGllY2VTaXplKCkge1xyXG4gICAgICAgIHRoaXMucGllY2VTaXplID0gdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggLyAxMDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0Q3VzdG9tUGllY2VJY29ucyhwaWVjZTogUGllY2UpIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShcclxuICAgICAgICAgICAgYHsgXCJiYWNrZ3JvdW5kLWltYWdlXCI6IFwidXJsKCcke3RoaXMuZW5naW5lRmFjYWRlLnBpZWNlSWNvbk1hbmFnZXIuZ2V0UGllY2VJY29uKFxyXG4gICAgICAgICAgICAgICAgcGllY2VcclxuICAgICAgICAgICAgKX0nKVwifWBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmUoY29vcmRzOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5tb3ZlKGNvb3Jkcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TW92ZUhpc3RvcnkoKTogSGlzdG9yeU1vdmVbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5naW5lRmFjYWRlLmdldE1vdmVIaXN0b3J5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUucmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICB1bmRvKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnVuZG8oKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQaWVjZShcclxuICAgICAgICBwaWVjZVR5cGVJbnB1dDogUGllY2VUeXBlSW5wdXQsXHJcbiAgICAgICAgY29sb3JJbnB1dDogQ29sb3JJbnB1dCxcclxuICAgICAgICBjb29yZHM6IHN0cmluZ1xyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuYWRkUGllY2UocGllY2VUeXBlSW5wdXQsIGNvbG9ySW5wdXQsIGNvb3Jkcyk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIjxkaXZcclxuICAgIGlkPVwiYm9hcmRcIlxyXG4gICAgW3N0eWxlLmhlaWdodC5weF09XCJlbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGhcIlxyXG4gICAgW3N0eWxlLndpZHRoLnB4XT1cImVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aFwiXHJcbiAgICAocG9pbnRlcmRvd24pPVwiIW1vZGFsLm9wZW5lZCAmJiBvbk1vdXNlRG93bigkZXZlbnQpXCJcclxuICAgIChwb2ludGVydXApPVwiIW1vZGFsLm9wZW5lZCAmJiBvbk1vdXNlVXAoJGV2ZW50KVwiXHJcbiAgICAjYm9hcmRSZWZcclxuPlxyXG4gICAgPGRpdiBpZD1cImRyYWdcIj5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIGNsYXNzPVwiYm9hcmQtcm93XCJcclxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IHJvdyBvZiBlbmdpbmVGYWNhZGUuYm9hcmQuYm9hcmQ7IGxldCBpID0gaW5kZXhcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJib2FyZC1jb2xcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmN1cnJlbnQtc2VsZWN0aW9uXT1cImVuZ2luZUZhY2FkZS5ib2FyZC5pc1hZSW5BY3RpdmVNb3ZlKGksailcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLmRlc3QtbW92ZV09XCJlbmdpbmVGYWNhZGUuYm9hcmQuaXNYWUluRGVzdE1vdmUoaSxqKVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3Mua2luZy1jaGVja109XCIgZW5naW5lRmFjYWRlLmJvYXJkLmlzS2luZ0NoZWNrZWQoZW5naW5lRmFjYWRlLmJvYXJkLmdldFBpZWNlQnlQb2ludChpLGopKVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MucG9pbnQtY2lyY2xlXT1cImVuZ2luZUZhY2FkZS5ib2FyZC5pc1hZSW5Qb2ludFNlbGVjdGlvbihpLCBqKVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MucG9zc2libGUtY2FwdHVyZV09XCJlbmdpbmVGYWNhZGUuYm9hcmQuaXNYWUluUG9zc2libGVDYXB0dXJlcyhpLCBqKVwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3MucG9zc2libGUtcG9pbnRdPVwiZW5naW5lRmFjYWRlLmJvYXJkLmlzWFlJblBvc3NpYmxlTW92ZXMoaSwgailcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLnNvdXJjZS1tb3ZlXT1cImVuZ2luZUZhY2FkZS5ib2FyZC5pc1hZSW5Tb3VyY2VNb3ZlKGksIGopXCJcclxuICAgICAgICAgICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cIigoaSArIGopICUgMiA9PT0gMCApID8gbGlnaHRUaWxlQ29sb3IgOiBkYXJrVGlsZUNvbG9yXCJcclxuICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBjb2wgb2Ygcm93OyBsZXQgaiA9IGluZGV4XCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInlDb29yZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmNvbG9yXT1cIihpICUgMiA9PT0gMCkgPyBsaWdodFRpbGVDb2xvciA6IGRhcmtUaWxlQ29sb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5mb250LXNpemUucHhdPVwicGllY2VTaXplIC8gNFwiXHJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzaG93Q29vcmRzICYmIGogPT09IDdcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHt7ZW5naW5lRmFjYWRlLmNvb3Jkcy55Q29vcmRzW2ldfX1cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ4Q29vcmRcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5jb2xvcl09XCIoaiAlIDIgPT09IDApID8gbGlnaHRUaWxlQ29sb3IgOiBkYXJrVGlsZUNvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICBbc3R5bGUuZm9udC1zaXplLnB4XT1cInBpZWNlU2l6ZSAvIDRcIlxyXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd0Nvb3JkcyAmJiBpID09PSA3XCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7e2VuZ2luZUZhY2FkZS5jb29yZHMueENvb3Jkc1tqXX19XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJlbmdpbmVGYWNhZGUuYm9hcmQuZ2V0UGllY2VCeVBvaW50KGksIGopIGFzIHBpZWNlXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImhlaWdodDoxMDAlOyB3aWR0aDoxMDAlXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjZGtEcmFnRGlzYWJsZWRdPVwiZW5naW5lRmFjYWRlLmRyYWdEaXNhYmxlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtpbm5lckhUTUxdPVwiZW5naW5lRmFjYWRlLnBpZWNlSWNvbk1hbmFnZXIuaXNEZWZhdWx0SWNvbnMoKSA/IGVuZ2luZUZhY2FkZS5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoaSxqKS5jb25zdGFudC5pY29uIDogJydcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCIncGllY2UnXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmZvbnQtc2l6ZV09XCJwaWVjZVNpemUgKyAncHgnXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiZW5naW5lRmFjYWRlLnBpZWNlSWNvbk1hbmFnZXIuaXNEZWZhdWx0SWNvbnMoKSA/ICcnIDogZ2V0Q3VzdG9tUGllY2VJY29ucyhlbmdpbmVGYWNhZGUuYm9hcmQuZ2V0UGllY2VCeVBvaW50KGksaikpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGNka0RyYWdFbmRlZCk9XCJkcmFnRW5kZWQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjZGtEcmFnU3RhcnRlZCk9XCJkcmFnU3RhcnQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNka0RyYWdcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxzdmdcclxuICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoXCJcclxuICAgICAgICBbYXR0ci53aWR0aF09XCJlbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGhcIlxyXG4gICAgICAgIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDowOyBwb2ludGVyLWV2ZW50czogbm9uZVwiXHJcbiAgICA+XHJcbiAgICAgICAgPGRlZnMgKm5nRm9yPVwibGV0IGNvbG9yIG9mIFsncmVkJywgJ2dyZWVuJywgJ2JsdWUnLCAnb3JhbmdlJ11cIj5cclxuICAgICAgICAgICAgPG1hcmtlclxyXG4gICAgICAgICAgICAgICAgW2lkXT1cImNvbG9yICsgJ0Fycm93J1wiXHJcbiAgICAgICAgICAgICAgICBtYXJrZXJIZWlnaHQ9XCIxM1wiXHJcbiAgICAgICAgICAgICAgICBtYXJrZXJXaWR0aD1cIjEzXCJcclxuICAgICAgICAgICAgICAgIG9yaWVudD1cImF1dG9cIlxyXG4gICAgICAgICAgICAgICAgcmVmWD1cIjlcIlxyXG4gICAgICAgICAgICAgICAgcmVmWT1cIjZcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8cGF0aFxyXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5maWxsXT1cImNvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICBkPVwiTTIsMiBMMiwxMSBMMTAsNiBMMiwyXCJcclxuICAgICAgICAgICAgICAgID48L3BhdGg+XHJcbiAgICAgICAgICAgIDwvbWFya2VyPlxyXG4gICAgICAgIDwvZGVmcz5cclxuICAgICAgICA8bGluZVxyXG4gICAgICAgICAgICBjbGFzcz1cImFycm93XCJcclxuICAgICAgICAgICAgW2F0dHIubWFya2VyLWVuZF09XCIndXJsKCMnICsgYXJyb3cuZW5kLmNvbG9yICsgJ0Fycm93KSdcIlxyXG4gICAgICAgICAgICBbYXR0ci5zdHJva2VdPVwiYXJyb3cuZW5kLmNvbG9yXCJcclxuICAgICAgICAgICAgW2F0dHIueDFdPVwiYXJyb3cuc3RhcnQueFwiXHJcbiAgICAgICAgICAgIFthdHRyLngyXT1cImFycm93LmVuZC54XCJcclxuICAgICAgICAgICAgW2F0dHIueTFdPVwiYXJyb3cuc3RhcnQueVwiXHJcbiAgICAgICAgICAgIFthdHRyLnkyXT1cImFycm93LmVuZC55XCJcclxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGFycm93IG9mIGVuZ2luZUZhY2FkZS5kcmF3UHJvdmlkZXIuYXJyb3dzJCB8IGFzeW5jXCJcclxuICAgICAgICA+PC9saW5lPlxyXG4gICAgICAgIDxjaXJjbGVcclxuICAgICAgICAgICAgW2F0dHIuY3hdPVwiY2lyY2xlLmRyYXdQb2ludC54XCJcclxuICAgICAgICAgICAgW2F0dHIuY3ldPVwiY2lyY2xlLmRyYXdQb2ludC55XCJcclxuICAgICAgICAgICAgW2F0dHIucl09XCJlbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggLyAxOFwiXHJcbiAgICAgICAgICAgIFthdHRyLnN0cm9rZV09XCJjaXJjbGUuZHJhd1BvaW50LmNvbG9yXCJcclxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGNpcmNsZSBvZiBlbmdpbmVGYWNhZGUuZHJhd1Byb3ZpZGVyLmNpcmNsZXMkIHwgYXN5bmNcIlxyXG4gICAgICAgICAgICBmaWxsLW9wYWNpdHk9XCIwLjBcIlxyXG4gICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCJcclxuICAgICAgICA+PC9jaXJjbGU+XHJcbiAgICA8L3N2Zz5cclxuICAgIDxhcHAtcGllY2UtcHJvbW90aW9uLW1vZGFsICNtb2RhbD48L2FwcC1waWVjZS1wcm9tb3Rpb24tbW9kYWw+XHJcbjwvZGl2PlxyXG4iXX0=