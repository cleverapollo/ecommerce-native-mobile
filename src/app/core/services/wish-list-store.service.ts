import { Injectable } from '@angular/core';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { CacheService } from 'ionic-cache';
import { WishApiService } from '@core/api/wish-api.service';
import { Observable } from 'rxjs';
import { Logger } from './log.service';
import { WishListCreateRequest, WishListUpdateRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';

export interface WishListStore {
  loadWishLists(forceRefresh: boolean): Observable<Array<WishListDto>>;
  loadWishList(id: string, forceRefresh: boolean): Observable<WishListDto>;
  loadWish(id: string, forceRefresh: boolean): Observable<WishDto>;
  createWish(wish: WishDto): Promise<WishDto>;
  createWishList(wish: WishListCreateRequest): Promise<WishListDto>;
  updateWish(wish: WishDto): Promise<WishDto>;
  updateWishList(wishList: WishListUpdateRequest): Promise<WishListDto>;
  clearWishLists(): Promise<void>;
  removeWish(wish: WishDto): Promise<void>;
  saveWishListToCache(wishList: WishListDto): Promise<void>;
  clear(): Promise<any>;
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
    private logger: Logger
  ) { }

  clear(): Promise<any> {
    return this.cache.clearGroup(this.CACHE_GROUP_KEY);
  }

  // WISH LISTS

  loadWishLists(forceRefresh: boolean = false): Observable<Array<WishListDto>> {
    const request = this.wishListApiService.getWishLists() as Observable<Array<WishListDto>>;
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
    const request = this.wishListApiService.getWishList(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    }
    return this.cache.loadFromObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY)
  }

  async deleteWishList(id: string): Promise<void> {
    await this.wishListApiService.delete(id).toPromise();
    return this.removeCachedWishList(id);
  }

  private async removeCachedWishList(id: string): Promise<void> {
    try {
      await this.cache.removeItem(this.cacheKeyWishList(id));
    } catch (error) {
      return Promise.reject();
    }

    try {
      const wishLists: WishListDto[] = await this.cache.getItem(this.CACHE_KEY_WISH_LISTS);
      const wishListIndex = wishLists.findIndex( w => w.id === id);
      if (wishListIndex !== -1) {
        wishLists.splice(wishListIndex, 1);
        return this.cache.saveItem(this.CACHE_KEY_WISH_LISTS, wishLists, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      } else {
        return this.clearWishLists();
      }
    } catch (error) {
      return Promise.reject();
    }
  }

  async updateWishList(wishList: WishListUpdateRequest): Promise<WishListDto> {
    try {
      const updatedWishList = await this.wishListApiService.update(wishList).toPromise();
      await this.updatedCachedWishList(updatedWishList);
      return updatedWishList;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async updatedCachedWishList(wishList: WishListDto): Promise<void> {
    try {
      await this.cache.saveItem(this.cacheKeyWishList(wishList.id), wishList, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      const wishLists = await this.cache.getItem(this.CACHE_KEY_WISH_LISTS);
      const wishListIndex = wishLists.findIndex((w: WishListDto) => w.id === wishList.id);
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

  async createWishList(request: WishListCreateRequest): Promise<WishListDto> {
    try {
      const wishList = await this.wishListApiService.create(request as WishListCreateRequest).toPromise();
      await this.saveWishListToCache(wishList);
      return wishList;
    } catch (error) {
      return Promise.reject(error);
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

  async createWish(wish: WishDto): Promise<WishDto> {
    try {
      const createdWish = await this.wishApiService.createWish(wish).toPromise();
      await this.clearWishLists();
      return createdWish;
    } catch (error) {
      throw error;
    }
  }

  async updateWish(wish: WishDto): Promise<WishDto> {
    try {
      const updatedWish = await this.wishApiService.update(wish).toPromise();
      await this.updateCachedWish(updatedWish);
      return updatedWish;
    } catch (error) {
      throw error;
    }
  }

  loadWish(id: string, forceRefresh: boolean = false): Observable<WishDto> {
    const request = this.wishApiService.getWishById(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    }
    return this.cache.loadFromObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY)
  }

  private async updateCachedWish(wish: WishDto): Promise<void> {
    try {
      await this.cache.saveItem(this.cacheKeyWish(wish.id), wish, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      const wishList = await this.cache.getItem(this.cacheKeyWishList(wish.wishListId));
      const wishIndex = wishList.wishes.findIndex((w: WishListDto) => w.id === wish.id);
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

  async removeWish(wish: WishDto): Promise<void> {
    await this.wishListApiService.removeWish(wish).toPromise();
    await this.removeWishFromCache(wish);
  }

  private async removeWishFromCache(wish: WishDto): Promise<void> {
    try {
      await this.cache.removeItem(this.cacheKeyWish(wish.id));
      const wishList: WishListDto = await this.cache.getItem(this.cacheKeyWishList(wish.wishListId));
      const wishIndex = wishList.wishes.findIndex(w => w.id === wish.id);
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
