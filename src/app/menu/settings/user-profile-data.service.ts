import { Injectable } from '@angular/core';
import { UserProfile } from '@core/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { UserApiService } from '@core/api/user-api.service';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { CacheService } from 'ionic-cache';

export interface StoredUserProfile {
  item: UserProfile;
  modifiedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileDataService {

  private readonly CACHE_DEFAULT_TTL = 60 * 60;
  private readonly CACHE_KEY = 'userProfile'
  private readonly CACHE_GROUP_KEY = 'user';

  constructor(
    private cache: CacheService, 
    private api: UserApiService) 
  {}

  loadUserProfile(forceRefresh: boolean = false): Observable<UserProfile> {
    let request = this.api.getProfile();
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.CACHE_KEY, request, this.CACHE_GROUP_KEY)
  }

  updateCachedUserProfile(userProfile: UserProfile) {
    this.cache.saveItem(this.CACHE_KEY, userProfile, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL)
      .catch(() => { this.removeCachedUserProfile() });
  }

  removeCachedUserProfile() {
    this.cache.removeItem(this.CACHE_KEY)
  }

}
