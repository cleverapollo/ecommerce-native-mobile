import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { map } from 'rxjs/operators';
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
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.logger.info('auto login');
          this.router.navigateByUrl('/secure/home');
        } else {
          return true;
        }
      })
    );
  }
  
}
