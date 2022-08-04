import { Injectable } from '@angular/core';
import { UserProfile } from '@core/models/user.model';
import { from, Observable } from 'rxjs';
import { UserApiService } from '@core/api/user-api.service';
import { CacheService } from 'ionic-cache';
import { LogService } from '@core/services/log.service';

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
    private api: UserApiService,
    private logger: LogService
  )
  {}

  loadUserProfile(forceRefresh: boolean = false): Observable<UserProfile> {
    const request = this.api.getProfile();
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    }
    return this.cache.loadFromObservable(this.CACHE_KEY, request, this.CACHE_GROUP_KEY)
  }

  async updateCachedUserProfile(userProfile: UserProfile): Promise<any> {

    // try to update cached profile
    try {
      return await this.cache.saveItem(this.CACHE_KEY, userProfile, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    } catch (error) {
      this.logger.error(error);
    }

    // try to remove item from cache
    try {
      return await this.cache.removeItem(this.CACHE_KEY);
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  removeCachedUserProfile(): Promise<any> {
    return this.cache.removeItem(this.CACHE_KEY)
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


}
