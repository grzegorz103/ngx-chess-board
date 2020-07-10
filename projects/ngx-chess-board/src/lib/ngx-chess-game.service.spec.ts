import { TestBed } from '@angular/core/testing';

import { NgxChessGameService } from './ngx-chess-game.service';

describe('NgxChessGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxChessGameService = TestBed.get(NgxChessGameService);
    expect(service).toBeTruthy();
  });
});
