import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxChessGameComponent} from './ngx-chess-game.component';

@NgModule({
  declarations: [NgxChessGameComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxChessGameComponent]
})
export class NgxChessGameModule { }
