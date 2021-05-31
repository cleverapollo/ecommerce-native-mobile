import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import 'capacitor-secure-storage-plugin';
import { Plugins } from "@capacitor/core";
import { LogService } from './log.service';
const { Storage, SecureStoragePlugin } = Plugins;

export enum StorageKeys {
  USER_SETTINGS = 'userSettings',
  LOGIN_EMAIL = 'loginEmail', // deprecated
  LOGIN_PASSWORD = 'loginPassword', // deprecated
  AUTH_TOKEN = 'auth-token', // deprecated
  CREDENTIALS = 'credentials',
  FIREBASE_ID_TOKEN = 'firebaseIdToken',
  FIREBASE_EMAIL_VERIFIED = 'firebaseEmailVerified',
  FIREBASE_USER_INFO = 'firebaseUserInfo',
  SHARED_WISH_LIST_EMAIL = 'memberEmail',
  SIGNUP_REQUEST = 'signupRequest',
  SIGNUP_RESPONSE = 'signupResponse',
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private platform: Platform, private logger: LogService) { }

  async get<T>(storageKey: string, secure: boolean = false) : Promise<T> {
    return new Promise((resolve, reject) => {
      this.platformReady().then(() => {
        if (secure) {  
          SecureStoragePlugin.get({key: storageKey}).then((cachedObject: { value: string }) => {
            if (cachedObject.value.length > 0) {
               try {
                 const jsonObject = JSON.parse(cachedObject.value);
                 resolve(jsonObject);
               } catch (error) {
                 this.logger.error(`failed to parse object with key ${storageKey}`, error);
                 resolve(null);
               } 
            } else {
              resolve(null);
            }
          }, error => {
            this.logger.debug(storageKey, error);
            resolve(null);
          });
        } else {
          Storage.get({ key: storageKey }).then(object => {
            if (object?.value?.length > 0) {
              resolve(JSON.parse(object.value));
            } else {
              resolve(null);
            }
          }, error => {
            this.logger.debug(storageKey, error);
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
        SecureStoragePlugin.set({key: storageKey, value: value}).then(this.logger.log, this.logger.error);
      } else {
        Storage.set({ key: storageKey, value: value })
      }
    }, this.logger.error);
  }

  async remove(storageKey: string, secure: boolean = false) {
    await this.platformReady().then(() => {
      const storage = secure ? SecureStoragePlugin : Storage;
      storage.remove({ key: storageKey });
    }, this.logger.error);
  }

  clear(): Promise<void> {
    return new Promise<void>((resolve) => {
      Storage.clear().finally(() => {
        SecureStoragePlugin.clear().finally(() => {
          resolve();
        });
      });
    });
  }

  private async platformReady() {
    return await this.platform.ready();
  }

}
