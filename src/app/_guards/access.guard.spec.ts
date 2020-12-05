import { TestBed, async, inject } from '@angular/core/testing';

import { AccessGuard } from './access.guard';

describe('AccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessGuard]
    });
  });

  xit('should ...', inject([AccessGuard], (guard: AccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
