import { Injectable } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

export interface OperatingSystem {
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  isNativePlatform: boolean;
  isReady(): Promise<string>;
  hideKeyBoard(): void;
}
@Injectable({
  providedIn: 'root'
})
export class PlatformService implements OperatingSystem {

  constructor(private platform: Platform) { }

  get isIOS(): boolean {
    return this.platform.is('hybrid') && this.platform.is('ios');
  }

  get isAndroid(): boolean {
    return this.platform.is('hybrid') && this.platform.is('android');
  }

  get isWeb(): boolean {
    return !this.platform.is('hybrid')
  }

  get isNativePlatform(): boolean {
    return this.isAndroid || this.isIOS;
  }

  get resume(): Subject<void> {
    return this.platform.resume;
  }

  isReady(): Promise<string> {
    return this.platform.ready();
  }

  hideKeyBoard(): void {
    if (!this.isNativePlatform) {
      return;
    }
    Keyboard.hide();
  }

}