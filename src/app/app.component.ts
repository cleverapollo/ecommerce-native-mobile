import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CacheService } from 'ionic-cache';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { UserApiService } from '@core/api/user-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { filter, map, take } from 'rxjs/operators';
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
    private userApiService: UserApiService,
    private authService: AuthenticationService,
    private analyticsService: AnalyticsService,
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
        this.migrateCachedCredentials();
      }
      this.initCache();
      this.analyticsService.initAppsflyerSdk();
      this.logger.info(`${AppComponent.name}: ${environment.debugMessage}`);
      this.autoLogin();
    });
  }

  private async onAppStart() {
    await this.migrateCachedCredentials();
  }

  private async onAppResume() {
    await this.migrateCachedCredentials();
    await this.cache.clearGroup('wishList');
  }

  private initCache() {
    this.cache.setDefaultTTL(60 * 60);
    this.cache.setOfflineInvalidate(false);
  }

  private autoLogin() {
    this.authService.isAuthenticated.pipe(
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

  private async migrateCachedCredentials() {
    if (!this.platform.is('capacitor')) { return }
    const legacyJwTokenExists = await this.authService.legacyJwTokenExists();
    if (legacyJwTokenExists) {
      await SplashScreen.show({ autoHide: false });
      await this.authService.removeDeprecatedAuthToken();
      const credentials = await this.authService.migrateSavedCredentials();
      if (credentials !== null) {
        const uid = await this.authService.createFirebaseAccountForExistingUser(credentials.email, credentials.password);
        if (uid !== null) {
          await this.userApiService.partialUpdateFirebaseUid(uid).toPromise();
          this.router.navigateByUrl('/secure/home/wish-list-overview').finally(() => {
            SplashScreen.hide();
          });
        } else {
          SplashScreen.hide();
        }
      } else {
        this.router.navigateByUrl('/login').finally(() => {
          SplashScreen.hide();
        });
      }
    }
  }



}
