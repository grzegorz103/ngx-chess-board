import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxChessGameComponent } from './ngx-chess-game.component';

describe('NgxChessGameComponent', () => {
  let component: NgxChessGameComponent;
  let fixture: ComponentFixture<NgxChessGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxChessGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxChessGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
