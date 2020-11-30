import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(private browser: InAppBrowser) { }

  async openInAppBrowser(url: string) {
    await Browser.open({ 
      url: url 
    });
  }

  openSystemBrowser(url: string) {
    const browser = this.browser.create(url, '_system', { 
      presentationstyle: 'pagesheet', 
      toolbarposition: 'top', 
      location: 'no',
    });
    browser.show();
  }

}
