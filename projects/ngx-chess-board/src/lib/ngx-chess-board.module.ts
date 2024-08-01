import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxChessBoardComponent } from './ngx-chess-board.component';
import { PiecePromotionModalComponent } from './piece-promotion/piece-promotion-modal/piece-promotion-modal.component';
import { NgxChessBoardService } from './service/ngx-chess-board.service';

@NgModule({
    declarations: [NgxChessBoardComponent, PiecePromotionModalComponent],
    imports: [CommonModule, DragDropModule],
    exports: [NgxChessBoardComponent],
})
export class NgxChessBoardModule {
    static forRoot(): ModuleWithProviders<NgxChessBoardModule> {
        return {
            ngModule: NgxChessBoardModule,
            providers: [NgxChessBoardService],
        };
    }
}
