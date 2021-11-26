import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserManagementActionMode } from '@core/models/google-api.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseRouteGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const queryParamMap = route.queryParamMap;
    const mode = queryParamMap.get('mode');
    const oobCode = queryParamMap.get('oobCode');
    if (mode && oobCode) {
      return this.handleFirebaseLinks(mode, oobCode);
    } else {
      window.location.href = 'https://wantic.io';
      return true;
    }
  }

  private handleFirebaseLinks(modeString: string, oobCode: string): Promise<boolean> {
    const mode: UserManagementActionMode = UserManagementActionMode[modeString];
    if (mode === UserManagementActionMode.resetPassword) {
      return this.router.navigateByUrl(`/forgot-password/change-password?oobCode=${oobCode}`);
    } else if (mode === UserManagementActionMode.verifyEmail) {
      return this.router.navigateByUrl(`/email-verification?oobCode=${oobCode}`);
    }
    return Promise.resolve(false);
  }
  
}
