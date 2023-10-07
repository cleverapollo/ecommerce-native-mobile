import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Preferences } from '@capacitor/preferences';
import 'capacitor-secure-storage-plugin';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import CryptoJS from 'crypto-js';
import SecureStorage from 'secure-web-storage';
import { Logger } from './log.service';
import { PlatformService } from './platform.service';

const SECRET_KEY = 'wantic_sec';

export enum StorageKeys {
  ACTIVE_CREATOR_ACCOUNT = 'activeCreatorAccount',
  CREDENTIALS = 'credentials',
  FIREBASE_ID_TOKEN = 'firebaseIdToken',
  FIREBASE_EMAIL_VERIFIED = 'firebaseEmailVerified',
  FIREBASE_USER_INFO = 'firebaseUserInfo',
  PROFILE_IMAGE = 'profileImage',
  SIGNUP_RESPONSE = 'signupResponse',
  USER_SETTINGS = 'userSettings',

  // deprecated
  AUTH_TOKEN = 'auth-token', // deprecated
  LOGIN_EMAIL = 'loginEmail', // deprecated
  LOGIN_PASSWORD = 'loginPassword', // deprecated
  SHARED_WISH_LIST_EMAIL = 'memberEmail', // deprecated
}

export interface Storage {
  get<T>(storageKey: string, secure: boolean): Promise<T>;
  set(storageKey: string, value: any, secure: boolean): Promise<void>;
  remove(storageKey: string, secure: boolean): Promise<void>;
  clear(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService implements Storage {

  private secureWebStorage: SecureStorage;

  constructor(
    private platform: Platform,
    private platformService: PlatformService,
    private logger: Logger) {
    this.setupSecureWebStorage();
  }

  private setupSecureWebStorage() {
    this.secureWebStorage = new SecureStorage(localStorage, {
      hash: function hash(key): any {
        key = CryptoJS.HmacSHA256(key, SECRET_KEY);
        return key.toString();
      },
      // Encrypt the localstorage data
      encrypt: function encrypt(data) {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);
        data = data.toString();
        return data;
      },
      // Decrypt the encrypted data
      decrypt: function decrypt(data) {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);
        data = data.toString(CryptoJS.enc.Utf8);
        return data;
      }
    });
  }

  // GET

  async get<T>(storageKey: string, secure: boolean = false): Promise<T> {
    try {
      await this.platform.ready();
      if (secure) {
        return this.getSecure(storageKey);
      } else {
        return this.getPublic(storageKey);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async getPublic<T>(storageKey: string): Promise<T> {
    if (this.platformService.isNativePlatform) {
      try {
        const cachedObject = await Preferences.get({ key: storageKey });
        if (cachedObject?.value?.length > 0) {
          return JSON.parse(cachedObject.value);
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    } else {
      const cachedObject = localStorage.getItem(storageKey);
      return JSON.parse(cachedObject);
    }
  }

  private async getSecure<T>(storageKey: string): Promise<T> {
    if (this.platformService.isNativePlatform) {
      let cachedObject: { value: string } = null;
      try {
        cachedObject = await SecureStoragePlugin.get({ key: storageKey });
      } catch (error) {
        return Promise.resolve(null);
      }

      if (cachedObject.value.length <= 0) {
        return Promise.resolve(null);
      }

      try {
        const jsonObject = JSON.parse(cachedObject.value);
        return Promise.resolve(jsonObject);
      } catch (error) {
        this.logger.error(`failed to parse object with key ${storageKey}`, error);
        return Promise.resolve(null);
      }
    } else {
      const cachedObject = this.secureWebStorage.getItem(storageKey);
      return Promise.resolve(cachedObject);
    }
  }

  // SET

  async set(storageKey: string, value: any, secure: boolean = false) {
    value = JSON.stringify(value);
    try {
      await this.platform.ready();
      if (secure) {
        await this.setSecure(storageKey, value);
      } else {
        await this.setPublic(storageKey, value);
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async setSecure(storageKey: string, value: any): Promise<void> {
    if (this.platformService.isNativePlatform) {
      await SecureStoragePlugin.set({ key: storageKey, value });
    } else {
      this.secureWebStorage.setItem(storageKey, value);
    }
    return Promise.resolve();
  }

  private setPublic(storageKey: string, value: any): Promise<void> {
    if (this.platformService.isNativePlatform) {
      return Preferences.set({ key: storageKey, value });
    } else {
      localStorage.setItem(storageKey, JSON.stringify(value));
      return Promise.resolve();
    }
  }

  // REMOVE

  async remove(storageKey: string, secure: boolean = false): Promise<void> {
    try {
      await this.platform.ready();
      if (secure) {
        await this.removeSecure(storageKey);
      } else {
        await this.removePublic(storageKey);
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async removeSecure(storageKey: string): Promise<void> {
    if (this.platformService.isNativePlatform) {
      await SecureStoragePlugin.remove({ key: storageKey });
    } else {
      this.secureWebStorage.removeItem(storageKey);
    }
    return Promise.resolve();
  }

  private async removePublic(storageKey: string): Promise<void> {
    if (this.platformService.isNativePlatform) {
      await Preferences.remove({ key: storageKey })
    } else {
      localStorage.removeItem(storageKey);
    }
    return Promise.resolve();
  }

  // CLEAR

  clear(): Promise<void> {
    if (this.platformService.isNativePlatform) {
      return this.clearAppStorage();
    } else {
      return this.clearWebStorage();
    }
  }

  private async clearAppStorage(): Promise<void> {
    try {
      await Preferences.clear();
      await SecureStoragePlugin.clear();
      return Promise.resolve();
    } catch (error) {

    }
  }

  private clearWebStorage(): Promise<void> {
    localStorage.clear();
    this.secureWebStorage.clear();
    return Promise.resolve();
  }

}
