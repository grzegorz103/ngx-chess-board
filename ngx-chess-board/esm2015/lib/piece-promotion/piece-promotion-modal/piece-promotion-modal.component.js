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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50LnRzIiwibGliL3BpZWNlLXByb21vdGlvbi9waWVjZS1wcm9tb3Rpb24tbW9kYWwvcGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQXNCLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBU3ZFLE1BQU0sT0FBTyw0QkFBNEI7SUFMekM7UUFTSSxXQUFNLEdBQUcsS0FBSyxDQUFDO0tBZWxCO0lBWkcsSUFBSSxDQUFDLGFBQXNDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3JELENBQUM7SUFFRCxlQUFlLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7O3dHQWpCUSw0QkFBNEI7aUVBQTVCLDRCQUE0Qjs7Ozs7O1FDVHpDLGlDQUNJO1FBQUEsOEJBQ0k7UUFBQSw4QkFDSTtRQUFBLDhCQUNJO1FBQUEsOEJBQWdEO1FBQTdCLHNHQUFTLG9CQUFnQixDQUFDLENBQUMsSUFBQztRQUFDLHNCQUFRO1FBQUEsaUJBQU07UUFDOUQsOEJBQWdEO1FBQTdCLHNHQUFTLG9CQUFnQixDQUFDLENBQUMsSUFBQztRQUFDLHNCQUFRO1FBQUEsaUJBQU07UUFDOUQsOEJBQWdEO1FBQTdCLHNHQUFTLG9CQUFnQixDQUFDLENBQUMsSUFBQztRQUFDLHVCQUFRO1FBQUEsaUJBQU07UUFDOUQsK0JBQWdEO1FBQTdCLHVHQUFTLG9CQUFnQixDQUFDLENBQUMsSUFBQztRQUFDLHVCQUFRO1FBQUEsaUJBQU07UUFDbEUsaUJBQU07UUFDVixpQkFBTTtRQUNWLGlCQUFNO1FBQ1YsaUJBQU07O2tEREZPLDRCQUE0QjtjQUx4QyxTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsV0FBVyxFQUFFLHdDQUF3QztnQkFDckQsU0FBUyxFQUFFLENBQUMsd0NBQXdDLENBQUM7YUFDeEQ7Z0JBRzBDLEtBQUs7a0JBQTNDLFNBQVM7bUJBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UGllY2V9IGZyb20gJy4uLy4uL21vZGVscy9waWVjZXMvcGllY2UnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2FwcC1waWVjZS1wcm9tb3Rpb24tbW9kYWwnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgnbXlNb2RhbCcsIHtzdGF0aWM6IGZhbHNlfSkgbW9kYWw6IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgb3BlbmVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIG9uQ2xvc2VDYWxsYmFjazogKGluZGV4OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gICAgb3BlbihjbG9zZUNhbGxiYWNrOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjayA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVNlbGVjdGlvbihpbmRleDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLm1vZGFsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrKGluZGV4KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiPGRpdiAjbXlNb2RhbCBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGllY2Utd3JhcHBlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpZWNlXCIgKGNsaWNrKT1cImNoYW5nZVNlbGVjdGlvbigxKVwiPiYjeDI2NUI7PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGllY2VcIiAoY2xpY2spPVwiY2hhbmdlU2VsZWN0aW9uKDIpXCI+JiN4MjY1Qzs8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWVjZVwiIChjbGljayk9XCJjaGFuZ2VTZWxlY3Rpb24oMylcIj4mI3gyNjVEOzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpZWNlXCIgKGNsaWNrKT1cImNoYW5nZVNlbGVjdGlvbig0KVwiPiYjeDI2NUU7PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG4iXX0=