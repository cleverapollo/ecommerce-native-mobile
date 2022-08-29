import { Injectable } from '@angular/core';
import { WishApiService } from '@core/api/wish-api.service';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishDto, WishListCreateRequest, WishListDto, WishListUpdateRequest } from '@core/models/wish-list.model';
import { sortWishListsByDate } from '@core/wish-list.utils';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, first, shareReplay, tap } from 'rxjs/operators';
import { Logger } from './log.service';

export interface WishListStore {

  wishLists: Observable<WishListDto[]>;

  loadWishLists(forceRefresh: boolean): Observable<WishListDto[]>;
  loadWishList(id: string, forceRefresh: boolean): Observable<WishListDto | null>;
  loadWish(id: string, forceRefresh: boolean): Observable<WishDto | null>;
  createWish(wish: WishDto): Observable<WishDto>;
  createWishList(wish: WishListCreateRequest): Observable<WishListDto>;
  updateWish(wish: WishDto): Observable<WishDto>;
  updateWishList(wishList: WishListUpdateRequest): Observable<WishListDto>;
  removeWish(wish: WishDto): Observable<void>;
  clear(): Promise<any>;
}

const TTL = 60 * 60;
const GROUP_KEY = 'wishList';
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class WishListStoreService implements WishListStore {

  get wishLists(): Observable<WishListDto[]> {
    return this._wishLists.asObservable().pipe(
      shareReplay(CACHE_SIZE)
    );
  }

  private readonly CACHE_KEY_WISH_LISTS = 'getWishLists';
  private _wishLists = new BehaviorSubject<WishListDto[]>([]);

  constructor(
    private wishListApiService: WishListApiService,
    private wishApiService: WishApiService,
    private cache: CacheService,
    private logger: Logger
  ) { }

  /**
   * Clears all items in the cache.
   * @returns Promise if task is completed.
   */
  async clear(): Promise<void> {
    try {
      await this.cache.clearGroup(GROUP_KEY);
      this.removeWishListsFromSubject();
      return Promise.resolve();
    } catch (error) {
      this.logger.error('Error while clearing the cache', error);
      return Promise.reject(error);
    }
  }

  /**
   * Fetches a list of wish lists either from cache or server.
   * When the cached data has expired, the data is retrieved from the server.
   * @param forceRefresh Forces the retrieval of the wish lists from the server.
   * @returns List of wish lists
   */
  loadWishLists(forceRefresh: boolean = false): Observable<WishListDto[]> {
    const request = this.wishListApiService.getWishLists();
    return this.loadItem(request, this.CACHE_KEY_WISH_LISTS, forceRefresh).pipe(
      catchError(_ => of([])),
      tap({
        next: wishLists => this.updateWishListsInSubject(wishLists)
      }),
    );
  }

  /**
   * Fetches a wish list either from cache or server.
   * When the cached data has expired, the data is retrieved from the server.
   * @param id wish list id
   * @param forceRefresh Forces the retrieval of the wish list data from the server
   * @returns wish list
   */
  loadWishList(id: string, forceRefresh: boolean = false): Observable<WishListDto | null> {
    const request = this.wishListApiService.getWishList(id);
    const cacheKey = this.cacheKeyWishList(id);
    return this.loadItem(request, cacheKey, forceRefresh).pipe(
      catchError(_ => of(null)),
      tap({
        next: wishList => {
          if (wishList) {
            this.updateWishListInSubject(wishList);
          }
        }
      })
    );
  }

  /**
   * Creates a new wish list.
   * @param data required data to create a new wish list.
   * @returns the newly created wish list from backend.
   */
  createWishList(data: WishListCreateRequest): Observable<WishListDto> {
    return this.wishListApiService.create(data).pipe(
      concatMap(wishList => {
        return from(this.saveWishListToCache(wishList));
      })
    );
  }

  /**
   * Updates wish list data in server and cache.
   * @param wishList The wish list data to update.
   * @returns Observable with updated wish list data.
   */
  updateWishList(wishList: WishListUpdateRequest): Observable<WishListDto> {
    return this.wishListApiService.update(wishList).pipe(
      concatMap(wishList => {
        return from(this.updateWishListInCache(wishList));
      })
    );
  }

  /**
   * Deletes a wish list from server and cache.
   * @param wishList wish list to delete
   * @returns Promise when the action is completed.
   */
  deleteWishList(wishList: WishListDto): Observable<void> {
    return this.wishListApiService.delete(wishList.id).pipe(
      concatMap(_ => {
        return from(this.removeWishListFromCache(wishList));
      })
    );
  }

  /**
   * Fetches a wish either from cache or server.
   * When the cached data has expired, the data is retrieved from the server.
   * @param id wish id
   * @param forceRefresh Forces the retrieval of the wish data from the server
   * @returns wish or null if wish was not found
   */
  loadWish(id: string, forceRefresh: boolean = false): Observable<WishDto | null> {
    if (!id) {
      throw new Error('Required id to fetch wish data is empty.');
    }
    const request = this.wishApiService.getWishById(id);
    const cacheKey = this.cacheKeyWish(id);
    return this.loadItem(request, cacheKey, forceRefresh).pipe(
      catchError(_ => of(null)),
      tap({
        next: wish => {
          if (wish) {
            this.updateWishInSubject(wish);
          }
        }
      })
    );
  }

  /**
   * Creates a new wish.
   * @param wish Data to create a new wish
   * @returns the newly created wish
   */
  createWish(wish: WishDto): Observable<WishDto> {
    return this.wishApiService.createWish(wish).pipe(
      first(),
      concatMap(createdWish => {
        return from(this.addWishToCache(createdWish));
      })
    );
  }

  /**
   * Updates a wish.
   * @param wish Data to update a wish
   * @returns The updated wish.
   */
  updateWish(wish: WishDto): Observable<WishDto> {
    return this.wishApiService.update(wish).pipe(
      concatMap(updatedWish => {
        return from(this.updateWishInCache(updatedWish));
      })
    );
  }

  /**
   * Moves a wish list from the current wish list to another one.
   * @param wish Wish to change the wish list
   * @param prevWishListId Wish list id of the previous wish list
   * @returns both updated wish lists
   */
  async updateWishListForWish(wish: WishDto, prevWishListId: string): Promise<[WishListDto | null, WishListDto | null]> {
    let [currentWishList, prevWishList] = await Promise.all([
      this.getWishListById(wish.wishListId),
      this.getWishListById(prevWishListId)
    ]);

    if (prevWishList) {
      prevWishList = this.removeWishFromList(wish, prevWishList);
    }
    if (currentWishList) {
      currentWishList = this.addWishToList(wish, currentWishList);
    }

    if (prevWishList && currentWishList) {
      return Promise.all([
        this.updateWishListInCache(currentWishList),
        this.updateWishListInCache(prevWishList),
      ])
    }
    return Promise.reject();
  }

  /**
   * Removes a wish from server and cache.
   * @param wish The wish to delete.
   */
  removeWish(wish: WishDto): Observable<void> {
    return this.wishListApiService.removeWish(wish).pipe(
      concatMap(() => {
        return from(this.removeWishFromCache(wish));
      })
    );
  }

  /**
   * Removes a wish from cache and subject.
   * @param wish A wish to remove.
   * @returns Promise
   */
  private async removeWishFromCache(wish: WishDto): Promise<void> {
    if (!wish.id) {
      return Promise.reject();
    }
    const cacheKey = this.cacheKeyWish(wish.id);
    const wishList = await this.getWishListById(wish.wishListId);

    if (wishList) {
      const updatedWishList = this.removeWishFromList(wish, wishList);
      if (updatedWishList) {
        await this.updateWishListInCache(updatedWishList);
      }
    }

    await this.cache.removeItem(cacheKey);
    return Promise.resolve();
  }

  /**
   * Updates a wish in cache and subject
   * @param wish A wish to update
   * @returns Promise
   */
  private async updateWishInCache(wish: WishDto): Promise<WishDto> {
    if (!wish.id) {
      return Promise.reject();
    }
    const cacheKey = this.cacheKeyWish(wish.id);
    const wishList = await this.getWishListById(wish.wishListId);

    if (wishList) {
      const updatedWishList = this.updateWishInList(wish, wishList);
      if (updatedWishList) {
        await this.updateWishListInCache(updatedWishList);
      }
    }

    await this.cache.saveItem(cacheKey, wish, GROUP_KEY, TTL).catch(() => Promise.resolve());
    return Promise.resolve(wish);
  }

  /**
   * Adds a wish to cache and subject
   * @param wish A wish to add.
   * @returns Promise
   */
  private async addWishToCache(wish: WishDto): Promise<WishDto> {
    if (!wish.id) {
      return Promise.reject();
    }
    const cacheKey = this.cacheKeyWish(wish.id);
    const wishList = await this.getWishListById(wish.wishListId);

    if (wishList) {
      const updatedWishList = this.addWishToList(wish, wishList);
      if (updatedWishList) {
        await this.updateWishListInCache(updatedWishList);
      }
    }

    await this.cache.saveItem(cacheKey, wish, GROUP_KEY, TTL).catch(() => Promise.resolve());
    return Promise.resolve(wish);
  }

  /**
   * Removes a wish from subject
   * @param wish A wish to remove
   * @returns Promise with updates wish list
   */
  private removeWishFromList(wish: WishDto, wishList: WishListDto): WishListDto | null {
    const wishes = wishList.wishes;
    const wishIndex = wishes.findIndex(w => w.id === wish.id);
    if (wishIndex === -1) {
      return null;
    }
    wishes.splice(wishIndex, 1);
    wishList.wishes = wishes;
    return wishList;
  }

  /**
   * Adds a wish to subject
   * @param wish A wish to add
   * @returns Promise with updates wish list
   */
  private addWishToList(wish: WishDto, wishList: WishListDto): WishListDto | null {
    const wishes = wishList.wishes;
    const wishIndex = wishes.findIndex(w => w.id === wish.id);
    if (wishIndex !== -1) {
      return null;
    }
    wishes.push(wish);
    wishList.wishes = wishes;
    return wishList;
  }

  /**
   * Updates a wish in subject
   * @param wish A wish to update
   * @returns Promise with updates wish list
   */
  private updateWishInList(wish: WishDto, wishList: WishListDto): WishListDto | null {
    const wishes = wishList.wishes;
    const wishIndex = wishes.findIndex(w => w.id === wish.id);
    if (wishIndex === -1) {
      return null;
    }
    wishes[wishIndex] = wish;
    wishList.wishes = wishes;
    return wishList;
  }

  /**
   * Adds a wish list to cache and subject
   * @param wishList A wish list to add.
   * @returns Promise
   */
  private async saveWishListToCache(wishList: WishListDto): Promise<WishListDto> {
    const cacheKey = this.cacheKeyWishList(wishList.id);
    const updatedWishLists = this.addWishListToList(wishList, this._wishLists.getValue());
    await this.cache.saveItem(cacheKey, wishList, GROUP_KEY, TTL).catch(() => Promise.resolve());
    await this.updateWishListsInCache(updatedWishLists);
    return Promise.resolve(wishList);
  }

  /**
   * Updates a wish list to cache and subject
   * @param wishList A wish list to update
   * @returns Promise
   */
  private async updateWishListInCache(wishList: WishListDto): Promise<WishListDto> {
    const cacheKey = this.cacheKeyWishList(wishList.id);
    const updatedWishLists = this.updateWishListInList(wishList, this._wishLists.getValue());
    await this.cache.saveItem(cacheKey, wishList, GROUP_KEY, TTL).catch(() => Promise.resolve());
    await this.updateWishListsInCache(updatedWishLists);
    return Promise.resolve(wishList);
  }

  /**
   * Removes a wwish list from cache and subject
   * @param wishList A wish list to remove
   * @returns Promise
   */
  private async removeWishListFromCache(wishList: WishListDto): Promise<void> {
    const cacheKey = this.cacheKeyWishList(wishList.id);
    const updatedWishLists = this.removeWishListFromList(wishList, this._wishLists.getValue());
    await this.cache.removeItem(cacheKey);
    await this.updateWishListsInCache(updatedWishLists);
    return Promise.resolve();
  }

  /**
   * Gets a wish list by id.
   * @param id Wish list id
   * @returns wish list or null
   */
  private async getWishListById(id: string): Promise<WishListDto | null> {
    const wishLists = this._wishLists.getValue();
    const wishListIndex = wishLists.findIndex(w => w.id === id);
    let wishList = null;

    if (wishListIndex !== -1) {
      wishList = wishLists[wishListIndex];
      return Promise.resolve(wishList);
    }

    return await this.loadWishList(id).toPromise()
      .catch(() => Promise.resolve(null));
  }

  /**
   * Adds a wish list to subject
   * @param wishList A wish list to add
   * @returns Promise with updated wish lists
   */
  private addWishListToList(wishList: WishListDto, wishLists: WishListDto[]): WishListDto[] {
    const wishListIndex = wishLists.findIndex(w => w.id === wishList.id);
    if (wishListIndex === -1) {
      wishLists.push(wishList);
    } else {
      this.logger.warn('Wish list already exist in subject.');
    }
    return wishLists;
  }

  /**
   * Updates a wish list in subject
   * @param wishList A wish list to update
   * @returns Promise with updated wish lists
   */
  private updateWishListInList(wishList: WishListDto, wishLists: WishListDto[]): WishListDto[] {
    const wishListIndex = wishLists.findIndex(w => w.id === wishList.id);
    if (wishListIndex !== -1) {
      wishLists[wishListIndex] = wishList;
    } else {
      this.logger.warn('Wish list doesn\'t exist in subject.');
    }
    return wishLists;
  }

  /**
   * Removes a wish list from subject
   * @param wishList A wish list to remove
   * @returns Promise with updated wish lists
   */
  private removeWishListFromList(wishList: WishListDto, wishLists: WishListDto[]): WishListDto[] {
    const wishListIndex = wishLists.findIndex(w => w.id === wishList.id);
    if (wishListIndex !== -1) {
      wishLists.splice(wishListIndex, 1);
    } else {
      this.logger.warn('Wish list doesn\'t exist in subject.');
    }
    return wishLists;
  }

  /**
   * Updates wish lists in subject
   * @param wishLists Wish lists to update
   */
  private updateWishListsInSubject(wishLists: WishListDto[]): void {
    const sorted = wishLists.sort(sortWishListsByDate);
    this._wishLists.next(sorted);
  }

  /**
   * Updates wish list in subject
   * @param wishList Wish list to update
   */
  private updateWishListInSubject(wishList: WishListDto): void {
    const updatedWishLists = this.updateWishListInList(wishList, this._wishLists.getValue());
    this.updateWishListsInSubject(updatedWishLists)
  }

  /**
   * Updates wish in subject
   * @param wish Wish to update
   */
  private updateWishInSubject(wish: WishDto): void {
    const wishLists = this._wishLists.getValue();
    const wishListIndex = wishLists.findIndex(w => w.id === wish.id);
    if (wishListIndex !== -1) {
      const updatedWishList = this.updateWishInList(wish, wishLists[wishListIndex]);
      if (updatedWishList) {
        this.updateWishListInSubject(updatedWishList);
      }
    }
  }

  /**
   * Removes wish lists from subject.
   */
  private removeWishListsFromSubject(): void {
    this._wishLists.next([]);
  }

  /**
   * Updates wish lists in cache and subject.
   * @param wishLists Wish lists to update.
   * @returns Promise
   */
  private async updateWishListsInCache(wishLists: WishListDto[]): Promise<WishListDto[]> {
    const cacheKey = this.CACHE_KEY_WISH_LISTS;
    await this.cache.saveItem(cacheKey, wishLists, GROUP_KEY, TTL).catch(() => Promise.resolve());
    this.updateWishListsInSubject(wishLists);
    return Promise.resolve(wishLists);
  }

  /**
   * Loads item either from backend or cache storage.
   * Saves the item also to the cache.
   * @param request HTTP Get request to fetch data
   * @param cacheKey Unique cache key
   * @param forceRefresh Force data to be fetched from backend
   * @returns cached object or null
   */
  private loadItem<T>(request: Observable<T>, cacheKey: string, forceRefresh: boolean): Observable<T> {
    const observable = forceRefresh ?
      this.refreshData(cacheKey, request) :
      this.cache.loadFromObservable(cacheKey, request, GROUP_KEY, TTL);
    return observable.pipe(
      catchError(error => {
        this.logger.error(`Error while loading item with key ${cacheKey} from cache`, error);
        return throwError(error);
      })
    )
  }

  /**
   * Load data from server, removes existing item from cache.
   * @param cacheKey Key of the cached object
   * @param request Request to fetch data from.
   * @returns An observable with new data from server.
   */
  private refreshData<T>(cacheKey: string, request: Observable<T>): Observable<T> {
    const removeItemObservable = from(this.cache.removeItem(cacheKey).catch(error => {
      this.logger.error(`An error ouccured while removing cached object with key ${cacheKey}`, error);
      return Promise.resolve();
    }));
    return removeItemObservable.pipe(
      concatMap(_ => {
        return this.cache.loadFromObservable<T>(cacheKey, request, GROUP_KEY, TTL)
      }),
      catchError(error => {
        this.logger.error(`An error ouccured while refreshing cached object with key ${cacheKey}`, error);
        return throwError(error);
      })
    );
  }

  /**
   * Creates a cache key for a wish list.
   * @param id wish list id
   * @returns cache key for wish list
   */
  private cacheKeyWishList(id: string): string {
    if (!id) {
      this.logger.error('Id is missing to create a unique cache key!');
    }
    return `getWishList${id}`;
  }

  /**
   * Creates a cache key for a wish.
   * @param id wish id
   * @returns a cache key for wish
   */
  private cacheKeyWish(id: string): string {
    if (!id) {
      this.logger.error('Id is missing to create a unique cache key!');
    }
    return `getWish${id}`;
  }
}
