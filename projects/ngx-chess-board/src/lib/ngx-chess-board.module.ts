import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxChessBoardComponent} from './ngx-chess-board.component';
import {NgxChessBoardService} from './service/ngx-chess-board.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {PiecePromotionModalComponent} from './piece-promotion-modal/piece-promotion-modal.component';

@NgModule({
  declarations: [NgxChessBoardComponent, PiecePromotionModalComponent],
  imports: [
    CommonModule,
    DragDropModule,
  ],
  exports: [NgxChessBoardComponent]
})
export class NgxChessBoardModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxChessBoardModule,
      providers: [NgxChessBoardService]
    };
  }

}
