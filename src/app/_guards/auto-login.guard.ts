import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { filter, map, take } from 'rxjs/operators';
import { LogService } from '@core/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad  {

  constructor(
    private authService: AuthenticationService, 
    private router: Router,
    private logger: LogService
  ) {}

  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.logger.info('auto login');
          this.router.navigateByUrl('/secure/home', { replaceUrl: true });
        } else {
          return true;
        }
      })
    );
  }
  
}
