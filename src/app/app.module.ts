import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxChessGameModule} from 'ngx-chess-board';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxChessGameModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
