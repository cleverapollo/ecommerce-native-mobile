import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { Logger } from '@core/services/log.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Observable } from 'rxjs';
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
    return this.authService.isAuthenticated.pipe(
      filter(isAuthenticated => isAuthenticated !== null),
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.logger.info('no auto login');
          return true;
        }
        this.logger.info('auto login');
        this.router.navigateByUrl('/secure/home', { replaceUrl: true });
        return false;
      })
    )
  }

}
