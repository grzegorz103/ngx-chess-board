import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxChessBoardComponent } from './ngx-chess-board.component';

describe('NgxChessGameComponent', () => {
  let component: NgxChessBoardComponent;
  let fixture: ComponentFixture<NgxChessBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxChessBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxChessBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
