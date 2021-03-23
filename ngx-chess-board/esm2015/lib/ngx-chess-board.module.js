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
NgxChessBoardModule.ɵmod = i0.ɵɵdefineNgModule({ type: NgxChessBoardModule });
NgxChessBoardModule.ɵinj = i0.ɵɵdefineInjector({ factory: function NgxChessBoardModule_Factory(t) { return new (t || NgxChessBoardModule)(); }, imports: [[CommonModule, DragDropModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgxChessBoardModule, { declarations: [NgxChessBoardComponent, PiecePromotionModalComponent], imports: [CommonModule, DragDropModule], exports: [NgxChessBoardComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxChessBoardModule, [{
        type: NgModule,
        args: [{
                declarations: [NgxChessBoardComponent, PiecePromotionModalComponent],
                imports: [CommonModule, DragDropModule],
                exports: [NgxChessBoardComponent],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvbmd4LWNoZXNzLWJvYXJkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHlFQUF5RSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOztBQU96RSxNQUFNLE9BQU8sbUJBQW1CO0lBQzVCLE1BQU0sQ0FBQyxPQUFPO1FBQ1YsT0FBTztZQUNILFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDcEMsQ0FBQztJQUNOLENBQUM7O3VEQU5RLG1CQUFtQjtxSEFBbkIsbUJBQW1CLGtCQUhuQixDQUFDLFlBQVksRUFBRSxjQUFjLENBQUM7d0ZBRzlCLG1CQUFtQixtQkFKYixzQkFBc0IsRUFBRSw0QkFBNEIsYUFDekQsWUFBWSxFQUFFLGNBQWMsYUFDNUIsc0JBQXNCO2tEQUV2QixtQkFBbUI7Y0FML0IsUUFBUTtlQUFDO2dCQUNOLFlBQVksRUFBRSxDQUFDLHNCQUFzQixFQUFFLDRCQUE0QixDQUFDO2dCQUNwRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzthQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neENoZXNzQm9hcmRDb21wb25lbnQgfSBmcm9tICcuL25neC1jaGVzcy1ib2FyZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGllY2VQcm9tb3Rpb25Nb2RhbENvbXBvbmVudCB9IGZyb20gJy4vcGllY2UtcHJvbW90aW9uL3BpZWNlLXByb21vdGlvbi1tb2RhbC9waWVjZS1wcm9tb3Rpb24tbW9kYWwuY29tcG9uZW50JztcbmltcG9ydCB7IE5neENoZXNzQm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlL25neC1jaGVzcy1ib2FyZC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtOZ3hDaGVzc0JvYXJkQ29tcG9uZW50LCBQaWVjZVByb21vdGlvbk1vZGFsQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBEcmFnRHJvcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW05neENoZXNzQm9hcmRDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hDaGVzc0JvYXJkTW9kdWxlIHtcbiAgICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5neENoZXNzQm9hcmRNb2R1bGU+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5nTW9kdWxlOiBOZ3hDaGVzc0JvYXJkTW9kdWxlLFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbTmd4Q2hlc3NCb2FyZFNlcnZpY2VdLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==