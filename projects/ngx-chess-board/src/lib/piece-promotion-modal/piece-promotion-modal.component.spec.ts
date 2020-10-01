import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecePromotionModalComponent } from './piece-promotion-modal.component';

describe('PiecePromotionModalComponent', () => {
    let component: PiecePromotionModalComponent;
    let fixture: ComponentFixture<PiecePromotionModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PiecePromotionModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PiecePromotionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
