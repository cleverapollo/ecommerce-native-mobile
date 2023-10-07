import { Injectable } from '@angular/core';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { SharedWishListApiService } from '@core/api/shared-wish-list-api.service';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { sortWishesByIsFavorite } from '@core/wish-list.utils';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Logger } from './log.service';
import { DefaultPlatformService } from './platform.service';

export interface FriendWishListStore {
  loadWishLists(forceRefresh: boolean): Observable<FriendWishList[]>;
  loadWishList(id: string, forceRefresh: boolean): Observable<FriendWishList>;
  removeWishListById(wishListId: string): Promise<void>;
  removeCachedWishLists(): Promise<void>;
  updateCachedWishList(wishList: FriendWishList): void;
}

@Injectable({
  providedIn: 'root'
})
export class FriendWishListStoreService implements FriendWishListStore {

  private readonly CACHE_DEFAULT_TTL = 60 * 60;
  private readonly CACHE_GROUP_KEY = 'friendWishList';
  private readonly CACHE_KEY_WISH_LISTS = 'friendWishLists'

  private cacheKeyWishList(id: string): string {
    return `getFriendWishList${id}`;
  }

  private cacheKeyPublicWishList(id: string): string {
    return `publicSharedWishList${id}`;
  }

  constructor(
    private sharedWishListApiService: SharedWishListApiService,
    private publicResourceApiService: PublicResourceApiService,
    private platformService: DefaultPlatformService,
    private cache: CacheService,
    private logger: Logger
  ) { }

  loadWishLists(forceRefresh: boolean = false): Observable<FriendWishList[]> {
    const request = this.sharedWishListApiService.getWishLists() as Observable<FriendWishList[]>;
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all');
    }
    return this.cache.loadFromObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY);
  }

  loadWishes(wishListId: string): Observable<FriendWish[]> {
    return this.loadWishList(wishListId, false).pipe(
      map(wishList => {
        const wishes = wishList.wishes;
        return wishes.sort(sortWishesByIsFavorite);
      }),
      catchError(error => {
        this.logger.error(error);
        return [];
      })
    )
  }

  async removeWishListById(wishListId: string): Promise<void> {
    await this.sharedWishListApiService.removeWishListById(wishListId).toPromise();
    await this.cache.removeItem(this.cacheKeyWishList(wishListId));
    return this.removeCachedWishLists();
  }

  removeCachedWishLists(): Promise<void> {
    return this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
  }

  loadWishList(id: string, forceRefresh: boolean = false): Observable<FriendWishList> {
    if (this.platformService.isWeb) {
      return this.publicResourceApiService.getSharedWishList(id);
    }
    const request = this.sharedWishListApiService.getWishListById(id);
    const cacheKey = this.cacheKeyWishList(id);
    return forceRefresh ?
      this.cache.loadFromDelayedObservable(cacheKey, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all') :
      this.cache.loadFromObservable(cacheKey, request, this.CACHE_GROUP_KEY);
  }

  updateCachedWishList(wishList: FriendWishList): void {
    this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: FriendWishList[]) => {
      const wishListIndex = wishLists.findIndex(w => w.id === wishList.id);
      if (wishListIndex !== -1) {
        wishLists[wishListIndex] = wishList;
        this.cache.saveItem(this.CACHE_KEY_WISH_LISTS, wishLists, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      } else {
        this.removeCachedWishLists();
      }
    }, () => {
      this.removeCachedWishLists();
    });
  }

  /**
   * Is this a wish list from a friend?
   * @param wishListId Id of the wish list.
   * @returns True or false
   */
  async isSharedWishList(wishListId: string): Promise<boolean> {
    try {
      const wishLists = await this.loadWishLists().toPromise();
      const wishList = wishLists.find((w) => w.id === wishListId);
      return wishList !== undefined;
    } catch (error) {
      return false;
    }
  }

}
