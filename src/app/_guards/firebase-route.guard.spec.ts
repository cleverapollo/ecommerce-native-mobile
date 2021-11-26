import { TestBed } from '@angular/core/testing';

import { FirebaseRouteGuard } from './firebase-route.guard';

describe('FirebaseRouteGuard', () => {
  let guard: FirebaseRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FirebaseRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
