import { TestBed } from '@angular/core/testing';

import { CreatorPageGuard } from './creator-page.guard';

describe('CreatorPageGuard', () => {
  let guard: CreatorPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreatorPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
