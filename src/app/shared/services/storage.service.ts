import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { Keychain } from '@ionic-native/keychain/ngx';
import { environment } from 'src/environments/environment';

export enum StorageKeys {
  USER_SETTINGS = 'userSettings',
  LOGIN_EMAIL = 'loginEmail',
  LOGIN_PASSWORD = 'loginPassword',
  AUTH_TOKEN = 'auth-token'
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
    private secureStorage: SecureStorage,
    private keychain: Keychain,
    private platform: Platform
  ) { }

  async get<T>(storageKey: string, secure: boolean = false) : Promise<T> {
    if (secure && environment.production) {
      return this.secureGet(storageKey);
    }
    return new Promise((resolve, reject) => {
      this.platformReady().then(() => {
        this.storage.get(storageKey).then((storedValue: T) => {
          resolve(storedValue);
        }, reject);
      });
    });
  }

  private async secureGet<T>(storageKey: string) : Promise<T> {
    return new Promise((resolve, reject) => {
      this.getSecureStorage().then((storage) => {
        storage.get(storageKey).then((storedValue: T) => {
          resolve(storedValue);
        }, reject);
      })
    });
  }


  async set(storageKey: string, value: any, secure: boolean = false) {
    if (secure && environment.production) { 
      return this.secureSet(storageKey, value);
    }
    await this.platformReady().then(() => {
      this.storage.set(storageKey, value)
    });
  }

  private async secureSet(storageKey: string, value: any) {
    return new Promise((resolve, reject) => {
      this.getSecureStorage().then(storage => {
        storage.set(storageKey, value).then(resolve, reject);
      })
    })
  }

  async remove(storageKey: string, secure: boolean = false) {
    if (secure && environment.production) { 
      return this.secureRemove(storageKey);
    }
    await this.platformReady().then(() => {
      this.storage.remove(storageKey);
    });
  }

  private async secureRemove(storageKey: string) {
    return new Promise((resolve, reject) => {
      this.getSecureStorage().then(storage => {
        storage.remove(storageKey).then(resolve, reject);
      });
    });
  }

  async clear() {
    await this.platformReady().then(() => {
      this.storage.clear();
    });
  }

  private async platformReady() {
    return await this.platform.ready();
  }

  private getSecureStorage(): Promise<Keychain | SecureStorageObject> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('ios')) {
        resolve(this.keychain);
      } else if (this.platform.is('android')) {
        this.secureStorage.create('secureStorage').then(storage => {
          resolve(storage);
        }, (storage: SecureStorageObject) => {
          if (environment.production) {
            storage.secureDevice().then(() => {
              resolve(storage);
            }, reason => {
              console.error('Screen Lock is disabled.')
              reject(reason);
            });
          } else {
            resolve(storage);
          }
        });
      } else {
        reject('supported only for ios and android');
      }
    });
  }

}
