import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly assetPath = 'www/assets';

  constructor(private file: File, private logger: LogService) { }

  get applicationDirectoryPath(): string {
    return this.file.applicationDirectory;
  }

  async getTextContentFromFileInAssetFolder(fileName: string, subDir?: string): Promise<string> {
    let filePath = this.createFilePath(fileName, subDir);
    try {
      const dirExists = await this.file.checkDir(this.applicationDirectoryPath, this.assetPath);
      this.logger.info('asset path exists');
      if (dirExists) {
        const fileExists = await this.file.checkFile(`${this.applicationDirectoryPath}${this.assetPath}/`, filePath);
        this.logger.info('file in asset path exists');
        if (fileExists) {
          const directoryUrl = this.createDirectoryUrlForAssetsFolder(subDir);
          const dir = await this.file.resolveDirectoryUrl(directoryUrl);
          const fileEntry = await this.file.getFile(dir, fileName, { create: false, exclusive: false });
          this.logger.info('resolve file entry successfull');
          return this.readFileContent(fileEntry);
        } else {
          return Promise.reject();
        }
      } else {
        return Promise.reject();
      }
    } catch(error) {
      return Promise.reject(error);
    }
  }

  private createFilePath(fileName: string, subDir: string) {
    let filePath = fileName;
    if (subDir) {
      filePath = `${subDir}/${fileName}`;
    }
    this.logger.log('file path to resolve ', filePath);
    return filePath;
  }

  private createDirectoryUrlForAssetsFolder(subDir: string) {
    let directoryUrl = `${this.applicationDirectoryPath}${this.assetPath}`;
    if (subDir) {
      directoryUrl += `/${subDir}`;
    }
    this.logger.info('directory url to resolve  ', directoryUrl);
    return directoryUrl;
  }

  private async readFileContent(fileEntry): Promise<string> {
    return new Promise((resolve, reject) => {
      fileEntry.file((file) => {
        const reader = new FileReader();
        reader.onloadend = (e) => {
          const result = reader.result;
          if (result instanceof ArrayBuffer) {
            this.logger.log('result is array buffer');
            reject();
          }
          this.logger.info("Successful file read: " + result);
          resolve(result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsText(file);
      });
    });
  }

  readFileContentAsArrayBuffer(file: any): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        resolve(file);
      };
      reader.onerror = (error) => {
        this.logger.error(error);
        reject(error);
      };
    });
  }
}
