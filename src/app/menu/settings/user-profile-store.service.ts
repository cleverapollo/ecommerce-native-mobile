import { Injectable } from '@angular/core';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { UserApiService } from '@core/api/user-api.service';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { UserProfile } from '@core/models/user.model';
import { Logger } from '@core/services/log.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, mergeMap, tap } from 'rxjs/operators';

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
    this._initData();
  }

  loadUserProfile(forceRefresh: boolean = false): Observable<UserProfile> {
    const request = this.api.getProfile().pipe(
      tap(user => this.user$.next(user))
    );
    return forceRefresh ?
      this.cache.loadFromDelayedObservable(cacheObject.itemKey, request, cacheObject.groupKey, cacheObject.ttl, 'all') :
      this.cache.loadFromObservable(cacheObject.itemKey, request, cacheObject.groupKey);
  }

  async updateUserImage(file: FormData, filePath: string, fileName: string): Promise<void> {
    await this.api.updateImage(file, filePath, fileName);
    await this.cache.removeItem(ItemKeys.userImage);
    await this.cache.removeItem(ItemKeys.userProfile);
  }

  downloadUserImage(forceRefresh: boolean = false): Observable<Blob> {
    const request = this.api.getImage().pipe(
      tap(blob => this.userImage$.next(blob))
    );
    return forceRefresh ?
      this.cache.loadFromDelayedObservable(ItemKeys.userImage, request, cacheObject.groupKey, cacheObject.ttl, 'all') :
      this.cache.loadFromObservable(ItemKeys.userImage, request, cacheObject.groupKey);
  }

  deleteUserImage(): Observable<void> {
    return this.api.deleteImage().pipe(
      mergeMap(async user => {
        await this.updateCachedUserProfile(user);
        await this.cache.removeItem(ItemKeys.userImage);
        this.userImage$.next(null);
      })
    );
  }

  downloadCreatorImage(forceRefresh: boolean = false): Observable<Blob> {
    const request = this.creatorApi.getImage().pipe(
      tap(blob => this.creatorImage$.next(blob))
    )
    return forceRefresh ?
      this.cache.loadFromDelayedObservable(ItemKeys.creatorImage, request, cacheObject.groupKey, cacheObject.ttl, 'all') :
      this.cache.loadFromObservable(ItemKeys.creatorImage, request, cacheObject.groupKey);
  }

  async updateCreatorImage(file: FormData, filePath: string, fileName: string): Promise<void> {
    await this.creatorApi.updateImage(file, filePath, fileName);
    await this.cache.removeItem(ItemKeys.creatorImage);
    await this.cache.removeItem(ItemKeys.userProfile);
  }

  deleteCreatorImage(): Observable<void> {
    return this.creatorApi.deleteImage().pipe(
      mergeMap(async account => {
        await this.updateCreatorAccount(account);
        await this.cache.removeItem(ItemKeys.creatorImage);
        this.creatorImage$.next(null);
      })
    );
  }

  async updateCachedUserProfile(userProfile: UserProfile): Promise<void> {
    try {
      await this.cache.saveItem(cacheObject.itemKey, userProfile, cacheObject.groupKey, cacheObject.ttl);
      this.user$.next(userProfile);
    } catch (error) {
      this.logger.error(error);
      return this.removeCachedUserProfile();
    }
  }

  async removeCachedUserProfile(): Promise<void> {
    await this.cache.removeItem(cacheObject.itemKey);
    return this.user$.next(null);
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

  private async _initData(): Promise<void> {
    const isCreatorAccountActive = await this.storage.get<string>(StorageKeys.ACTIVE_CREATOR_ACCOUNT);
    this.isCreatorAccountActive$.next(isCreatorAccountActive === 'true');

    this.loadUserProfile().pipe(
      first()
    ).subscribe({
      next: user => {
        this.user$.next(user);
      }
    })
  }

}
