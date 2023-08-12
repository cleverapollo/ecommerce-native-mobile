import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { Logger } from '@core/services/log.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(
    private authService: AuthenticationService,
    private userService: UserProfileStore,
    private router: Router,
    private logger: Logger
  ) { }

  canLoad(): Observable<boolean> {
    return combineLatest([this.authService.isAuthenticated, this.userService.isCreatorAccountActive$]).pipe(
      filter(state => { return state[0] !== null }),
      take(1),
      map(state => {
        if (!state[0]) {
          this.logger.info('no auto login');
          return true;
        }
        const url = state[1] ? '/secure/product-list-overview' : '/secure/home'
        this.logger.info('auto login');
        this.router.navigateByUrl(url, { replaceUrl: true });
        return false;
      })
    )
  }

}
