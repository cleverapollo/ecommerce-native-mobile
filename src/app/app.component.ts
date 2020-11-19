import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CacheService } from 'ionic-cache';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('capacitor')) {
        StatusBar.setStyle({ style: StatusBarStyle.Light })
        SplashScreen.hide();
        this.initDeeplinks();
      }
      this.initCache();
      console.log(environment.debugMessage);
    });
  }

  private initCache() {
    this.cache.setDefaultTTL(60 * 60);
    this.cache.setOfflineInvalidate(false);
  }

  private initDeeplinks() {
    App.addListener('appUrlOpen', (data: any) => {
      this.zone.run(() => {
        const slug = data.url.split("wantic.io").pop();
        if (slug) {
          this.router.navigateByUrl(slug);
        }
      });
    });
  }

}
