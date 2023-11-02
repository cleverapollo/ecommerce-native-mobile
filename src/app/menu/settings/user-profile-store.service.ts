import { Injectable } from '@angular/core';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { UserApiService } from '@core/api/user-api.service';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { UserProfile } from '@core/models/user.model';
import { Logger } from '@core/services/log.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

enum ItemKeys {
  userProfile = 'userProfile',
  userImage = 'userImage',
  creatorImage = 'creatorImage'
}

const cacheObject = {
  ttl: 60 * 60,
  itemKey: ItemKeys.userProfile,
  groupKey: 'user'
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileStore {

  isCreatorAccountActive$ = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<UserProfile | null>(null);
  creatorImage$ = new BehaviorSubject<Blob | null>(null);
  userImage$ = new BehaviorSubject<Blob | null>(null);

  constructor(
    private cache: CacheService,
    private storage: StorageService,
    private api: UserApiService,
    private creatorApi: ContentCreatorApiService,
    private logger: Logger
  ) {
    this.storage.get<string>(StorageKeys.ACTIVE_CREATOR_ACCOUNT).then(isCreatorAccountActive => {
      this.isCreatorAccountActive$.next(isCreatorAccountActive === 'true');
    });
  }

  loadUserProfile(forceRefresh: boolean = false): Observable<UserProfile> {
    const request = this.api.getProfile();
    return (forceRefresh ?
      this.cache.loadFromDelayedObservable(cacheObject.itemKey, request, cacheObject.groupKey, cacheObject.ttl, 'all') :
      this.cache.loadFromObservable(cacheObject.itemKey, request, cacheObject.groupKey)).pipe(
        tap(user => this.user$.next(user))
      )
  }

  async updateUserImage(file: ArrayBuffer): Promise<void> {
    await this.api.updateImage(file);
    await this._clearUserImage();
    return this.clearUserProfile();
  }

  downloadUserImage(forceRefresh: boolean = false): Observable<Blob> {
    const request = this.api.getImage();
    return (forceRefresh ?
      this.cache.loadFromDelayedObservable(ItemKeys.userImage, request, cacheObject.groupKey, cacheObject.ttl, 'all') :
      this.cache.loadFromObservable(ItemKeys.userImage, request, cacheObject.groupKey)).pipe(
        tap(blob => this.userImage$.next(blob))
      )
  }

  deleteUserImage(): Observable<void> {
    return this.api.deleteImage().pipe(
      mergeMap(async user => {
        await this.updateCachedUserProfile(user);
        return this._clearUserImage();
      })
    );
  }

  downloadCreatorImage(forceRefresh: boolean = false): Observable<Blob> {
    const request = this.creatorApi.getImage();
    return (forceRefresh ?
      this.cache.loadFromDelayedObservable(ItemKeys.creatorImage, request, cacheObject.groupKey, cacheObject.ttl, 'all') :
      this.cache.loadFromObservable(ItemKeys.creatorImage, request, cacheObject.groupKey)).pipe(
        tap(blob => this.creatorImage$.next(blob))
      );
  }

  async updateCreatorImage(file: ArrayBuffer): Promise<void> {
    await this.creatorApi.updateImage(file);
    await this._clearCreatorImage();
    return this.clearUserProfile();
  }

  deleteCreatorImage(): Observable<void> {
    return this.creatorApi.deleteImage().pipe(
      mergeMap(async account => {
        await this.updateCreatorAccount(account);
        return this._clearCreatorImage();
      })
    );
  }

  async updateCachedUserProfile(userProfile: UserProfile): Promise<void> {
    try {
      await this.cache.saveItem(cacheObject.itemKey, userProfile, cacheObject.groupKey, cacheObject.ttl);
      this.user$.next(userProfile);
    } catch (error) {
      this.logger.error(error);
      return this.clearUserProfile();
    }
  }

  async clearUserProfile(): Promise<void> {
    await this.cache.removeItem(cacheObject.itemKey);
    return this.user$.next(null);
  }

  async toggleIsCreatorAccountActive() {
    const isCreatorAccountActive = this.isCreatorAccountActive$.value;
    await this.storage.set(StorageKeys.ACTIVE_CREATOR_ACCOUNT, !isCreatorAccountActive);
    this.isCreatorAccountActive$.next(!isCreatorAccountActive);
  }

  async updateCreatorAccount(creatorAccount: ContentCreatorAccount) {
    const user = await lastValueFrom(this.loadUserProfile());
    user.creatorAccount = creatorAccount;
    return this.updateCachedUserProfile(user);
  }

  private async _clearUserImage(): Promise<void> {
    await this.cache.removeItem(ItemKeys.userImage);
    this.userImage$.next(null);
  }

  private async _clearCreatorImage(): Promise<void> {
    await this.cache.removeItem(ItemKeys.creatorImage);
    this.creatorImage$.next(null);
  }

}
