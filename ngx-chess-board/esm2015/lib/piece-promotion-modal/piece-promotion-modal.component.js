import { Component, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
const _c0 = ["myModal"];
export class PiecePromotionModalComponent {
    constructor() {
        this.opened = false;
    }
    open(closeCallback) {
        this.opened = true;
        this.onCloseCallback = closeCallback;
        this.modal.nativeElement.style.display = 'block';
    }
    changeSelection(index) {
        this.modal.nativeElement.style.display = 'none';
        this.opened = false;
        this.onCloseCallback(index);
    }
}
PiecePromotionModalComponent.ɵfac = function PiecePromotionModalComponent_Factory(t) { return new (t || PiecePromotionModalComponent)(); };
PiecePromotionModalComponent.ɵcmp = i0.ɵɵdefineComponent({ type: PiecePromotionModalComponent, selectors: [["app-piece-promotion-modal"]], viewQuery: function PiecePromotionModalComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, true);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.modal = _t.first);
    } }, decls: 13, vars: 0, consts: [[1, "container"], ["myModal", ""], [1, "wrapper"], [1, "content"], [1, "piece-wrapper"], [1, "piece", 3, "click"]], template: function PiecePromotionModalComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵelementStart(2, "div", 2);
        i0.ɵɵelementStart(3, "div", 3);
        i0.ɵɵelementStart(4, "div", 4);
        i0.ɵɵelementStart(5, "div", 5);
        i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_5_listener() { return ctx.changeSelection(1); });
        i0.ɵɵtext(6, "\u265B");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(7, "div", 5);
        i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_7_listener() { return ctx.changeSelection(2); });
        i0.ɵɵtext(8, "\u265C");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(9, "div", 5);
        i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_9_listener() { return ctx.changeSelection(3); });
        i0.ɵɵtext(10, "\u265D");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(11, "div", 5);
        i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_11_listener() { return ctx.changeSelection(4); });
        i0.ɵɵtext(12, "\u265E");
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } }, styles: [".container[_ngcontent-%COMP%]{background-color:rgba(0,0,0,.4);color:#000;display:none;overflow:auto;position:absolute;top:0;z-index:1}.container[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]{height:100%;width:100%}.content[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]{position:relative}.content[_ngcontent-%COMP%]{background-color:#fefefe;border:1px solid #888;font-size:100%;height:40%;margin:auto;padding:10px;top:30%;width:90%}.piece[_ngcontent-%COMP%]{cursor:pointer;display:inline-block;font-size:5rem;height:100%;width:25%}.piece[_ngcontent-%COMP%]:hover{background-color:#ccc;border-radius:5px}.piece-wrapper[_ngcontent-%COMP%]{height:80%;width:100%}#close-button[_ngcontent-%COMP%]{background-color:#4caf50;border:none;border-radius:4px;color:#fff;display:inline-block;padding-left:5px;padding-right:5px;text-align:center;text-decoration:none}.selected[_ngcontent-%COMP%]{border:2px solid #00b919;border-radius:4px;box-sizing:border-box}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PiecePromotionModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-piece-promotion-modal',
                templateUrl: './piece-promotion-modal.component.html',
                styleUrls: ['./piece-promotion-modal.component.scss']
            }]
    }], null, { modal: [{
            type: ViewChild,
            args: ['myModal', { static: false }]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvcGllY2UtcHJvbW90aW9uLW1vZGFsL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQudHMiLCJsaWIvcGllY2UtcHJvbW90aW9uLW1vZGFsL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFzQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7OztBQVN2RSxNQUFNLE9BQU8sNEJBQTRCO0lBTHpDO1FBU0ksV0FBTSxHQUFHLEtBQUssQ0FBQztLQWVsQjtJQVpHLElBQUksQ0FBQyxhQUFzQztRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsZUFBZSxHQUFHLGFBQWEsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNyRCxDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDOzt3R0FqQlEsNEJBQTRCO2lFQUE1Qiw0QkFBNEI7Ozs7OztRQ1R6QyxpQ0FDSTtRQUFBLDhCQUNJO1FBQUEsOEJBQ0k7UUFBQSw4QkFDSTtRQUFBLDhCQUFnRDtRQUE3QixzR0FBUyxvQkFBZ0IsQ0FBQyxDQUFDLElBQUM7UUFBQyxzQkFBUTtRQUFBLGlCQUFNO1FBQzlELDhCQUFnRDtRQUE3QixzR0FBUyxvQkFBZ0IsQ0FBQyxDQUFDLElBQUM7UUFBQyxzQkFBUTtRQUFBLGlCQUFNO1FBQzlELDhCQUFnRDtRQUE3QixzR0FBUyxvQkFBZ0IsQ0FBQyxDQUFDLElBQUM7UUFBQyx1QkFBUTtRQUFBLGlCQUFNO1FBQzlELCtCQUFnRDtRQUE3Qix1R0FBUyxvQkFBZ0IsQ0FBQyxDQUFDLElBQUM7UUFBQyx1QkFBUTtRQUFBLGlCQUFNO1FBQ2xFLGlCQUFNO1FBQ1YsaUJBQU07UUFDVixpQkFBTTtRQUNWLGlCQUFNOztrRERGTyw0QkFBNEI7Y0FMeEMsU0FBUztlQUFDO2dCQUNQLFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLFdBQVcsRUFBRSx3Q0FBd0M7Z0JBQ3JELFNBQVMsRUFBRSxDQUFDLHdDQUF3QyxDQUFDO2FBQ3hEO2dCQUcwQyxLQUFLO2tCQUEzQyxTQUFTO21CQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1BpZWNlfSBmcm9tICcuLi9tb2RlbHMvcGllY2VzL3BpZWNlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhcHAtcGllY2UtcHJvbW90aW9uLW1vZGFsJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vcGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFBpZWNlUHJvbW90aW9uTW9kYWxDb21wb25lbnQge1xyXG5cclxuICAgIEBWaWV3Q2hpbGQoJ215TW9kYWwnLCB7c3RhdGljOiBmYWxzZX0pIG1vZGFsOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIG9wZW5lZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBvbkNsb3NlQ2FsbGJhY2s6IChpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuICAgIG9wZW4oY2xvc2VDYWxsYmFjazogKGluZGV4OiBudW1iZXIpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vbkNsb3NlQ2FsbGJhY2sgPSBjbG9zZUNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMubW9kYWwubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VTZWxlY3Rpb24oaW5kZXg6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjayhpbmRleCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIjxkaXYgI215TW9kYWwgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpZWNlLXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWVjZVwiIChjbGljayk9XCJjaGFuZ2VTZWxlY3Rpb24oMSlcIj4mI3gyNjVCOzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpZWNlXCIgKGNsaWNrKT1cImNoYW5nZVNlbGVjdGlvbigyKVwiPiYjeDI2NUM7PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGllY2VcIiAoY2xpY2spPVwiY2hhbmdlU2VsZWN0aW9uKDMpXCI+JiN4MjY1RDs8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWVjZVwiIChjbGljayk9XCJjaGFuZ2VTZWxlY3Rpb24oNClcIj4mI3gyNjVFOzwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuIl19