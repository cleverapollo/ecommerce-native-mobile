import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { environment } from 'src/environments/environment';

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
    private storage: Storage,
    private secureStorage: SecureStorage,
    private platform: Platform
  ) { }

  async get<T>(storageKey: string, secure: boolean = false) : Promise<T> {
    return new Promise((resolve, reject) => {
      this.platformReady().then(() => {
        this.getStorage(secure).then(storage => {
          storage.get(storageKey).then((storedValue: T) => {
            resolve(storedValue);
          }, reject);
        }, reject)
      }, reject);
    });
  }

  async set(storageKey: string, value: any, secure: boolean = false) {
    await this.platformReady().then(() => {
      this.getStorage(secure).then(storage => {
        return storage.set(storageKey, value)
      }, console.error);
    }, console.error);
  }

  async remove(storageKey: string, secure: boolean = false) {
    await this.platformReady().then(() => {
      this.getStorage(secure).then(storage => {
        storage.remove(storageKey);
      }, console.error);
    }, console.error);
  }

  async clear() {
    await this.platformReady().then(() => {
      this.storage.clear();
    });
  }

  private async platformReady() {
    return await this.platform.ready();
  }

  private async getStorage(secure: boolean): Promise<SecureStorageObject | Storage> {
    if (secure && environment.production) {
      return this.getSecureStorage();
    }
    return Promise.resolve(this.storage);
  }

  private async getSecureStorage(): Promise<SecureStorageObject | Storage> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
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
      } else {
        resolve(this.storage);
      }
    });
  }

}
