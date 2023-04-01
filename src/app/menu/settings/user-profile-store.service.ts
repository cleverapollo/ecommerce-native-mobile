import { Injectable } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { UserProfile } from '@core/models/user.model';
import { Logger } from '@core/services/log.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, Observable } from 'rxjs';

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

  isCreatorAccountActive$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly cache: CacheService,
    private readonly storage: StorageService,
    private readonly api: UserApiService,
    private readonly logger: Logger
  ) {
    this._initData();
  }

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

  async toggleIsCreatorAccountActive() {
    const isCreatorAccountActive = this.isCreatorAccountActive$.value;
    await this.storage.set(StorageKeys.ACTIVE_CREATOR_ACCOUNT, !isCreatorAccountActive);
    this.isCreatorAccountActive$.next(!isCreatorAccountActive);
  }

  async updateCreatorAccount(creatorAccount: ContentCreatorAccount) {
    const user = await this.loadUserProfile().toPromise();
    user.creatorAccount = creatorAccount;
    return this.updateCachedUserProfile(user);
  }

  private async _initData() {
    const isCreatorAccountActive = await this.storage.get<string>(StorageKeys.ACTIVE_CREATOR_ACCOUNT)
    this.isCreatorAccountActive$.next(isCreatorAccountActive === 'true');
  }

}
