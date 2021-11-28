import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FirebaseRouteGuard } from './firebase-route.guard';

describe('FirebaseRouteGuard', () => {
  let guard: FirebaseRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])]
    });
    guard = TestBed.inject(FirebaseRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
