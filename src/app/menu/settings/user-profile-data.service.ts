import { Injectable } from '@angular/core';
import { UserProfile } from '@core/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { UserApiService } from '@core/api/user-api.service';
import { map, publishReplay, refCount } from 'rxjs/operators';

export interface StoredUserProfile {
  item: UserProfile;
  modifiedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileDataService {

  private STORAGE_KEY_USER_PROFILE = 'user-profile';
  private _userProfile: BehaviorSubject<UserProfile> = new BehaviorSubject(new UserProfile());
  
  userProfileData: Observable<UserProfile>;
  userProfile$ = this._userProfile.asObservable();

  constructor(private storage: Storage, private platform: Platform, private api: UserApiService) {
    this.initUserProfile();
  }

  getUserProfile(): Observable<UserProfile> {
    if (!this.userProfileData) {
      this.userProfileData = this.getUserProfileFromServer()
    }
    return this.userProfileData;
  }

  updateUserProfile(userProfile: UserProfile) {
    const itemToStore: StoredUserProfile = {
      item: userProfile,
      modifiedAt: new Date()
    }
    this.storage.set(this.STORAGE_KEY_USER_PROFILE, itemToStore);
    this._userProfile.next(userProfile);
  }

  clearCache() {
    this.userProfileData = null;
    this.storage.remove(this.STORAGE_KEY_USER_PROFILE);
    this._userProfile.next(null);
  }

  private initUserProfile() {
    this.platform.ready().then(() => {
      this.getUserProfileFromCache().then((storedUserProfile: StoredUserProfile) => {
        if (storedUserProfile) {
          this._userProfile.next(storedUserProfile.item);
        } else {
          this.refreshFromServer();
        }
      });
    });
  }

  private getUserProfileFromCache(): Promise<StoredUserProfile> {
    return this.storage.get(this.STORAGE_KEY_USER_PROFILE);
  }

  private getUserProfileFromServer(): Observable<UserProfile> {
    return this.api.getProfile().pipe(
      publishReplay(1),
      refCount()
    );
  }

  private refreshFromServer() {
    this.getUserProfileFromServer().subscribe(userProfile => {
      this.updateUserProfile(userProfile);
    });
  }
}
