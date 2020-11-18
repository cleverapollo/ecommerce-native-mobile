import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import 'capacitor-secure-storage-plugin';
import { Plugins } from "@capacitor/core";
const { Storage, SecureStoragePlugin } = Plugins;

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

  constructor(private platform: Platform) { }

  async get<T>(storageKey: string, secure: boolean = false) : Promise<T> {
    return new Promise((resolve, reject) => {
      this.platformReady().then(() => {
        if (secure) {  
          SecureStoragePlugin.get({storageKey}).then((cachedObject: { value: string }) => {
            resolve(JSON.parse(cachedObject.value));
          }, error => {
            console.log(storageKey, error);
            resolve(null);
          });
        } else {
          Storage.get({ key: storageKey }).then(object => {
            resolve(JSON.parse(object.value));
          }, error => {
            console.log(storageKey, error);
            resolve(null);
          })
        }
      }, reject);
    });
  }

  async set(storageKey: string, value: any, secure: boolean = false) {
    value = JSON.stringify(value);
    await this.platformReady().then(() => {
      if (secure) {
        SecureStoragePlugin.set({storageKey, value}).then(console.log, console.error);
      } else {
        Storage.set({ key: storageKey, value: value })
      }
    }, console.error);
  }

  async remove(storageKey: string, secure: boolean = false) {
    await this.platformReady().then(() => {
      const storage = secure ? SecureStoragePlugin : Storage;
      storage.remove({ key: storageKey });
    }, console.error);
  }

  async clear() {
    await this.platformReady().then(() => {
      Storage.clear();
      SecureStoragePlugin.clear();
    });
  }

  private async platformReady() {
    return await this.platform.ready();
  }

}
