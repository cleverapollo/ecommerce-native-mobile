import { Injectable } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly assetPath = 'public/assets';

  constructor(private file: File, private logger: LogService) { }

  private get fileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any).__zone_symbol__originalInstance;
    return zoneOriginalInstance || fileReader;
  }

  get applicationDirectoryPath(): string {
    return this.file.applicationDirectory;
  }

  async getTextContentFromFileInAssetFolder(fileName: string, subDir?: string): Promise<string> {
    const filePath = this.createFilePath(fileName, subDir);
    try {
      const dirExists = await this.file.checkDir(this.applicationDirectoryPath, this.assetPath);
      if (dirExists) {
        const fileExists = await this.file.checkFile(`${this.applicationDirectoryPath}${this.assetPath}/`, filePath);
        if (fileExists) {
          const directoryUrl = this.createDirectoryUrlForAssetsFolder(subDir);
          const localDirectoryURL = await this.file.resolveDirectoryUrl(directoryUrl);
          const fileEntry = await this.file.getFile(localDirectoryURL, fileName, { create: false, exclusive: false });
          return this.readFileContent(fileEntry);
        } else {
          return Promise.reject('file in asset directory does not exist');
        }
      } else {
        return Promise.reject('asset directory does not exist.');
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
    this.logger.debug('file path to resolve ', filePath);
    return filePath;
  }

  private createDirectoryUrlForAssetsFolder(subDir: string) {
    let directoryUrl = `${this.applicationDirectoryPath}${this.assetPath}`;
    if (subDir) {
      directoryUrl += `/${subDir}`;
    }
    this.logger.debug('directory url to resolve  ', directoryUrl);
    return directoryUrl;
  }

  private async readFileContent(fileEntry: FileEntry): Promise<string> {
    return new Promise((resolve, reject) => {
      fileEntry.file((file: any) => {
        this.logger.debug('FileReader read as text ');
        const reader = this.fileReader;
        reader.onloadstart = (event) => {
          this.logger.debug('file reader on load start ...', event);
        }
        reader.onloadend = (event) => {
          this.logger.debug('file reader on load end ...', event);
          const result = reader.result;
          if (result instanceof ArrayBuffer) {
            this.logger.debug('result is array buffer');
            reject();
          }
          this.logger.debug('Successful file read: ' + result);
          resolve(result as string);
        };
        reader.onerror = (error) => {
          this.logger.error('file reader on load error ...', event);
          reject(error);
        };
        reader.readAsText(file);
      }, fileError => {
        this.logger.error(`${fileError.code}: ${fileError.message}`);
        reject(fileError);
      });
    });
  }

  readFileContentAsArrayBuffer(file: any): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = this.fileReader;
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
