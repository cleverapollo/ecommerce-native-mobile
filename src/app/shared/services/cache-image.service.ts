import { Injectable } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class CacheImageService {

  constructor(private storage: Storage) { }

  saveImage(fileName: string, data: Blob) {
    this.storage.set(fileName, data);
  }

  loadImage(fileName: string): Promise<Blob> {
    return this.storage.get(fileName);
  }
}
