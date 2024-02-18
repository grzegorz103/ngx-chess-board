import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { AppComponent } from './app.component';
import { ActionsComponent } from './components/actions/actions.component';
import { FenComponent } from './components/fen/fen.component';
import { MovesComponent } from './components/moves/moves.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
    declarations: [AppComponent, ActionsComponent, SettingsComponent, MovesComponent, FenComponent],
    imports: [BrowserModule, FormsModule, NgxChessBoardModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
