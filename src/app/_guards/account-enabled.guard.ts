import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountEnabledGuard implements CanActivate  {

  constructor(private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.$accountIsEnabled;
  }
}
