import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { Camera, CameraPermissionState, CameraPermissionType, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Directory, Filesystem, ReaddirResult } from '@capacitor/filesystem';
import { LocalFile, checkPhotoPermissions, convertBlobToBase64, convertToArrayBuffer, getFileSizeInMB, loadFileData, mkdir } from '@shared/helpers/file.helper';

import { AlertService } from '@core/services/alert.service';
import { App } from '@capacitor/app';
import { CoreToastService } from '@core/services/toast.service';
import { IonModal } from '@ionic/angular';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { v4 as uuidv4 } from 'uuid';

const IMAGE_DIR = 'stored-images';
const FALLBACK_IMG = 'https://ionicframework.com/docs/img/demos/avatar.svg';
const MAX_FILE_SIZE_MB = 5;

type Image = string | Blob | null;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit, OnChanges {

  @Input() src: Image = null;
  @Input() size: 's' | 'm' | 'l' = 'l';
  @Input() readOnly = false;
  @Input() fileName?: string;
  @Input() showSwitchImage = false;

  @Output() fileChanged = new EventEmitter<ArrayBuffer>();
  @Output() fileDeleted = new EventEmitter<void>();

  @ViewChild('modal') modal?: IonModal;

  style = {};
  avatarCssClass = 'size-l';
  showError = false;
  btnColor: 'primary' | 'primary-purple' = 'primary';
  btnContainerClass = {};

  get image(): Image {
    return this._image;
  }

  set image(image: Image) {
    this._image = image;
    if (!image) {
      this.src = FALLBACK_IMG;
    } else {
      this.src = image;
    }
  }

  private _image: Image = null;

  constructor(
    private logger: Logger,
    private platformService: PlatformService,
    private toastService: CoreToastService,
    private userService: UserProfileStore,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.avatarCssClass = `size-${this.size}`;
    if (this.showSwitchImage) {
      this.avatarCssClass += ' opacity-80';
    }
    this.userService.isCreatorAccountActive$.subscribe(isActive => {
      if (isActive) {
        this.btnContainerClass = 'primary-purple-gradient';
        this.btnColor = 'primary-purple';
      } else {
        this.btnColor = 'primary';
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.src) {
      this.image = changes.src.currentValue || null;
    }
  }

  async getPhoto(fromSource: CameraSource, currPermission?: CameraPermissionState): Promise<void> {
    try {
      const permissionType: CameraPermissionType = fromSource === CameraSource.Camera ? 'camera' : 'photos';
      const permission = currPermission ?? await checkPhotoPermissions(permissionType);
      if (permission === 'granted' || permission === 'limited') {
        await this._selectPhoto(fromSource);
        await this.modal?.dismiss();
        return;
      }

      if (permission === 'denied') {
        const message = permissionType === 'photos' ?
         'Um ein Bild auzuwählen erlaube bitte den Zugriff auf Deine Bilder in den Einstellungen.' :
         'Um ein Bild aufzunehmen erlaube bitte den Zugriff auf Deine Kamera in den Einstellungen.';
        const appName = (await App.getInfo()).name;
        const alert = await this.alertService.createActionAlert(
          `"${appName}" ohne Zugriff auf deine ${permissionType === 'photos' ? 'Bilder' : 'Kamera'}`,
          message,
          'Einstellungen öffnen',
          async () => {
            await NativeSettings.open({
              optionAndroid: AndroidSettings.ApplicationDetails,
              optionIOS: IOSSettings.App
            });
          });
        await alert.present();
        return;
      }

      if (permission === 'prompt' || permission === 'prompt-with-rationale') {
        return this.getPhoto(fromSource, (await Camera.requestPermissions({
          permissions: [permissionType]
        }))[permissionType]);
      }

      throw new Error(`Unhandled permission state ${permission}`);
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Ein unbekannter Fehler ist aufgetreten.')
    }
  }

  pickImageFromGallery(): Promise<void> {
    return this.getPhoto(CameraSource.Photos);
  }

  takePhoto(): Promise<void> {
    return this.getPhoto(CameraSource.Camera);
  }

  async deletePhoto(): Promise<void> {
    if (!this.image) {
      await this.toastService.presentInfoToast('Kein Bild zum Löschen vorhanden')
      return;
    }

    if (this.image['data']) {
      await this.deleteImage(this.image as any);
      await this.modal?.dismiss();
      return;
    }

    this.fileDeleted.emit();
    await this.modal?.dismiss();
  }

  private async _selectPhoto(cameraSource: CameraSource): Promise<void> {
    let photo: Photo;
    try {
      photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: cameraSource
      });
    } catch (error) {
      // error is e.g. Error: User cancelled photos app
      this.logger.debug(error);
      return;
    }

    if (!photo) {
      return;
    }

    const localFileName = await this.savePhoto(photo);
    const localFile = await this.loadFile(localFileName);
    const arrayBuffer = await convertToArrayBuffer(localFile);
    const fileSize = getFileSizeInMB(arrayBuffer);
    this.logger.debug(`File size ${fileSize} MB`);

    if (fileSize > MAX_FILE_SIZE_MB) {
      this.showError = true;
      return;
    }

    this.image = new Blob([arrayBuffer]);
    this.fileChanged.emit(arrayBuffer);
  }

  // Create a new file from a capture image
  private async savePhoto(photo: Photo): Promise<string> {
    try {
      const base64Data = await this.readAsBase64(photo);
      const fileName = `${this.fileName || uuidv4()}.${photo.format || 'jpeg'}`
      await Filesystem.writeFile({
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
        directory: Directory.Data,
        recursive: true
      });
      return fileName;
    } catch (error) {
      this.logger.error('Error while saving the file', JSON.stringify(error));
      throw error;
    }
  }

  private async readAsBase64(photo: Photo): Promise<string | Blob> {
    if (this.platformService.isNativePlatform) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await convertBlobToBase64(blob) as string;
    }
  }

  private async loadFile(fileName: string): Promise<LocalFile> {
    let result: ReaddirResult | null = null;
    let folderExists = false;
    try {
      result = await Filesystem.readdir({
        path: IMAGE_DIR,
        directory: Directory.Data
      });
      folderExists = true;
    } catch (error) {
      this.logger.warn(error);
    }

    if (!folderExists) {
      try {
        await mkdir(IMAGE_DIR);
      } catch (error) {
        this.logger.error('Error when creating new directory!', JSON.stringify(error));
      }
    }

    if (!result) {
      return null;
    }

    if (result.files.length === 1) {
      return loadFileData(IMAGE_DIR, result.files[0].name)
    }

    const file = result.files.find(file => file.name === fileName);
    if (!file) {
      this.logger.error(`File ${fileName} not found!`);
      return null;
    }

    return loadFileData(IMAGE_DIR, fileName);
  }

  private async deleteImage(file: LocalFile): Promise<void> {
    try {
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: file.path
      });
      this.image = null;
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }

}
