import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxChessBoardComponent} from './ngx-chess-board.component';
import {NgxChessBoardService} from './service/ngx-chess-board.service';

@NgModule({
  declarations: [NgxChessBoardComponent],
  imports: [
    CommonModule
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
