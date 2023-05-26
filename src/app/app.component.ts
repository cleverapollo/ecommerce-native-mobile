import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AffiliateDataStoreService } from '@core/data/affiliate-data-store.service';
import { ScriptName } from '@core/data/script-store';
import { UserManagementActionMode } from '@core/models/google-api.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { FirebaseService } from '@core/services/firebase.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { ScriptLoadingStatus, ScriptService } from '@core/services/script.service';
import { BackendConfigType } from '@env/backend-config-type';
import { CacheService } from 'ionic-cache';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platformService: PlatformService,
    private cache: CacheService,
    private zone: NgZone,
    private router: Router,
    private logger: Logger,
    private authService: AuthenticationService,
    private analyticsService: AnalyticsService,
    private affiliateDataStore: AffiliateDataStoreService,
    private scriptService: ScriptService,
    private firebaseService: FirebaseService
  ) {
    this.setupApp();
  }

  async setupApp() {
    await this.platformService.isReady();
    if (this.platformService.isNativePlatform) {
      this.setupNativeApp();
    } else {
      this.setupWebApp();
    }
    this.setupCache();
    this.analyticsService.initAppsflyerSdk();
    this.setupAffiliateData();
    this.firebaseService.listenToDeepLinkOpen();
    this.logger.info(`${AppComponent.name}: ${environment.debugMessage}`);
  }

  private setupCache() {
    this.cache.setDefaultTTL(60 * 60);
    this.cache.setOfflineInvalidate(false);
  }

  private setupAffiliateData() {
    if (this.authService.isAuthenticated.getValue()) {
      this.affiliateDataStore.loadData();
    }
  }

  /**
   * Setup code that is only relevant for web app.
   */
  private setupWebApp() {
    this.migrateCachedCredentials();
    this.loadWebAppScripts();
  }

  private loadWebAppScripts() {
    if (environment.backendType !== BackendConfigType.prod) {
      return;
    }
    this.scriptService.load(ScriptName.HOTJAR, ScriptName.GTM).then(results => {
      results.forEach(result => {
        this.logger.debug(`loaded script ${ScriptName[result.script]} with status ${ScriptLoadingStatus[result.status]}`, result);
      })
    })
  }

  /**
   * Setup code that is only relevant for ios and android.
   */
  private setupNativeApp() {
    // migrate Capacitor 2 data to Capator 3 data
    Preferences.migrate();

    this.setupStatusBar();
    // handle universal links
    App.addListener('appUrlOpen', (data: any) => {
      this.onAppUrlOpen(data);
    });
    this.onAppStart();
    // app did become active
    this.platformService.resume.subscribe(() => {
      this.onAppResume();
    });
  }

  private setupStatusBar() {
    StatusBar.setStyle({
      style: Style.Light
    });
    StatusBar.setOverlaysWebView({
      overlay: true
    });
  }

  private async onAppStart() {
    this.migrateCachedCredentials();
  }

  private async onAppResume() {
    await this.cache.clearGroup('wishList');
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
