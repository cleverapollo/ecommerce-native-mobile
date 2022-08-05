import { Injectable } from '@angular/core';
import { SharedWishListApiService } from '@core/api/shared-wish-list-api.service';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { Logger } from './log.service';

export interface FriendWishListStore {
  loadWishLists(forceRefresh: boolean): Observable<Array<FriendWishList>>;
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
    return `getFriendWishList${id}`
  }

  constructor(
    private sharedWishListApiService: SharedWishListApiService,
    private cache: CacheService,
    private logger: Logger
  ) { }

  loadWishLists(forceRefresh: boolean = false): Observable<Array<FriendWishList>> {
    const request = this.sharedWishListApiService.getWishLists() as Observable<Array<FriendWishList>>;
    if (forceRefresh) {
      this.logger.log('force refresh');
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    }
    return this.cache.loadFromObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY)
  }

  removeWishListById(wishListId: string): Promise<void> {
    return this.sharedWishListApiService.removeWishListById(wishListId).toPromise();
  }

  removeCachedWishLists(): Promise<void> {
    return this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
  }

  loadWishList(id: string, forceRefresh: boolean = false): Observable<FriendWishList> {
    const request = this.sharedWishListApiService.getWishListById(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    }
    return this.cache.loadFromObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY)
  }

  updateCachedWishList(wishList: FriendWishList): void {
    this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: FriendWishList[]) => {
      const wishListIndex = wishLists.findIndex( w => w.id === wishList.id);
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

}
