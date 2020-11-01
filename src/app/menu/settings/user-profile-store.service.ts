import { Injectable } from '@angular/core';
import { UserProfile } from '@core/models/user.model';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
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
export class UserProfileStore {

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
    return this.cache.saveItem(this.CACHE_KEY, userProfile, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL)
      .catch(() => { this.removeCachedUserProfile() });
  }

  removeCachedUserProfile() {
    this.cache.removeItem(this.CACHE_KEY)
  }

  loadImage(url: string, forceRefresh: boolean = false, cacheKey?: string): Observable<Blob> {
    const ttl = 60 * 60 * 24 * 7; // 1 week in seconds
    const request = this.api.downloadProfileImage(url);
    const keyForCaching = cacheKey ? cacheKey : url;
    if (forceRefresh) { 
      return this.cache.loadFromDelayedObservable(keyForCaching, request, this.CACHE_GROUP_KEY, ttl, 'all');
    }
    return this.cache.loadFromObservable(keyForCaching, request, this.CACHE_GROUP_KEY, ttl);
  }

  loadUserProfileImage(forceRefresh: boolean = false): Observable<Blob> {
    const cacheKey = 'profileImage';
    return from(new Promise((resolve, reject) => {
      this.loadUserProfile().subscribe({
        next: userProfile => {
          const profileImageUrl = userProfile.profileImageInfo?.urlString;
          if (profileImageUrl) {
            resolve(this.loadImage(profileImageUrl, forceRefresh, cacheKey));
          }
          resolve(null);
        },
        error: error => {
          reject(error);
        }
      });
    })) as Observable<Blob>;
  }

  refreshUserProfileImage(): Observable<Blob> {
    return this.loadUserProfileImage(true);
  }

  removeUserProfileImage() {
    const cacheKey = 'profileImage';
    return this.cache.removeItem(cacheKey);
  }

}
