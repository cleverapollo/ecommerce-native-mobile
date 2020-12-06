import { Component, OnInit } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfile } from '@core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserProfileStore } from '../../user-profile-store.service';
import { FileService } from '@core/services/file.service';
import { LogService } from '@core/services/log.service';

@Component({
  selector: 'app-profile-image-update',
  templateUrl: './profile-image-update.page.html',
  styleUrls: ['./profile-image-update.page.scss'],
})
export class ProfileImageUpdatePage implements OnInit {

  profile: UserProfile
  imageIsUploading: Boolean = false;

  get profileImageAvailable(): boolean {
    return this.fileName !== null;
  }

  get fileName(): String {
    let fileName = this.profile?.profileImageInfo?.fileName;
    if (!fileName) {
      const url = this.profile?.profileImageInfo?.urlString;
      if (url) {
        fileName = url.substring(url.lastIndexOf('/') + 1);
      }
    }
    return fileName;
  }

  constructor(
    private userApiService: UserApiService, 
    private userProfileStore: UserProfileStore,
    private fileService: FileService,
    private logger: LogService
  ) { }

  ngOnInit() {
    this.profile = history.state.data?.profile;
    this.logger.log(this.profile);
  }

  uploadImage(event) {
    const file = event.target.files[0];
    this.readFileContentAsFormData(file).then(formData => {
      this.imageIsUploading = true;
      this.userApiService.partialUpdateProfileImage(formData).toPromise().then(updatedProfile => {
        this.logger.log('updated profile ', updatedProfile);
        this.userProfileStore.updateCachedUserProfile(updatedProfile).finally(() => {
          this.userProfileStore.refreshUserProfileImage();
        });
        this.profile = updatedProfile;
      }).finally(() => {
        this.imageIsUploading = false;
      });
    });
  }

  private readFileContentAsFormData(file: any): Promise<FormData> {
    return new Promise((resolve, reject) => {
      this.fileService.readFileContentAsArrayBuffer(file).then((blob) => {
        const formData = new FormData();
        formData.append('file', blob);
        resolve(formData);
      }, reject);
    });
  }

  deleteImage() {
    const fileName = this.fileName?.toString();
    this.userApiService.deleteProfileImage(fileName).toPromise().then(() => {
      this.profile.profileImageInfo = null;
      this.userProfileStore.updateCachedUserProfile(this.profile);
      this.userProfileStore.removeUserProfileImage();
    });
  }

}
