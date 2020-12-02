import { Injectable } from '@angular/core';
import { BrowserService } from './browser.service';

@Injectable({
  providedIn: 'root'
})
export class PrivacyPolicyService {

  constructor(private browserService: BrowserService) { 
  }

  showPrivacyPolicy() {
    this.browserService.openInAppBrowser("https://www.wantic.io/datenschutz/");
  }

  showImprint() {
    this.browserService.openInAppBrowser("https://www.wantic.io/impressum/");
  }

}
