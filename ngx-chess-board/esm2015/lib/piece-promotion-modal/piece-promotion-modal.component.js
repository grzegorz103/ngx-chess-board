import { Component, ViewChild } from '@angular/core';
import { Color } from '../models/pieces/color';
export class PiecePromotionModalComponent {
    constructor() {
        this.selectedIndex = 0;
        this.Color = Color;
        this.opened = false;
    }
    open(color, closeCallback) {
        this.opened = true;
        this.color = color;
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
                template: "<div\r\n    class=\"container\"\r\n    #modal\r\n>\r\n    <div class=\"wrapper\">\r\n        <div\r\n            class=\"piece\"\r\n            [class.black-bishop]=\"piece === 'bishop' && color === Color.BLACK\"\r\n            [class.black-knight]=\"piece === 'knight' && color === Color.BLACK\"\r\n            [class.black-queen]=\"piece === 'queen' && color === Color.BLACK\"\r\n            [class.black-rook]=\"piece === 'rook' && color === Color.BLACK\"\r\n            [class.selected]=\"selectedIndex === index + 1\"\r\n            [class.white-bishop]=\"piece === 'bishop' && color === Color.WHITE\"\r\n            [class.white-knight]=\"piece === 'knight' && color === Color.WHITE\"\r\n            [class.white-queen]=\"piece === 'queen' && color === Color.WHITE\"\r\n            [class.white-rook]=\"piece === 'rook' && color === Color.WHITE\"\r\n            (click)=\"changeSelection(index + 1)\"\r\n            *ngFor=\"let piece of ['queen', 'rook', 'bishop', 'knight']; let index = index\"\r\n        >\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                styles: [".container{background-color:rgba(0,0,0,.4);color:#000;display:none;height:100%;overflow:auto;position:absolute;top:0;width:100%;z-index:1}.wrapper{background-color:#fff;display:flex}.content{height:100%}.piece{background-repeat:no-repeat;background-size:100%;border:2px solid grey;border-radius:4px;box-sizing:border-box;cursor:pointer;height:100px;margin:10px;width:25%}.piece:hover{background-color:rgba(0,0,0,.2)}#close-button{background-color:#4caf50;border:none;border-radius:4px;color:#fff;display:inline-block;padding-left:5px;padding-right:5px;text-align:center;text-decoration:none}.selected{border:2px solid #00b919}"]
            },] }
];
PiecePromotionModalComponent.propDecorators = {
    modal: [{ type: ViewChild, args: ['modal',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvcGllY2UtcHJvbW90aW9uLW1vZGFsL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBTy9DLE1BQU0sT0FBTyw0QkFBNEI7SUFMekM7UUFRSSxrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUVsQixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2QsV0FBTSxHQUFHLEtBQUssQ0FBQztJQWVuQixDQUFDO0lBWkcsSUFBSSxDQUFDLEtBQVksRUFBRSxhQUFzQztRQUNyRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsZUFBZSxHQUFHLGFBQWEsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNyRCxDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDOzs7WUF6QkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLGlqQ0FBcUQ7O2FBRXhEOzs7b0JBRUksU0FBUyxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uL21vZGVscy9waWVjZXMvY29sb3InO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2FwcC1waWVjZS1wcm9tb3Rpb24tbW9kYWwnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFBpZWNlUHJvbW90aW9uTW9kYWxDb21wb25lbnQge1xyXG4gICAgQFZpZXdDaGlsZCgnbW9kYWwnKSBtb2RhbDogRWxlbWVudFJlZjtcclxuXHJcbiAgICBzZWxlY3RlZEluZGV4ID0gMDtcclxuICAgIGNvbG9yOiBDb2xvcjtcclxuICAgIENvbG9yID0gQ29sb3I7XHJcbiAgICBvcGVuZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgb25DbG9zZUNhbGxiYWNrOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZDtcclxuXHJcbiAgICBvcGVuKGNvbG9yOiBDb2xvciwgY2xvc2VDYWxsYmFjazogKGluZGV4OiBudW1iZXIpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrID0gY2xvc2VDYWxsYmFjaztcclxuICAgICAgICB0aGlzLm1vZGFsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlU2VsZWN0aW9uKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm1vZGFsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrKGluZGV4KTtcclxuICAgIH1cclxufVxyXG4iXX0=