import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CacheService } from 'ionic-cache';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { UserService } from '@core/services/user.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { AuthService } from '@core/api/auth.service';
import { UserApiService } from '@core/api/user-api.service';
import { LoadingService } from '@core/services/loading.service';
import { first } from 'rxjs/operators';
const { SplashScreen, StatusBar, App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private cache: CacheService,
    private zone: NgZone,
    private router: Router,
    private logger: LogService,
    private userService: UserService,
    private userApiService: UserApiService,
    private authService: AuthenticationService,
    private authApiService: AuthService,
    private loadingService: LoadingService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        StatusBar.setStyle({ 
          style: StatusBarStyle.Light 
        });
        // handle universal links
        App.addListener('appUrlOpen', (data: any) => {
          this.onAppUrlOpen(data);
        });
        this.onAppStart()
        // app did become active
        this.platform.resume.subscribe(() => { 
          this.onAppResume();
        })
      } else {
        this.handlePossibleAccountActivation();
      }
      this.initCache();
      this.logger.info(`${AppComponent.name}: ${environment.debugMessage}`);
    });
  }

  private async onAppStart() {
    await this.handleAuthState();
  }

  private async onAppResume() {
    this.logger.debug('App on resume');
    await this.handleAuthState();
    await this.cache.clearGroup('wishList');
    await this.handlePossibleAccountActivation();
  }

  private handleAuthState(): Promise<void> {
    return new Promise<void>((resolve) => {
      const tokenIsExpired = this.authService.tokenIsExpired;
      if (tokenIsExpired) {
        SplashScreen.show().then(() => {
          this.authService.refreshExpiredToken().then(() => {
            resolve();
          }, () => {
            this.router.navigateByUrl('/login').finally(() => {
              SplashScreen.hide();
              resolve();
            });
          })
        })
      } else {
        SplashScreen.hide();
        resolve();
      }
    });
  }

  private async handlePossibleAccountActivation() {
    const isAuthenticated = await this.authService.isAuthenticated.toPromise();
    if (isAuthenticated && this.userService.accountIsEnabled === false) {
      this.logger.debug(isAuthenticated, this.userService.accountIsEnabled)
      this.activateAccount();
    }
  }

  private activateAccount() {
    this.loadingService.showLoadingSpinner();
    this.userApiService.getAccount().pipe(first()).subscribe({
      next: account => {
        if (account.isEnabled) {
          this.authApiService.refreshToken().pipe(first()).subscribe({
            next: jwtResponse => {
              this.authService.updateToken(jwtResponse.token).finally(() => {
                this.loadingService.dismissLoadingSpinner();
              });
            },
            error: errorResponse => {
              this.logger.error(errorResponse);
              this.loadingService.dismissLoadingSpinner();
            }
          })
        } else {
          this.loadingService.dismissLoadingSpinner();
        }
      }, 
      error: errorResponse => {
        this.logger.error(errorResponse);
        this.loadingService.dismissLoadingSpinner();
      }
    })
  }

  private initCache() {
    this.cache.setDefaultTTL(60 * 60);
    this.cache.setOfflineInvalidate(false);
  }

  private onAppUrlOpen(data: any) {
    this.zone.run(() => {
      const wanticDomain = "wantic.io";
      const firebaseDevDomain = "web.app";
      let pageUrl = null;
      if (data.url.includes(wanticDomain)) {
        pageUrl = data.url.split(wanticDomain).pop();
      } else if (data.url.includes(firebaseDevDomain)) {
        pageUrl = data.url.split(firebaseDevDomain).pop();
      }
      this.logger.info('universal link routes to: ', pageUrl);
      if (pageUrl) {
        this.router.navigateByUrl(pageUrl);
      }
    });
  }

}
