import { TestBed } from '@angular/core/testing';

import { NgxChessBoardService } from './ngx-chess-board.service';

describe('NgxChessBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxChessBoardService = TestBed.get(NgxChessBoardService);
    expect(service).toBeTruthy();
  });
});
