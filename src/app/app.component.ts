import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CacheService } from 'ionic-cache';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { AnalyticsService } from '@core/services/analytics.service';
const { StatusBar, App } = Plugins;

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

  private migrateCachedCredentials() {
    this.authService.removeDeprecatedAuthToken();
    this.authService.migrateSavedCredentials();
  }

}
