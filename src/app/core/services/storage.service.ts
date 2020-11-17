import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';

import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export enum StorageKeys {
  USER_SETTINGS = 'userSettings',
  LOGIN_EMAIL = 'loginEmail',
  LOGIN_PASSWORD = 'loginPassword',
  AUTH_TOKEN = 'auth-token',
  EMAIL_VERIFICATION_STATUS = 'emailVerificationStatus',
  SHARED_WISH_LIST_EMAIL = 'memberEmail'
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private secureStorage: SecureStorage,
    private platform: Platform
  ) { }

  async get<T>(storageKey: string, secure: boolean = false) : Promise<T> {
    return new Promise((resolve, reject) => {
      this.platformReady().then(() => {
        if (secure && this.platform.is('cordova')) {  
          this.getSecureStorage().then(storage => {
            storage.get(storageKey).then(storedValue => {
              resolve(JSON.parse(storedValue));
            }, reject);
          }, reject)
        } else {
          Storage.get({ key: storageKey }).then(object => {
            resolve(JSON.parse(object.value));
          })
        }

      }, reject);
    });
  }

  async set(storageKey: string, value: any, secure: boolean = false) {
    value = JSON.stringify(value);
    await this.platformReady().then(() => {
      if (secure && this.platform.is('cordova')) { 
        this.getSecureStorage().then(storage => {
          return storage.set(storageKey, value)
        }, console.error);
      } else {
        Storage.set({ key: storageKey, value: value })
      }
    }, console.error);
  }

  async remove(storageKey: string, secure: boolean = false) {
    await this.platformReady().then(() => {
      if (secure && this.platform.is('cordova')) {
        this.getSecureStorage().then(storage => {
          storage.remove(storageKey);
        }, console.error);
      } else {
        Storage.remove({ key: storageKey });
      }
    }, console.error);
  }

  async clear() {
    await this.platformReady().then(() => {
      Storage.clear();
    });
  }

  private async platformReady() {
    return await this.platform.ready();
  }

  private async getSecureStorage(): Promise<SecureStorageObject> {
    return new Promise((resolve, reject) => {
        this.secureStorage.create('secureStorage').then(storage => {
          resolve(storage);
        }, (storage: SecureStorageObject) => {
          storage.secureDevice().then(() => {
            resolve(storage);
          }, reason => {
            console.error('Screen Lock is disabled.')
            reject(reason);
          });
        });
    });
  }

}
