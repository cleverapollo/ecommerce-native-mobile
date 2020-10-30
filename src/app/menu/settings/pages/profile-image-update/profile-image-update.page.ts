import { Component, OnInit } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfile } from '@core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { HintConfig } from '@shared/components/hint/hint.component';
import { UserProfileStore } from '../../user-profile-store.service';

@Component({
  selector: 'app-profile-image-update',
  templateUrl: './profile-image-update.page.html',
  styleUrls: ['./profile-image-update.page.scss'],
})
export class ProfileImageUpdatePage implements OnInit {

  profile: UserProfile
  imageIsUploading: Boolean = false;
  showHint: Boolean;
  hintConfig: HintConfig

  constructor(
    private route: ActivatedRoute, 
    private userApiService: UserApiService, 
    private userProfileStore: UserProfileStore) 
    { }

  ngOnInit() {
    this.profile = history.state.data.profile;
  }

  uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      let request = new FormData();
      request.append('file', file);
      this.imageIsUploading = true;
      this.userApiService.uploadFile(request).subscribe((response) => {
        this.updateProfile(response.fileDownloadUri, response.fileName);
        this.hintConfig = new HintConfig("success", "Dein Profilbild wurde erfolgreich hochgeladen!");
      }, e => {
        this.hintConfig = new HintConfig("danger", "Aufgrund eines Fehlers konnte dein Profilbild nicht hochgeladen werden!")
      }, () => {
        this.imageIsUploading = false;
        this.makeHintVisible()
      });
    }
    reader.onerror = (error) => {
      console.error(error);
      this.hintConfig = new HintConfig("danger", "Aufgrund eines Fehlers konnte dein Profilbild nicht hochgeladen werden!")
      this.makeHintVisible()
    }
  }

  private makeHintVisible() {
    this.showHint = true;
    setTimeout(() => {
      this.showHint = false;
    }, 3000);
  }

  private updateProfile(url: String, fileName: String) {
    this.userProfileStore.loadUserProfile().toPromise().then( profile => {
      profile.profileImageUrl = url;
      profile.profileImageFileName = fileName;
      this.userProfileStore.updateCachedUserProfile(profile);
      this.profile = profile;
    })
  }

  deleteImage() {
    console.log('delete image');
  }

}
