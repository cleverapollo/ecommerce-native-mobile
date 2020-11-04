import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(private browser: InAppBrowser) { }

  openInAppBrowser(url: string) {
    this.openBrowser(url, '_blank');
  }

  openSystemBrowser(url: string) {
    this.openBrowser(url, '_system');
  }

  private openBrowser(url: string, browserTarget: string) {
    const browser = this.browser.create(url, browserTarget, { 
      presentationstyle: 'pagesheet', 
      toolbarposition: 'top', 
      location: 'no',
    });
    browser.show();
  }

}
