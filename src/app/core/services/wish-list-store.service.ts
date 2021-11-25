import { Injectable } from '@angular/core';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { CacheService } from 'ionic-cache';
import { WishApiService } from '@core/api/wish-api.service';
import { Observable } from 'rxjs';
import { LogService } from './log.service';

export interface WishListStore {
  loadWishLists(forceRefresh: boolean): Observable<Array<WishListDto>>;
  loadWishList(id: string, forceRefresh: boolean): Observable<WishListDto>;
  loadWish(id: string, forceRefresh: boolean): Observable<WishDto>;
  clearWishLists(): Promise<void>;
  removeCachedWishList(id: string): void;
  removeWishFromCache(wish: WishDto): Promise<void>;
  updatedCachedWishList(wishList: WishListDto): Promise<void>;
  updateCachedWish(wish: WishDto): Promise<void>;
  saveWishListToCache(wishList: WishListDto): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class WishListStoreService implements WishListStore {

  private readonly CACHE_DEFAULT_TTL = 60 * 60;
  private readonly CACHE_GROUP_KEY = 'wishList';
  private readonly CACHE_KEY_WISH_LISTS = 'getWishLists'

  private cacheKeyWishList(id: string): string {
    return `getWishList${id}`
  }

  private cacheKeyWish(id: string): string {
   return `getWish${id}` 
  }

  constructor(
    private wishListApiService: WishListApiService, 
    private wishApiService: WishApiService,
    private cache: CacheService,
    private logger: LogService
  ) { }

  // WISH LISTS

  loadWishLists(forceRefresh: boolean = false): Observable<Array<WishListDto>> {
    let request = this.wishListApiService.getWishLists() as Observable<Array<WishListDto>>;
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY)
  }

  clearWishLists(): Promise<void> {
    return this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
  }

  // WISH LIST

  loadWishList(id: string, forceRefresh: boolean = false): Observable<WishListDto> {
    let request = this.wishListApiService.getWishList(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY)
  }

  removeCachedWishList(id: string) {
    this.cache.removeItem(this.cacheKeyWishList(id));
    this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: WishListDto[]) => {
      const wishListIndex = wishLists.findIndex( w => w.id == id);
      if (wishListIndex !== -1) {
        wishLists.splice(wishListIndex, 1);
        this.cache.saveItem(this.CACHE_KEY_WISH_LISTS, wishLists, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      } else {
        this.clearWishLists();
      }
    });
  }

  async updatedCachedWishList(wishList: WishListDto): Promise<void> {
    try {
      await this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      const wishLists = await this.cache.getItem(this.CACHE_KEY_WISH_LISTS);
      const wishListIndex = wishLists.findIndex((w: WishListDto) => w.id == wishList.id);
      if (wishListIndex !== -1) {
        wishLists[wishListIndex] = wishList;
        this.cache.saveItem(this.CACHE_KEY_WISH_LISTS, wishLists, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      } else {
        this.clearWishLists();
      }
    } catch (error) {
      this.logger.error(error);
      this.clearWishLists();
    }
  }

  saveWishListToCache(wishList: WishListDto): Promise<void> {
    return new Promise((resolve) => {
      this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL).finally(() => {
        this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: WishListDto[]) => {
          wishLists.push(wishList);
          this.cache.saveItem(this.CACHE_KEY_WISH_LISTS, wishLists, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
        }, () => {
          this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
        }).finally(() => {
          resolve();
        });
      });
    })

  }

  // WISH

  loadWish(id: string, forceRefresh: boolean = false): Observable<WishDto> {
    let request = this.wishApiService.getWishById(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY)
  }

  async updateCachedWish(wish: WishDto): Promise<void> {
    try {
      await this.cache.saveItem(this.cacheKeyWish(wish.id), wish, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      const wishList = await this.cache.getItem(this.cacheKeyWishList(wish.wishListId));
      const wishIndex = wishList.wishes.findIndex((w: WishListDto) => w.id == wish.id);
      if (wishIndex !== -1) {
        wishList.wishes[wishIndex] = wish;
        this.updatedCachedWishList(wishList);
      } else {
        this.removeCachedWishList(wish.wishListId);
      }
    } catch (error) {
      this.logger.error(error);
      this.removeCachedWishList(wish.wishListId);
    }
  }

  async removeWishFromCache(wish: WishDto): Promise<void> {
    try {
      await this.cache.removeItem(this.cacheKeyWish(wish.id));
      const wishList: WishListDto = await this.cache.getItem(this.cacheKeyWishList(wish.wishListId));
      const wishIndex = wishList.wishes.findIndex(w => w.id == wish.id);
      if (wishIndex !== -1) {
        wishList.wishes.splice(wishIndex, 1);
        this.updatedCachedWishList(wishList);
      } else {
        this.removeCachedWishList(wish.wishListId);
      }
      return Promise.resolve();
    } catch(error) {
      this.removeCachedWishList(wish.wishListId);
      return Promise.reject();
    }
  }

}
