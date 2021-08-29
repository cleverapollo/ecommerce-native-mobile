import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CacheService } from 'ionic-cache';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { UserManagementActionMode } from '@core/models/google-api.model';
const { StatusBar, App, SplashScreen } = Plugins;

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
    private authService: AuthenticationService,
    private analyticsService: AnalyticsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        this.initNativeStatusBar();
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
    });
  }

  private initNativeStatusBar() {
    StatusBar.setStyle({
      style: StatusBarStyle.Light
    });
  }

  private async onAppStart() {
    this.migrateCachedCredentials();
  }

  private async onAppResume() {
    await this.cache.clearGroup('wishList');
  }

  private initCache() {
    this.cache.setDefaultTTL(60 * 60);
    this.cache.setOfflineInvalidate(false);
  }

  private onAppUrlOpen(data: any) {
    this.zone.run(() => {
      const url: URL = new URL(data.url);
      const mode = url.searchParams.get('mode');
      const oobCode = url.searchParams.get('oobCode');
      if (mode && oobCode) {
        this.handleFirebaseLinks(mode, oobCode);
      } else {
        this.router.navigateByUrl(url.pathname).finally(() => {
          SplashScreen.hide({
            fadeOutDuration: 500
          });
        });
      }
    });
  }

  private handleFirebaseLinks(modeString: string, oobCode: string) {
    const mode: UserManagementActionMode = UserManagementActionMode[modeString];
    if (mode === UserManagementActionMode.resetPassword) {
      this.router.navigateByUrl(`/forgot-password/change-password?oobCode=${oobCode}`).finally(() => {
        SplashScreen.hide({
          fadeOutDuration: 500
        });
      });
    } else if (mode === UserManagementActionMode.verifyEmail) {
      this.router.navigateByUrl(`/email-verification?oobCode=${oobCode}`).finally(() => {
        SplashScreen.hide({
          fadeOutDuration: 500
        });
      });
    }
  }

  private migrateCachedCredentials() {
    this.authService.removeDeprecatedAuthToken();
    this.authService.migrateSavedCredentials();
  }

}
