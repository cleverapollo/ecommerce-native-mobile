import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
    private platform: Platform
  ) { }

  async get<T>(storageKey: string) : Promise<T> {
    return new Promise((resolve, reject) => {
      this.platformReady().then(() => {
        this.storage.get(storageKey).then((storedValue: T) => {
          resolve(storedValue);
        }, reject);
      });
    });
  }

  async set(storageKey: string, value: any) {
    await this.platformReady().then(() => {
      this.storage.set(storageKey, value)
    });
  }

  async remove(storageKey: string) {
    await this.platformReady().then(() => {
      this.storage.remove(storageKey);
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
}
