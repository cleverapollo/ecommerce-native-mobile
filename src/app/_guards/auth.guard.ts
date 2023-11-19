import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService) { }

  canActivate(): Observable<boolean> {
    const isMock = !environment.production && environment.backendType === BackendConfigType.dev;
    return this.authService.isAuthenticated.pipe(
      filter(isAuthenticated => { return isAuthenticated !== null }),
      take(1),
      map(isAuthenticated => {
        if (isMock) { return true; }
        if (isAuthenticated === null) {
          return false;
        }
        return isAuthenticated;
      })
    )
  }
}
