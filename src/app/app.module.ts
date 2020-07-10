import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxChessBoardModule} from 'ngx-chess-board';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxChessBoardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
