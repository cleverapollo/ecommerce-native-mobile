import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

interface PlatformService {
  isIOS: boolean;
  isAndroid: boolean;
  isNativePlatform: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class DefaultPlatformService implements PlatformService {

  constructor(private platform: Platform) { }

  get isIOS(): boolean { 
    return this.platform.is('capacitor') && this.platform.is('ios');
  }

  get isAndroid(): boolean { 
    return this.platform.is('capacitor') && this.platform.is('android');
  }

  get isNativePlatform(): boolean {
    return this.isAndroid || this.isIOS;
  }
  
}

export class PlatformMockService implements PlatformService {

  private _isIOS: boolean;
  private _isAndroid: boolean;

  get isIOS(): boolean {
    return this._isIOS;
  }
  get isAndroid(): boolean {
    return this._isAndroid;
  }
  get isNativePlatform(): boolean {
    return this.isIOS || this.isAndroid;
  }

  setupAndroid() {
    this._isIOS = false;
    this._isAndroid = true;
  }

  setupIOS() {
    this._isIOS = true;
    this._isAndroid = false;
  }

  setupWeb() {
    this._isIOS = false;
    this._isAndroid = false;
  }
  
}