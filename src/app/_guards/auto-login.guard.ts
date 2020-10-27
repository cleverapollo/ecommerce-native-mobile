import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad  {

  constructor(private authService: AuthenticationService, private router: Router) {

  }

  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.info('auto login');
          this.router.navigateByUrl('/secure/home');
        } else {
          return true;
        }
      })
    );
  }
  
}
