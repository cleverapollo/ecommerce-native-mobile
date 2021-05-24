import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { BrowserService } from '@core/services/browser.service';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { APP_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedWishListAccessGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService, 
    private platform: Platform,
    private browserService: BrowserService
    ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canLoad(this.getResolvedUrl(route));
  }

  private async canLoad(urlString: string) {
    if (!this.platform.is('hybrid')) {
      return true
    } 

    if (this.authService.isAuthenticated) {
      return true;
    } else {
      this.browserService.openSystemBrowser(`${APP_URL}/${urlString}`);
      return false;
    }
  }

  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
    }
  
}
