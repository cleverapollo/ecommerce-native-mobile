import { Injectable } from '@angular/core';
import { SharedWishListApiService } from '@core/api/shared-wish-list-api.service';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendWishListStoreService {

  private readonly CACHE_DEFAULT_TTL = 60 * 60;
  private readonly CACHE_GROUP_KEY = 'friendWishList';
  private readonly CACHE_KEY_WISH_LISTS = 'friendWishLists'

  private cacheKeyWishList(id: string): string {
    return `getFriendWishList${id}`
  }

  constructor(
    private friendApiService: SharedWishListApiService, 
    private cache: CacheService
  ) { }

  loadWishLists(forceRefresh: boolean = false): Observable<Array<FriendWishList>> {
    let request = this.friendApiService.getWishLists() as Observable<Array<FriendWishList>>;
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY)
  }

  removeCachedWishLists(): Promise<void> {
    return this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
  }

  loadWishList(id: string, forceRefresh: boolean = false): Observable<FriendWishList> {
    let request = this.friendApiService.getWishListById(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY)
  }

  updateCachedWishList(wishList: FriendWishList) {
    this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: FriendWishList[]) => {
      const wishListIndex = wishLists.findIndex( w => w.id == wishList.id);
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
