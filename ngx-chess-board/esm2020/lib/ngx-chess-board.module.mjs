import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChessBoardComponent } from './ngx-chess-board.component';
import { PiecePromotionModalComponent } from './piece-promotion/piece-promotion-modal/piece-promotion-modal.component';
import { NgxChessBoardService } from './service/ngx-chess-board.service';
import * as i0 from "@angular/core";
export class NgxChessBoardModule {
    static forRoot() {
        return {
            ngModule: NgxChessBoardModule,
            providers: [NgxChessBoardService],
        };
    }
}
NgxChessBoardModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: NgxChessBoardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxChessBoardModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: NgxChessBoardModule, declarations: [NgxChessBoardComponent, PiecePromotionModalComponent], imports: [CommonModule, DragDropModule], exports: [NgxChessBoardComponent] });
NgxChessBoardModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: NgxChessBoardModule, imports: [[CommonModule, DragDropModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: NgxChessBoardModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NgxChessBoardComponent, PiecePromotionModalComponent],
                    imports: [CommonModule, DragDropModule],
                    exports: [NgxChessBoardComponent],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvbGliL25neC1jaGVzcy1ib2FyZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQztBQUN2SCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFPekUsTUFBTSxPQUFPLG1CQUFtQjtJQUM1QixNQUFNLENBQUMsT0FBTztRQUNWLE9BQU87WUFDSCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQ3BDLENBQUM7SUFDTixDQUFDOztnSEFOUSxtQkFBbUI7aUhBQW5CLG1CQUFtQixpQkFKYixzQkFBc0IsRUFBRSw0QkFBNEIsYUFDekQsWUFBWSxFQUFFLGNBQWMsYUFDNUIsc0JBQXNCO2lIQUV2QixtQkFBbUIsWUFIbkIsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDOzJGQUc5QixtQkFBbUI7a0JBTC9CLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsNEJBQTRCLENBQUM7b0JBQ3BFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUM7b0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5neENoZXNzQm9hcmRDb21wb25lbnQgfSBmcm9tICcuL25neC1jaGVzcy1ib2FyZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50IH0gZnJvbSAnLi9waWVjZS1wcm9tb3Rpb24vcGllY2UtcHJvbW90aW9uLW1vZGFsL3BpZWNlLXByb21vdGlvbi1tb2RhbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hDaGVzc0JvYXJkU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9uZ3gtY2hlc3MtYm9hcmQuc2VydmljZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgZGVjbGFyYXRpb25zOiBbTmd4Q2hlc3NCb2FyZENvbXBvbmVudCwgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudF0sXHJcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBEcmFnRHJvcE1vZHVsZV0sXHJcbiAgICBleHBvcnRzOiBbTmd4Q2hlc3NCb2FyZENvbXBvbmVudF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hDaGVzc0JvYXJkTW9kdWxlIHtcclxuICAgIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4Q2hlc3NCb2FyZE1vZHVsZT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5nTW9kdWxlOiBOZ3hDaGVzc0JvYXJkTW9kdWxlLFxyXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtOZ3hDaGVzc0JvYXJkU2VydmljZV0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iXX0=