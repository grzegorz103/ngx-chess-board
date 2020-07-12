import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxChessBoardModule} from 'ngx-chess-board';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxChessBoardModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
