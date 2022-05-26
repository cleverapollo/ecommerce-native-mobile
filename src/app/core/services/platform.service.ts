import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

interface PlatformService {
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  isNativePlatform: boolean;
  isReady(): Promise<string>;
}
@Injectable({
  providedIn: 'root'
})
export class DefaultPlatformService implements PlatformService {

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

  isReady(): Promise<string> {
    return this.platform.ready();
  }
  
}

export class PlatformMockService implements PlatformService {

  private _isIOS: boolean;
  private _isAndroid: boolean;
  private _isWeb: boolean;

  get isIOS(): boolean {
    return this._isIOS;
  }
  get isAndroid(): boolean {
    return this._isAndroid;
  }
  get isWeb(): boolean {
    return this._isWeb;
  }
  get isNativePlatform(): boolean {
    return this.isIOS || this.isAndroid;
  }

  isReady(): Promise<string> {
      return Promise.resolve('Platform is ready');
  }

  setupAndroid() {
    this._isIOS = false;
    this._isAndroid = true;
    this._isWeb = false;
  }

  setupIOS() {
    this._isIOS = true;
    this._isAndroid = false;
    this._isWeb = false;
  }

  setupWeb() {
    this._isIOS = false;
    this._isAndroid = false;
    this._isWeb = true;
  }
  
}