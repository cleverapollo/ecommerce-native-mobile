import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';
import { BrowserService } from '@core/services/browser.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { appVersion } from 'src/environments/environment';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

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

  ngOnInit() {}

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
