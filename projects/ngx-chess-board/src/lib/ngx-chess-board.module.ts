import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxChessBoardComponent} from './ngx-chess-board.component';

@NgModule({
  declarations: [NgxChessBoardComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxChessBoardComponent]
})
export class NgxChessBoardModule { }
