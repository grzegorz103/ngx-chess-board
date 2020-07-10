import { NgModule } from '@angular/core';
import {NgxChessGameComponent} from "./ngx-chess-game.component";
import {CommonModule} from "@angular/common";



@NgModule({
  declarations: [NgxChessGameComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxChessGameComponent]
})
export class NgxChessGameModule { }
