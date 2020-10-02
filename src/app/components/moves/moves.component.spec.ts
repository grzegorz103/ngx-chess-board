import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovesComponent } from './moves.component';

describe('MovesComponent', () => {
  let component: MovesComponent;
  let fixture: ComponentFixture<MovesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
