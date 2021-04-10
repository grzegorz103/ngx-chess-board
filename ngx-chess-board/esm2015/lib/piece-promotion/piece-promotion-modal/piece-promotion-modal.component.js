import { Component, ViewChild } from '@angular/core';
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
PiecePromotionModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-piece-promotion-modal',
                template: "<div #myModal class=\"container\">\r\n    <div class=\"wrapper\">\r\n        <div class=\"content\">\r\n            <div class=\"piece-wrapper\">\r\n                <div class=\"piece\" (click)=\"changeSelection(1)\">&#x265B;</div>\r\n                <div class=\"piece\" (click)=\"changeSelection(2)\">&#x265C;</div>\r\n                <div class=\"piece\" (click)=\"changeSelection(3)\">&#x265D;</div>\r\n                <div class=\"piece\" (click)=\"changeSelection(4)\">&#x265E;</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                styles: [".container{background-color:rgba(0,0,0,.4);color:#000;display:none;overflow:auto;position:absolute;top:0;z-index:1}.container,.wrapper{height:100%;width:100%}.content,.wrapper{position:relative}.content{background-color:#fefefe;border:1px solid #888;font-size:100%;height:40%;margin:auto;padding:10px;top:30%;width:90%}.piece{cursor:pointer;display:inline-block;font-size:5rem;height:100%;width:25%}.piece:hover{background-color:#ccc;border-radius:5px}.piece-wrapper{height:80%;width:100%}#close-button{background-color:#4caf50;border:none;border-radius:4px;color:#fff;display:inline-block;padding-left:5px;padding-right:5px;text-align:center;text-decoration:none}.selected{border:2px solid #00b919;border-radius:4px;box-sizing:border-box}"]
            },] }
];
PiecePromotionModalComponent.propDecorators = {
    modal: [{ type: ViewChild, args: ['myModal', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQXNCLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQVN2RSxNQUFNLE9BQU8sNEJBQTRCO0lBTHpDO1FBU0ksV0FBTSxHQUFHLEtBQUssQ0FBQztJQWVuQixDQUFDO0lBWkcsSUFBSSxDQUFDLGFBQXNDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3JELENBQUM7SUFFRCxlQUFlLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7OztZQXRCSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMseWpCQUFxRDs7YUFFeEQ7OztvQkFHSSxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UGllY2V9IGZyb20gJy4uLy4uL21vZGVscy9waWVjZXMvcGllY2UnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2FwcC1waWVjZS1wcm9tb3Rpb24tbW9kYWwnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgnbXlNb2RhbCcsIHtzdGF0aWM6IGZhbHNlfSkgbW9kYWw6IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgb3BlbmVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIG9uQ2xvc2VDYWxsYmFjazogKGluZGV4OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gICAgb3BlbihjbG9zZUNhbGxiYWNrOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjayA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVNlbGVjdGlvbihpbmRleDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLm1vZGFsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrKGluZGV4KTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19