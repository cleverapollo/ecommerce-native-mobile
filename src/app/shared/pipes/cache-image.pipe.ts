import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ProfileImageDto } from '@core/models/user.model';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

@Pipe({
  name: 'cacheImage'
})
export class CacheImagePipe implements PipeTransform {

  constructor(
    private userProfileStore: UserProfileStore,  
    private sanitizer: DomSanitizer
  ) {}

  transform(imageInfo: ProfileImageDto): Promise<SafeUrl> {
    const url = imageInfo.urlString;
    let cacheKey = url;
    if (imageInfo.isFromLoggedInUser) {
      cacheKey = 'profileImage';
    }
    return new Promise((resolve, reject) => {
      this.userProfileStore.loadImage(url, false, cacheKey).subscribe(blob => {
        resolve(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)));
      });
    });
  }

}
