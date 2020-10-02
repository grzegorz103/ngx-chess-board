import { DragDropModule } from '@angular/cdk/drag-drop';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxChessBoardComponent, PiecePromotionModalComponent } from 'ngx-chess-board';
import { AppComponent } from './app.component';
import { ActionsComponent } from './components/actions/actions.component';
import { FenComponent } from './components/fen/fen.component';
import { MovesComponent } from './components/moves/moves.component';
import { SettingsComponent } from './components/settings/settings.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, DragDropModule],
            declarations: [
                AppComponent,
                SettingsComponent,
                ActionsComponent,
                NgxChessBoardComponent,
                MovesComponent,
                FenComponent,
                PiecePromotionModalComponent,
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
