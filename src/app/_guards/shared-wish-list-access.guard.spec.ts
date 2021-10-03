import { TestBed, async, inject } from '@angular/core/testing';
import { AuthenticationService } from '@core/services/authentication.service';
import { BrowserService } from '@core/services/browser.service';
import { Platform } from '@ionic/angular';

import { SharedWishListAccessGuard } from './shared-wish-list-access.guard';

describe('SharedWishListAccessGuard', () => {

  let authService: any;
  let platform: any;
  let browserService: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SharedWishListAccessGuard, 
        { provide: AuthenticationService, useValue: authService },
        { provide: Platform, useValue: platform },
        { provide: BrowserService, useValue: browserService }
      ]
    });
  });

  it('should ...', inject([SharedWishListAccessGuard], (guard: SharedWishListAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
