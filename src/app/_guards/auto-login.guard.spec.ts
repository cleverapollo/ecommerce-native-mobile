import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { Logger } from '@core/services/log.service';

import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { AutoLoginGuard } from './auto-login.guard';

describe('AutoLoginGuard', () => {

  let router = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  let logger = jasmine.createSpyObj('Logger', ['info']);

  beforeEach(() => {
    router.navigateByUrl.calls.reset();
  })


  it('redirects user to wish list overview page', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: { isAuthenticated: of(true) } },
        { provide: UserProfileStore, useValue: { isCreatorAccountActive$: of(false) } },
        { provide: Router, useValue: router },
        { provide: Logger, useValue: logger }
      ]
    });
    const guard = TestBed.inject(AutoLoginGuard);
    expect(guard).toBeTruthy();

    guard.canLoad().pipe(
      first()
    ).subscribe({
      next: canLoad => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/secure/home', { replaceUrl: true });
        expect(canLoad).toBeFalsy();
      },
      error: error => fail(error)
    });
  });

  it('redirects user to product list overview page', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: { isAuthenticated: of(true) } },
        { provide: UserProfileStore, useValue: { isCreatorAccountActive$: of(true) } },
        { provide: Router, useValue: router },
        { provide: Logger, useValue: logger }
      ]
    });
    const guard = TestBed.inject(AutoLoginGuard);
    expect(guard).toBeTruthy();

    guard.canLoad().pipe(
      first()
    ).subscribe({
      next: canLoad => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/secure/product-lists/product-list-overview', { replaceUrl: true });
        expect(canLoad).toBeFalsy();
      },
      error: error => fail(error)
    });
  });

  it('doesn\'t make automatic login', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: { isAuthenticated: of(false) } },
        { provide: UserProfileStore, useValue: { isCreatorAccountActive$: of(true) } },
        { provide: Router, useValue: router },
        { provide: Logger, useValue: logger }
      ]
    });
    const guard = TestBed.inject(AutoLoginGuard);
    expect(guard).toBeTruthy();

    guard.canLoad().pipe(
      first()
    ).subscribe({
      next: canLoad => {
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(canLoad).toBeTruthy();
      },
      error: error => fail(error)
    });
  });
});
