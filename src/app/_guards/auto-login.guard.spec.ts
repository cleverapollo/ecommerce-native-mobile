import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { LogService } from '@core/services/log.service';

import { AutoLoginGuard } from './auto-login.guard';

describe('AutoLoginGuard', () => {

  let authService: AuthenticationService;
  let router: Router;
  let logger: LogService;
  let guard: AutoLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: LogService, useValue: logger }
      ]
    });
    guard = TestBed.inject(AutoLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
