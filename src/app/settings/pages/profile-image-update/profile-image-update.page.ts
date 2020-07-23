import { Component, OnInit } from '@angular/core';
import { UserApiService } from 'src/app/shared/api/user-api.service';
import { UserProfile } from 'src/app/shared/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-image-update',
  templateUrl: './profile-image-update.page.html',
  styleUrls: ['./profile-image-update.page.scss'],
})
export class ProfileImageUpdatePage implements OnInit {

  profile: UserProfile
  imageIsUploading: Boolean = false;

  constructor(private route: ActivatedRoute, private userApiService: UserApiService) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data.profile;
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
        this.profile.profileImageUrl = response.fileDownloadUri;
        this.profile.profileImageFileName = response.fileName;
      }, e => console.error, () => {
        this.imageIsUploading = false;
      });
    }
    reader.onerror = (error) => {
      console.error(error);
    }
  }

  deleteImage() {
    console.log('delete image');
  }

}
