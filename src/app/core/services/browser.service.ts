import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(private browser: InAppBrowser) { }

  openInAppBrowser(url: string) {
    const browser = this.browser.create(url, '_blank');
    browser.show();
  }

}
