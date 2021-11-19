import { Component, Input, ViewChild } from '@angular/core';
export class PiecePromotionModalComponent {
    constructor() {
        this.color = 'white';
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
    getPieceIcon(piece) {
        let coloredPiece = '';
        switch (piece.toLowerCase()) {
            case 'queen':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteQueenUrl : this.pieceIconInput.blackQueenUrl;
                break;
            case 'rook':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteRookUrl : this.pieceIconInput.blackRookUrl;
                break;
            case 'bishop':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteBishopUrl : this.pieceIconInput.blackBishopUrl;
                break;
            case 'knight':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteKnightUrl : this.pieceIconInput.blackKnightUrl;
                break;
        }
        return coloredPiece;
    }
}
PiecePromotionModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-piece-promotion-modal',
                template: "<div #myModal class=\"container\">\r\n    <div class=\"wrapper\">\r\n        <div class=\"content\">\r\n            <div class=\"piece-wrapper\" *ngIf=\"pieceIconInput\">\r\n                <div class=\"piece\" (click)=\"changeSelection(1)\">\r\n                    <img [src]=\"getPieceIcon('queen')\" alt=\"Queen\">\r\n                </div>\r\n                <div class=\"piece\" (click)=\"changeSelection(2)\">\r\n                    <img [src]=\"getPieceIcon('rook')\" alt=\"Rook\">\r\n                </div>\r\n                <div class=\"piece\" (click)=\"changeSelection(3)\">\r\n                    <img [src]=\"getPieceIcon('bishop')\" alt=\"Bishop\">\r\n                </div>\r\n                <div class=\"piece\" (click)=\"changeSelection(4)\">\r\n                    <img [src]=\"getPieceIcon('knight')\" alt=\"Knight\">\r\n                </div>\r\n            </div>\r\n            <div class=\"piece-wrapper\" *ngIf=\"!pieceIconInput\">\r\n                <div class=\"piece\" (click)=\"changeSelection(1)\">&#x265B;</div>\r\n                <div class=\"piece\" (click)=\"changeSelection(2)\">&#x265C;</div>\r\n                <div class=\"piece\" (click)=\"changeSelection(3)\">&#x265D;</div>\r\n                <div class=\"piece\" (click)=\"changeSelection(4)\">&#x265E;</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                styles: [".container{background-color:rgba(0,0,0,.4);color:#000;display:none;overflow:auto;position:absolute;top:0;z-index:9999}.container,.wrapper{height:100%;width:100%}.content,.wrapper{position:relative}.content{background-color:#fefefe;border:1px solid #888;font-size:100%;height:40%;margin:auto;padding:10px;top:30%;width:90%}.piece{cursor:pointer;display:inline-block;font-size:5rem;height:100%;text-align:center;width:25%}.piece img{max-width:100%}.piece:hover{background-color:#ccc;border-radius:5px}.piece-wrapper{height:80%;width:100%}#close-button{background-color:#4caf50;border:none;border-radius:4px;color:#fff;display:inline-block;padding-left:5px;padding-right:5px;text-align:center;text-decoration:none}.selected{border:2px solid #00b919;border-radius:4px;box-sizing:border-box}"]
            },] }
];
PiecePromotionModalComponent.propDecorators = {
    modal: [{ type: ViewChild, args: ['myModal', { static: false },] }],
    pieceIconInput: [{ type: Input }],
    color: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVF4RSxNQUFNLE9BQU8sNEJBQTRCO0lBTHpDO1FBYUksVUFBSyxHQUFHLE9BQU8sQ0FBQztRQUVoQixXQUFNLEdBQUcsS0FBSyxDQUFDO0lBa0NuQixDQUFDO0lBL0JHLElBQUksQ0FBQyxhQUFzQztRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsZUFBZSxHQUFHLGFBQWEsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNyRCxDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3pCLEtBQUssT0FBTztnQkFDUixZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQztnQkFDOUcsTUFBTTtZQUNWLEtBQUssTUFBTTtnQkFDUCxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQztnQkFDNUcsTUFBTTtZQUNWLEtBQUssUUFBUTtnQkFDVCxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztnQkFDaEgsTUFBTTtZQUNWLEtBQUssUUFBUTtnQkFDVCxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztnQkFDaEgsTUFBTTtTQUNiO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQzs7O1lBaERKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxxMkNBQXFEOzthQUV4RDs7O29CQUdJLFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDOzZCQUVwQyxLQUFLO29CQUdMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUGllY2VJY29uSW5wdXQgfSBmcm9tICcuLi8uLi91dGlscy9pbnB1dHMvcGllY2UtaWNvbi1pbnB1dCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYXBwLXBpZWNlLXByb21vdGlvbi1tb2RhbCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vcGllY2UtcHJvbW90aW9uLW1vZGFsLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50IHtcclxuXHJcbiAgICBAVmlld0NoaWxkKCdteU1vZGFsJywge3N0YXRpYzogZmFsc2V9KSBtb2RhbDogRWxlbWVudFJlZjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgcGllY2VJY29uSW5wdXQ6IFBpZWNlSWNvbklucHV0O1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBjb2xvciA9ICd3aGl0ZSc7XHJcblxyXG4gICAgb3BlbmVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIG9uQ2xvc2VDYWxsYmFjazogKGluZGV4OiBudW1iZXIpID0+IHZvaWQ7XHJcblxyXG4gICAgb3BlbihjbG9zZUNhbGxiYWNrOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjayA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVNlbGVjdGlvbihpbmRleDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLm1vZGFsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrKGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQaWVjZUljb24ocGllY2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGNvbG9yZWRQaWVjZSA9ICcnO1xyXG4gICAgICAgIHN3aXRjaCAocGllY2UudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICBjYXNlICdxdWVlbic6XHJcbiAgICAgICAgICAgICAgICBjb2xvcmVkUGllY2UgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gdGhpcy5waWVjZUljb25JbnB1dC53aGl0ZVF1ZWVuVXJsIDogdGhpcy5waWVjZUljb25JbnB1dC5ibGFja1F1ZWVuVXJsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Jvb2snOlxyXG4gICAgICAgICAgICAgICAgY29sb3JlZFBpZWNlID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/IHRoaXMucGllY2VJY29uSW5wdXQud2hpdGVSb29rVXJsIDogdGhpcy5waWVjZUljb25JbnB1dC5ibGFja1Jvb2tVcmw7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnYmlzaG9wJzpcclxuICAgICAgICAgICAgICAgIGNvbG9yZWRQaWVjZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyB0aGlzLnBpZWNlSWNvbklucHV0LndoaXRlQmlzaG9wVXJsIDogdGhpcy5waWVjZUljb25JbnB1dC5ibGFja0Jpc2hvcFVybDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdrbmlnaHQnOlxyXG4gICAgICAgICAgICAgICAgY29sb3JlZFBpZWNlID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/IHRoaXMucGllY2VJY29uSW5wdXQud2hpdGVLbmlnaHRVcmwgOiB0aGlzLnBpZWNlSWNvbklucHV0LmJsYWNrS25pZ2h0VXJsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29sb3JlZFBpZWNlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==