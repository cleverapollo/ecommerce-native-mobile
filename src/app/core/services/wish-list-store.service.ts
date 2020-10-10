import { Injectable } from '@angular/core';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { CacheService } from 'ionic-cache';
import { WishApiService } from '@core/api/wish-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListStoreService {

  private readonly CACHE_DEFAULT_TTL = 60 * 60;
  private readonly CACHE_GROUP_KEY = 'wishList';
  private readonly CACHE_KEY_WISH_LISTS = 'getWishLists'

  private cacheKeyWishList(id: Number): string {
    return `getWishList${id}`
  }

  private cacheKeyWish(id: Number): string {
   return `getWish${id}` 
  }

  constructor(
    private wishListApiService: WishListApiService, 
    private wishApiService: WishApiService,
    private cache: CacheService
  ) { }

  // WISH LISTS

  loadWishLists(forceRefresh: boolean = false): Observable<Array<WishListDto>> {
    let request = this.wishListApiService.getWishLists('DASHBOARD');
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY)
  }

  removeCachedWishLists() {
    this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
  }

  // WISH LIST

  loadWishList(id: Number, forceRefresh: boolean = false): Observable<WishListDto> {
    let request = this.wishListApiService.getWishList(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY)
  }

  removeCachedWishList(id: Number) {
    this.cache.removeItem(this.cacheKeyWishList(id));
  }

  updatedCachedWishList(wishList: WishListDto) {
    this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: WishListDto[]) => {
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

  saveWishListToCache(wishList: WishListDto) {
    this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: WishListDto[]) => {
      wishLists.push(wishList);
      this.cache.saveItem(this.CACHE_KEY_WISH_LISTS, wishLists, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    }, () => {
      this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
    });
  }

  // WISH

  loadWish(id: Number, forceRefresh: boolean = false): Observable<WishDto> {
    let request = this.wishApiService.getWishById(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY)
  }

  updateCachedWish(wish: WishDto) {
    this.cache.saveItem(this.cacheKeyWish(wish.id), wish, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    this.cache.getItem(this.cacheKeyWishList(wish.wishListId)).then((wishList: WishListDto) => {
      const wishIndex = wishList.wishes.findIndex( w => w.id == wish.id);
      if (wishIndex !== -1) {
        wishList.wishes[wishIndex] = wish;
        this.updatedCachedWishList(wishList);
      } else {
        this.removeCachedWishList(wish.wishListId);
      }
    }, () => {
      this.removeCachedWishList(wish.wishListId);
    });
  }

  removeWishFromCache(wish: WishDto) {
    this.cache.removeItem(this.cacheKeyWish(wish.id)).then(() => {
      this.cache.getItem(this.cacheKeyWishList(wish.wishListId)).then((wishList: WishListDto) => {
        const wishIndex = wishList.wishes.findIndex(w => w.id == wish.id);
        if (wishIndex !== -1) {
          wishList.wishes.splice(wishIndex, 1);
          this.updatedCachedWishList(wishList);
        } else {
          this.removeCachedWishList(wish.wishListId);
        }
      }, () => {
        this.removeCachedWishList(wish.wishListId);
      });
    });
  }

  saveWishToCache(wish: WishDto) {
    this.cache.saveItem(this.cacheKeyWish(wish.id), wish, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
    this.cache.getItem(this.cacheKeyWishList(wish.wishListId)).then((wishList: WishListDto) => {
      wishList.wishes.push(wish);
      this.updatedCachedWishList(wishList);
    }, () => {
      this.removeCachedWishList(wish.wishListId);
    });
  }

}
