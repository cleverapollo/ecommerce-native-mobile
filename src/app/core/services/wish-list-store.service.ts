import { Injectable } from '@angular/core';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { CacheService } from 'ionic-cache';
import { WishApiService } from '@core/api/wish-api.service';
import { from, Observable } from 'rxjs';
import { LogService } from './log.service';
import { StorageKeys, StorageService } from './storage.service';
import { UserService } from './user.service';
import { RegistrationResponse } from '@core/models/registration.model';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishListStoreService {

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
    private logger: LogService,
    private storageService: StorageService,
    private userService: UserService
  ) { }

  // WISH LISTS

  loadWishLists(forceRefresh: boolean = false): Observable<Array<WishListDto>> {
    if (this.userService.accountIsEnabled) {
      return this.loadWishListsForEnabledAccount(forceRefresh)
    }
    return this.loadWishListsForDisabledAccount();
  }

  private loadWishListsForEnabledAccount(forceRefresh: boolean = false): Observable<Array<WishListDto>> {
    let request = this.wishListApiService.getWishLists() as Observable<Array<WishListDto>>;
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.CACHE_KEY_WISH_LISTS, request, this.CACHE_GROUP_KEY)
  }

  private loadWishListsForDisabledAccount(): Observable<Array<WishListDto>> {
    return from(new Promise<Array<WishListDto>>((resolve) => {
      this.storageService.get<RegistrationResponse>(StorageKeys.REGISTRATION_RESPONSE).then((responseBody) => {
        resolve(responseBody?.wishLists ?? []);
      }, error => {
        this.logger.error(error);
        resolve([]);
      });
    }))
  }

  removeCachedWishLists() {
    this.cache.removeItem(this.CACHE_KEY_WISH_LISTS);
  }

  // WISH LIST

  loadWishList(id: string, forceRefresh: boolean = false): Observable<WishListDto> {
    if (this.userService.accountIsEnabled) {
      return this.loadWishListForEnabledAccount(id, forceRefresh);
    }
    return this.loadWishListForDisabledAccount(id);
  }

  private loadWishListForEnabledAccount(id: string, forceRefresh: boolean = false): Observable<WishListDto> {
    let request = this.wishListApiService.getWishList(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.cacheKeyWishList(id), request, this.CACHE_GROUP_KEY)
  }

  private loadWishListForDisabledAccount(id: string): Observable<WishListDto> {
    return from(new Promise<WishListDto>((resolve) => {
      this.storageService.get<RegistrationResponse>(StorageKeys.REGISTRATION_RESPONSE).then((responseBody) => {
        const wishLists = responseBody.wishLists;
        if (wishLists?.length && wishLists[0]?.id && wishLists[0].id === id) {
          resolve(wishLists[0]);
        } else {
          resolve(null);
        }
      }, error => {
        this.logger.error(error);
        resolve(null);
      });
    }))
  }

  removeCachedWishList(id: string) {
    this.cache.removeItem(this.cacheKeyWishList(id));
    this.cache.getItem(this.CACHE_KEY_WISH_LISTS).then((wishLists: WishListDto[]) => {
      const wishListIndex = wishLists.findIndex( w => w.id == id);
      if (wishListIndex !== -1) {
        wishLists.splice(wishListIndex, 1);
        this.cache.saveItem(this.CACHE_KEY_WISH_LISTS, wishLists, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      } else {
        this.removeCachedWishLists();
      }
    });
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
    if (this.userService.accountIsEnabled) {
      return this.loadWishForEnabledAccount(id, forceRefresh);
    }
    return this.loadWishForDisabledAccount(id);
  }

  private loadWishForEnabledAccount(id: string, forceRefresh: boolean = false): Observable<WishDto> {
    let request = this.wishApiService.getWishById(id);
    if (forceRefresh) {
      return this.cache.loadFromDelayedObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL, 'all')
    } 
    return this.cache.loadFromObservable(this.cacheKeyWish(id), request, this.CACHE_GROUP_KEY)
  }

  private loadWishForDisabledAccount(id: string): Observable<WishDto> {
    return from(new Promise<WishDto>((resolve) => {
      this.storageService.get<RegistrationResponse>(StorageKeys.REGISTRATION_RESPONSE).then((responseBody) => {
        const wishList = responseBody.wishLists?.[0];
        if (wishList?.wishes?.length) {
          const wish = wishList.wishes[0];
          if (wish.id === id) {
            resolve(wishList.wishes[0]);
          }
        }
        resolve(null);
      }, error => {
        this.logger.error(error);
        resolve(null);
      });
    }))
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

  async saveWishToCache(wish: WishDto): Promise<void> {
    try {
      await this.cache.saveItem(this.cacheKeyWish(wish.id), wish, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL);
      const wishList: WishListDto = await this.cache.getItem(this.cacheKeyWishList(wish.wishListId));
      wishList.wishes.unshift(wish);
      this.updatedCachedWishList(wishList);
      Promise.resolve();
    } catch(error) {
      this.logger.debug(error);
      this.removeCachedWishList(wish.wishListId);
      Promise.resolve();
    }
  }

}
