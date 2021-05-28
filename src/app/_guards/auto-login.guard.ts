import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { LogService } from '@core/services/log.service';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router, private logger: LogService) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.firebaseAccessToken.pipe(
      filter(token => { return token !== null }),
      take(1),
      map(token => {
        this.logger.error('auto login token', token);
        if (token) {
          this.logger.info('auto login');
          this.router.navigateByUrl('/secure/home', { replaceUrl: true });
        } else {
          return true;
        }
      })
    )
  }

}
