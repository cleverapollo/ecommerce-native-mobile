import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { LogService } from '@core/services/log.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router, private logger: LogService, private platform: Platform) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated.pipe(
      filter(isAuthenticated => { return isAuthenticated !== null }),
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.logger.info('auto login');
          this.router.navigateByUrl('/secure/home', { replaceUrl: true });
        } else {
          return true;
        }
      })
    )
  }

}
