import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { BrowserService } from '@core/services/browser.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { appVersion } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {

  get appVersion(): string {
    return appVersion
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private browserService: BrowserService,
    private analyticsService: AnalyticsService,
    public privacyPolicyService: PrivacyPolicyService
  ) { }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('settings');
  }

  showFaqPage() {
    this.browserService.openInAppBrowser('https://www.wantic.io/faq');
  }

  logout() {
    this.authenticationService.logout().then(() => {
      this.router.navigate(['start'], { replaceUrl: true });
    })
  }

}
