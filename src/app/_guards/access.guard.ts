import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate  {

  constructor(private platform: Platform, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!environment.production) {
      return true;
    }  
    
    if (this.platform.is('hybrid')) {
       return true;
    } else {
      const token = route.queryParamMap.get('emailVerificationToken'); 
      if (token !== null) {
        this.router.navigateByUrl('/email-verification', { queryParams: {
          emailVerificationToken: token
        }});
      } else {
        window.location.href = "https://www.wantic.io/";
      }
      return false;
     }
  }
  
}
