import { Component, EventEmitter, HostListener, Input, Output, ViewChild, } from '@angular/core';
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
        this.calculatePieceSize();
    }
    ngAfterViewInit() {
        this.engineFacade.modal = this.modal;
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
        this.boardLoader.setBoard(this.engineFacade.board);
        this.engineFacade.board.possibleCaptures = [];
        this.engineFacade.board.possibleMoves = [];
    }
    setFEN(fen) {
        try {
            this.engineFacade.boardLoader.loadFEN(fen);
            this.engineFacade.board.possibleCaptures = [];
            this.engineFacade.board.possibleMoves = [];
            this.engineFacade.coords.reset();
        }
        catch (exception) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC50cyIsImxpYi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUVILFNBQVMsRUFFVCxZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ1MsU0FBUyxHQUMzQixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBR3RELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQU12QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7OztJQ0E5QixnQ0FNSTtJQUFBLFlBQ0o7SUFBQSxpQkFBTzs7OztJQUxILHdGQUE4RCwwQ0FBQTtJQUk5RCxlQUNKO0lBREksMEVBQ0o7OztJQUNBLGdDQU1JO0lBQUEsWUFDSjtJQUFBLGlCQUFPOzs7O0lBTEgseUZBQThELDBDQUFBO0lBSTlELGVBQ0o7SUFESSwyRUFDSjs7OztJQUNBLCtCQUlJO0lBQUEsK0JBVU07SUFKRixnT0FBa0MsdU5BQUE7SUFJdEMsaUJBQU07SUFDVixpQkFBTTs7Ozs7SUFQRSxlQUFvQztJQUFwQyxxREFBb0M7SUFIcEMsbUVBQTZDLHFLQUFBLG9CQUFBLCtKQUFBOzs7SUFqQ3pELCtCQVlJO0lBQUEsc0ZBTUk7SUFFSixzRkFNSTtJQUVKLG9GQUlJO0lBWVIsaUJBQU07Ozs7O0lBbkNGLDJHQUFnRjtJQVBoRiw0RkFBb0Usb0VBQUEsK0dB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QkFBQyxVQUFVO1lBR3JCLEtBQUs7a0JBREosU0FBUzttQkFBQyxPQUFPO1lBaUJQLElBQUk7a0JBRGQsS0FBSzttQkFBQyxNQUFNO1lBZ0JGLFFBQVE7a0JBRGxCLEtBQUs7bUJBQUMsVUFBVTtZQU1OLFlBQVk7a0JBRHRCLEtBQUs7bUJBQUMsY0FBYztZQU1WLFlBQVk7a0JBRHRCLEtBQUs7bUJBQUMsY0FBYztZQU1WLFVBQVU7a0JBRHBCLEtBQUs7bUJBQUMsWUFBWTtZQU1SLGFBQWE7a0JBRHZCLEtBQUs7bUJBQUMsZUFBZTtZQU1YLFlBQVk7a0JBRHRCLEtBQUs7bUJBQUMsY0FBYztZQU1yQixZQUFZO2tCQURYLFlBQVk7bUJBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2RrRHJhZ0VuZCwgQ2RrRHJhZ1N0YXJ0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XG5pbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbnB1dCxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBTaW1wbGVDaGFuZ2VzLCBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQm9hcmRMb2FkZXIgfSBmcm9tICcuL2VuZ2luZS9ib2FyZC1zdGF0ZS1wcm92aWRlci9ib2FyZC1sb2FkZXInO1xuXG5pbXBvcnQgeyBDbGlja1V0aWxzIH0gZnJvbSAnLi9lbmdpbmUvY2xpY2svY2xpY2stdXRpbHMnO1xuaW1wb3J0IHsgRW5naW5lRmFjYWRlIH0gZnJvbSAnLi9lbmdpbmUvZW5naW5lLWZhY2FkZSc7XG5pbXBvcnQgeyBNb3ZlQ2hhbmdlIH0gZnJvbSAnLi9lbmdpbmUvbW92ZS1jaGFuZ2UnO1xuaW1wb3J0IHsgSGlzdG9yeU1vdmUgfSBmcm9tICcuL2hpc3RvcnktbW92ZS1wcm92aWRlci9oaXN0b3J5LW1vdmUnO1xuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuL21vZGVscy9ib2FyZCc7XG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4vbW9kZWxzL3BpZWNlcy9waWVjZSc7XG5pbXBvcnQgeyBOZ3hDaGVzc0JvYXJkVmlldyB9IGZyb20gJy4vbmd4LWNoZXNzLWJvYXJkLXZpZXcnO1xuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4vcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50JztcblxuaW1wb3J0IHsgTmd4Q2hlc3NCb2FyZFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2Uvbmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgUGllY2VJY29uSW5wdXQgfSBmcm9tICcuL3V0aWxzL2lucHV0cy9waWVjZS1pY29uLWlucHV0JztcbmltcG9ydCB7IFBpZWNlSWNvbklucHV0TWFuYWdlciB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLWljb24taW5wdXQtbWFuYWdlcic7XG5pbXBvcnQgeyBDb2xvcklucHV0LCBQaWVjZVR5cGVJbnB1dCB9IGZyb20gJy4vdXRpbHMvaW5wdXRzL3BpZWNlLXR5cGUtaW5wdXQnO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWNoZXNzLWJvYXJkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbmd4LWNoZXNzLWJvYXJkLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtY2hlc3MtYm9hcmQuY29tcG9uZW50LnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgTmd4Q2hlc3NCb2FyZENvbXBvbmVudFxuICAgIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE5neENoZXNzQm9hcmRWaWV3ICwgQWZ0ZXJWaWV3SW5pdHtcblxuICAgIEBJbnB1dCgpIGRhcmtUaWxlQ29sb3IgPSBDb25zdGFudHMuREVGQVVMVF9EQVJLX1RJTEVfQ09MT1I7XG4gICAgQElucHV0KCkgbGlnaHRUaWxlQ29sb3I6IHN0cmluZyA9IENvbnN0YW50cy5ERUZBVUxUX0xJR0hUX1RJTEVfQ09MT1I7XG4gICAgQElucHV0KCkgc2hvd0Nvb3JkcyA9IHRydWU7XG4gICAgLyoqXG4gICAgICogRW5hYmxpbmcgZnJlZSBtb2RlIHJlbW92ZXMgdHVybi1iYXNlZCByZXN0cmljdGlvbiBhbmQgYWxsb3dzIHRvIG1vdmUgYW55IHBpZWNlIGZyZWVseSFcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgbW92ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TW92ZUNoYW5nZT4oKTtcbiAgICBAT3V0cHV0KCkgY2hlY2ttYXRlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICAgIEBPdXRwdXQoKSBzdGFsZW1hdGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgICBAVmlld0NoaWxkKCdib2FyZFJlZicpXG4gICAgYm9hcmRSZWY6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnbW9kYWwnKVxuICAgIG1vZGFsOiBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50O1xuXG4gICAgcGllY2VTaXplOiBudW1iZXI7XG4gICAgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICBib2FyZExvYWRlcjogQm9hcmRMb2FkZXI7XG4gICAgcGllY2VJY29uTWFuYWdlcjogUGllY2VJY29uSW5wdXRNYW5hZ2VyO1xuICAgIGVuZ2luZUZhY2FkZTogRW5naW5lRmFjYWRlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hDaGVzc0JvYXJkU2VydmljZTogTmd4Q2hlc3NCb2FyZFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUgPSBuZXcgRW5naW5lRmFjYWRlKFxuICAgICAgICAgICAgbmV3IEJvYXJkKCksXG4gICAgICAgICAgICB0aGlzLm1vdmVDaGFuZ2VcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBASW5wdXQoJ3NpemUnKVxuICAgIHB1YmxpYyBzZXQgc2l6ZShzaXplOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2l6ZSAmJlxuICAgICAgICAgICAgc2l6ZSA+PSBDb25zdGFudHMuTUlOX0JPQVJEX1NJWkUgJiZcbiAgICAgICAgICAgIHNpemUgPD0gQ29uc3RhbnRzLk1BWF9CT0FSRF9TSVpFXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggPSBzaXplO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuaGVpZ2h0QW5kV2lkdGggPSBDb25zdGFudHMuREVGQVVMVF9TSVpFO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYXdQcm92aWRlci5jbGVhcigpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBpZWNlU2l6ZSgpO1xuICAgIH1cblxuICAgIEBJbnB1dCgnZnJlZU1vZGUnKVxuICAgIHB1YmxpYyBzZXQgZnJlZU1vZGUoZnJlZU1vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUuZnJlZU1vZGUgPSBmcmVlTW9kZTtcbiAgICB9XG5cbiAgICBASW5wdXQoJ2RyYWdEaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBkcmFnRGlzYWJsZWQoZHJhZ0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdEaXNhYmxlZCA9IGRyYWdEaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASW5wdXQoJ2RyYXdEaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBkcmF3RGlzYWJsZWQoZHJhd0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYXdEaXNhYmxlZCA9IGRyYXdEaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASW5wdXQoJ3BpZWNlSWNvbnMnKVxuICAgIHB1YmxpYyBzZXQgcGllY2VJY29ucyhwaWVjZUljb25zOiBQaWVjZUljb25JbnB1dCkge1xuICAgICAgICB0aGlzLnBpZWNlSWNvbk1hbmFnZXIucGllY2VJY29uSW5wdXQgPSBwaWVjZUljb25zO1xuICAgIH1cblxuICAgIEBJbnB1dCgnbGlnaHREaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBsaWdodERpc2FibGVkKGxpZ2h0RGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUubGlnaHREaXNhYmxlZCA9IGxpZ2h0RGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgQElucHV0KCdkYXJrRGlzYWJsZWQnKVxuICAgIHB1YmxpYyBzZXQgZGFya0Rpc2FibGVkKGRhcmtEaXNhYmxlZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kYXJrRGlzYWJsZWQgPSBkYXJrRGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnLCBbJyRldmVudCddKVxuICAgIG9uUmlnaHRDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGNoYW5nZXMubGlnaHREaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHREaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcikgfHxcbiAgICAgICAgICAgIChjaGFuZ2VzLmRhcmtEaXNhYmxlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZGFya0Rpc2FibGVkICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLmN1cnJlbnRXaGl0ZVBsYXllcilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZU1vdmVzID0gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5uZ3hDaGVzc0JvYXJkU2VydmljZS5jb21wb25lbnRNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5yZXNldCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQaWVjZVNpemUoKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm1vZGFsID0gdGhpcy5tb2RhbDtcbiAgICB9XG5cbiAgICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUub25Nb3VzZVVwKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0aGlzLmdldENsaWNrUG9pbnQoZXZlbnQpLFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmV2ZXJzZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5yZXZlcnNlKCk7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQm9hcmQoYm9hcmQ6IEJvYXJkKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkID0gYm9hcmQ7XG4gICAgICAgIHRoaXMuYm9hcmRMb2FkZXIuc2V0Qm9hcmQodGhpcy5lbmdpbmVGYWNhZGUuYm9hcmQpO1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5wb3NzaWJsZUNhcHR1cmVzID0gW107XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBzZXRGRU4oZmVuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmxvYWRGRU4oZmVuKTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlQ2FwdHVyZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkLnBvc3NpYmxlTW92ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmNvb3Jkcy5yZXNldCgpO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmJvYXJkTG9hZGVyLmFkZFBpZWNlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RkVOKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZUZhY2FkZS5ib2FyZC5mZW47XG4gICAgfVxuXG4gICAgZHJhZ0VuZGVkKGV2ZW50OiBDZGtEcmFnRW5kKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmRyYWdFbmRTdHJhdGVneS5wcm9jZXNzKGV2ZW50KTtcbiAgICB9XG5cbiAgICBkcmFnU3RhcnQoZXZlbnQ6IENka0RyYWdTdGFydCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5kcmFnU3RhcnRTdHJhdGVneS5wcm9jZXNzKGV2ZW50KTtcbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmVuZ2luZUZhY2FkZS5vbk1vdXNlRG93bihldmVudCwgdGhpcy5nZXRDbGlja1BvaW50KGV2ZW50KSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldENsaWNrUG9pbnQoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIENsaWNrVXRpbHMuZ2V0Q2xpY2tQb2ludChcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgdGhpcy5ib2FyZFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXG4gICAgICAgICAgICB0aGlzLmJvYXJkUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlUGllY2VTaXplKCkge1xuICAgICAgICB0aGlzLnBpZWNlU2l6ZSA9IHRoaXMuZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoIC8gMTA7XG4gICAgfVxuXG5cbiAgICBnZXRDdXN0b21QaWVjZUljb25zKHBpZWNlOiBQaWVjZSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShcbiAgICAgICAgICAgIGB7IFwiYmFja2dyb3VuZC1pbWFnZVwiOiBcInVybCgnJHt0aGlzLmVuZ2luZUZhY2FkZS5waWVjZUljb25NYW5hZ2VyLmdldFBpZWNlSWNvbihcbiAgICAgICAgICAgICAgICBwaWVjZVxuICAgICAgICAgICAgKX0nKVwifWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBtb3ZlKGNvb3Jkczogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLm1vdmUoY29vcmRzKTtcbiAgICB9XG5cbiAgICBnZXRNb3ZlSGlzdG9yeSgpOiBIaXN0b3J5TW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5naW5lRmFjYWRlLmdldE1vdmVIaXN0b3J5KCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgdW5kbygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbmdpbmVGYWNhZGUudW5kbygpO1xuICAgIH1cblxuICAgIGFkZFBpZWNlKFxuICAgICAgICBwaWVjZVR5cGVJbnB1dDogUGllY2VUeXBlSW5wdXQsXG4gICAgICAgIGNvbG9ySW5wdXQ6IENvbG9ySW5wdXQsXG4gICAgICAgIGNvb3Jkczogc3RyaW5nXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZW5naW5lRmFjYWRlLmFkZFBpZWNlKHBpZWNlVHlwZUlucHV0LCBjb2xvcklucHV0LCBjb29yZHMpO1xuICAgIH1cblxufVxuIiwiPGRpdlxuICAgIGlkPVwiYm9hcmRcIlxuICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoXCJcbiAgICBbc3R5bGUud2lkdGgucHhdPVwiZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoXCJcbiAgICAocG9pbnRlcmRvd24pPVwiIW1vZGFsLm9wZW5lZCAmJiBvbk1vdXNlRG93bigkZXZlbnQpXCJcbiAgICAocG9pbnRlcnVwKT1cIiFtb2RhbC5vcGVuZWQgJiYgb25Nb3VzZVVwKCRldmVudClcIlxuICAgICNib2FyZFJlZlxuPlxuICAgIDxkaXYgaWQ9XCJkcmFnXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiYm9hcmQtcm93XCJcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCByb3cgb2YgZW5naW5lRmFjYWRlLmJvYXJkLmJvYXJkOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYm9hcmQtY29sXCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY3VycmVudC1zZWxlY3Rpb25dPVwiZW5naW5lRmFjYWRlLmJvYXJkLmlzWFlJbkFjdGl2ZU1vdmUoaSxqKVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzLmRlc3QtbW92ZV09XCJlbmdpbmVGYWNhZGUuYm9hcmQuaXNYWUluRGVzdE1vdmUoaSxqKVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzLmtpbmctY2hlY2tdPVwiIGVuZ2luZUZhY2FkZS5ib2FyZC5pc0tpbmdDaGVja2VkKGVuZ2luZUZhY2FkZS5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoaSxqKSlcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5wb2ludC1jaXJjbGVdPVwiZW5naW5lRmFjYWRlLmJvYXJkLmlzWFlJblBvaW50U2VsZWN0aW9uKGksIGopXCJcbiAgICAgICAgICAgICAgICBbY2xhc3MucG9zc2libGUtY2FwdHVyZV09XCJlbmdpbmVGYWNhZGUuYm9hcmQuaXNYWUluUG9zc2libGVDYXB0dXJlcyhpLCBqKVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzLnBvc3NpYmxlLXBvaW50XT1cImVuZ2luZUZhY2FkZS5ib2FyZC5pc1hZSW5Qb3NzaWJsZU1vdmVzKGksIGopXCJcbiAgICAgICAgICAgICAgICBbY2xhc3Muc291cmNlLW1vdmVdPVwiZW5naW5lRmFjYWRlLmJvYXJkLmlzWFlJblNvdXJjZU1vdmUoaSwgailcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cIigoaSArIGopICUgMiA9PT0gMCApID8gbGlnaHRUaWxlQ29sb3IgOiBkYXJrVGlsZUNvbG9yXCJcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgY29sIG9mIHJvdzsgbGV0IGogPSBpbmRleFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ5Q29vcmRcIlxuICAgICAgICAgICAgICAgICAgICBbc3R5bGUuY29sb3JdPVwiKGkgJSAyID09PSAwKSA/IGxpZ2h0VGlsZUNvbG9yIDogZGFya1RpbGVDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5mb250LXNpemUucHhdPVwicGllY2VTaXplIC8gNFwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd0Nvb3JkcyAmJiBqID09PSA3XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt7ZW5naW5lRmFjYWRlLmNvb3Jkcy55Q29vcmRzW2ldfX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ4Q29vcmRcIlxuICAgICAgICAgICAgICAgICAgICBbc3R5bGUuY29sb3JdPVwiKGogJSAyID09PSAwKSA/IGxpZ2h0VGlsZUNvbG9yIDogZGFya1RpbGVDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZS5mb250LXNpemUucHhdPVwicGllY2VTaXplIC8gNFwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd0Nvb3JkcyAmJiBpID09PSA3XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt7ZW5naW5lRmFjYWRlLmNvb3Jkcy54Q29vcmRzW2pdfX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cImVuZ2luZUZhY2FkZS5ib2FyZC5nZXRQaWVjZUJ5UG9pbnQoaSwgaikgYXMgcGllY2VcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImhlaWdodDoxMDAlOyB3aWR0aDoxMDAlXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjZGtEcmFnRGlzYWJsZWRdPVwiZW5naW5lRmFjYWRlLmRyYWdEaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbaW5uZXJIVE1MXT1cImVuZ2luZUZhY2FkZS5waWVjZUljb25NYW5hZ2VyLmlzRGVmYXVsdEljb25zKCkgPyBlbmdpbmVGYWNhZGUuYm9hcmQuZ2V0UGllY2VCeVBvaW50KGksaikuY29uc3RhbnQuaWNvbiA6ICcnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIidwaWVjZSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmZvbnQtc2l6ZV09XCJwaWVjZVNpemUgKyAncHgnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImVuZ2luZUZhY2FkZS5waWVjZUljb25NYW5hZ2VyLmlzRGVmYXVsdEljb25zKCkgPyAnJyA6IGdldEN1c3RvbVBpZWNlSWNvbnMoZW5naW5lRmFjYWRlLmJvYXJkLmdldFBpZWNlQnlQb2ludChpLGopKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2RrRHJhZ0VuZGVkKT1cImRyYWdFbmRlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjZGtEcmFnU3RhcnRlZCk9XCJkcmFnU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjZGtEcmFnXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPHN2Z1xuICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoXCJcbiAgICAgICAgW2F0dHIud2lkdGhdPVwiZW5naW5lRmFjYWRlLmhlaWdodEFuZFdpZHRoXCJcbiAgICAgICAgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOjA7IHBvaW50ZXItZXZlbnRzOiBub25lXCJcbiAgICA+XG4gICAgICAgIDxkZWZzICpuZ0Zvcj1cImxldCBjb2xvciBvZiBbJ3JlZCcsICdncmVlbicsICdibHVlJywgJ29yYW5nZSddXCI+XG4gICAgICAgICAgICA8bWFya2VyXG4gICAgICAgICAgICAgICAgW2lkXT1cImNvbG9yICsgJ0Fycm93J1wiXG4gICAgICAgICAgICAgICAgbWFya2VySGVpZ2h0PVwiMTNcIlxuICAgICAgICAgICAgICAgIG1hcmtlcldpZHRoPVwiMTNcIlxuICAgICAgICAgICAgICAgIG9yaWVudD1cImF1dG9cIlxuICAgICAgICAgICAgICAgIHJlZlg9XCI5XCJcbiAgICAgICAgICAgICAgICByZWZZPVwiNlwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmZpbGxdPVwiY29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBkPVwiTTIsMiBMMiwxMSBMMTAsNiBMMiwyXCJcbiAgICAgICAgICAgICAgICA+PC9wYXRoPlxuICAgICAgICAgICAgPC9tYXJrZXI+XG4gICAgICAgIDwvZGVmcz5cbiAgICAgICAgPGxpbmVcbiAgICAgICAgICAgIGNsYXNzPVwiYXJyb3dcIlxuICAgICAgICAgICAgW2F0dHIubWFya2VyLWVuZF09XCIndXJsKCMnICsgYXJyb3cuZW5kLmNvbG9yICsgJ0Fycm93KSdcIlxuICAgICAgICAgICAgW2F0dHIuc3Ryb2tlXT1cImFycm93LmVuZC5jb2xvclwiXG4gICAgICAgICAgICBbYXR0ci54MV09XCJhcnJvdy5zdGFydC54XCJcbiAgICAgICAgICAgIFthdHRyLngyXT1cImFycm93LmVuZC54XCJcbiAgICAgICAgICAgIFthdHRyLnkxXT1cImFycm93LnN0YXJ0LnlcIlxuICAgICAgICAgICAgW2F0dHIueTJdPVwiYXJyb3cuZW5kLnlcIlxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGFycm93IG9mIGVuZ2luZUZhY2FkZS5kcmF3UHJvdmlkZXIuYXJyb3dzJCB8IGFzeW5jXCJcbiAgICAgICAgPjwvbGluZT5cbiAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgW2F0dHIuY3hdPVwiY2lyY2xlLmRyYXdQb2ludC54XCJcbiAgICAgICAgICAgIFthdHRyLmN5XT1cImNpcmNsZS5kcmF3UG9pbnQueVwiXG4gICAgICAgICAgICBbYXR0ci5yXT1cImVuZ2luZUZhY2FkZS5oZWlnaHRBbmRXaWR0aCAvIDE4XCJcbiAgICAgICAgICAgIFthdHRyLnN0cm9rZV09XCJjaXJjbGUuZHJhd1BvaW50LmNvbG9yXCJcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBjaXJjbGUgb2YgZW5naW5lRmFjYWRlLmRyYXdQcm92aWRlci5jaXJjbGVzJCB8IGFzeW5jXCJcbiAgICAgICAgICAgIGZpbGwtb3BhY2l0eT1cIjAuMFwiXG4gICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCJcbiAgICAgICAgPjwvY2lyY2xlPlxuICAgIDwvc3ZnPlxuICAgIDxhcHAtcGllY2UtcHJvbW90aW9uLW1vZGFsICNtb2RhbD48L2FwcC1waWVjZS1wcm9tb3Rpb24tbW9kYWw+XG48L2Rpdj5cbiJdfQ==