import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { Logger } from '@core/services/log.service';

import { AutoLoginGuard } from './auto-login.guard';

describe('AutoLoginGuard', () => {

  const authService = {};
  const router = {};
  const logger = {};

  let guard: AutoLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: Logger, useValue: logger }
      ]
    });
    guard = TestBed.inject(AutoLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
