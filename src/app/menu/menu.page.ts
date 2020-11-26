import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private browserService: BrowserService
  ) { }

  ngOnInit() {}

  logout() {
    this.authenticationService.logout().then(() => {
      this.router.navigate(['start']);
    })
  }

  openPrivacyPolicyPage() {
    this.browserService.openInAppBrowser("https://www.wantic.io/datenschutz/");
  }

}
