import { Injectable } from '@angular/core';
import { UserProfile } from '../shared/models/user.model';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

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

  constructor(private storage: Storage, private platform: Platform) { 
    this.platform.ready().then(() => {
      this.storage.get(this.STORAGE_KEY_USER_PROFILE).then((storedUserProfile: StoredUserProfile) => {
        if (storedUserProfile) {
          this._userProfile.next(storedUserProfile.item);
        }
      });
    });
  }

  userProfile$ = this._userProfile.asObservable();

  updateUserProfile(userProfile: UserProfile) {
    const itemToStore: StoredUserProfile = {
      item: userProfile,
      modifiedAt: new Date()
    }
    this.storage.set(this.STORAGE_KEY_USER_PROFILE, itemToStore);
    this._userProfile.next(userProfile);
  }

  clearUserProfile() {
    this.storage.remove(this.STORAGE_KEY_USER_PROFILE);
    this._userProfile.next(null);
  }
}
