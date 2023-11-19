import { Injectable } from '@angular/core';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { SharedWishListApiService } from '@core/api/shared-wish-list-api.service';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Logger } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class FriendWishListStoreService {

  private readonly _sharedWishLists = new BehaviorSubject<FriendWishList[]>([]);
  private readonly _publicSharedWishLists = new BehaviorSubject<FriendWishList[]>([]);

  readonly sharedWishLists$ = this._sharedWishLists.asObservable();
  readonly publicSharedWishLists$ = this._publicSharedWishLists.asObservable();

  constructor(
    private api: SharedWishListApiService,
    private publicApi: PublicResourceApiService,
    private logger: Logger
  ) { }

  get sharedWishLists(): FriendWishList[] {
    return this._sharedWishLists.getValue();
  }

  set sharedWishLists(sharedWishLists: FriendWishList[]) {
    this._sharedWishLists.next(sharedWishLists);
  }

  get publicSharedWishLists(): FriendWishList[] {
    return this._publicSharedWishLists.getValue();
  }

  set publicSharedWishLists(sharedWishLists: FriendWishList[]) {
    this._publicSharedWishLists.next(sharedWishLists);
  }

  async loadSharedWishLists(forceRefresh: boolean = false): Promise<FriendWishList[]> {
    const wishLists = this._sharedWishLists.getValue();
    if (!forceRefresh && wishLists.length) {
      return wishLists;
    }

    try {
      this.sharedWishLists = await lastValueFrom(this.api.getWishLists());
      return this.sharedWishLists;
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  async removeWishListById(wishListId: string): Promise<void> {
    await lastValueFrom(this.api.removeWishListById(wishListId));
    this.sharedWishLists = this.sharedWishLists.filter(wishList => wishList.id !== wishListId);
  }

  async loadSharedWishList(id: string, forceRefresh = false): Promise<FriendWishList> {
    const cachedList = this.sharedWishLists.find(list => list.id === id);
    if (!forceRefresh && cachedList) {
      return cachedList;
    }

    const wishList = await lastValueFrom(this.api.getWishListById(id));
    if (cachedList) {
      const index = this.sharedWishLists.indexOf(cachedList);
      this.sharedWishLists[index] = wishList;
      this.sharedWishLists = [...this.sharedWishLists];
    } else {
      this.sharedWishLists.push(wishList);
    }
    return wishList;
  }

  async loadPublicSharedWishList(id: string, forceRefresh = false): Promise<FriendWishList> {
    const cachedList = this.publicSharedWishLists.find(list => list.id === id);
    if (!forceRefresh && cachedList) {
      return cachedList;
    }

    const wishList = await lastValueFrom(this.publicApi.getSharedWishList(id));
    if (cachedList) {
      const index = this.publicSharedWishLists.indexOf(cachedList);
      this.publicSharedWishLists[index] = wishList;
      this.publicSharedWishLists = [...this.publicSharedWishLists];
    } else {
      this.publicSharedWishLists.push(wishList);
    }
    return wishList;
  }

  updateSharedWish(updatedWish: FriendWish): void {
    const list = this.sharedWishLists.find(wish => wish.id === updatedWish.wishListId);
    if (list) {
      const listIndex = this.sharedWishLists.indexOf(list);
      const itemIndex = list.wishes.findIndex(wish => wish.id === updatedWish.id);
      if (itemIndex !== -1) {
        list.wishes[itemIndex] = updatedWish;
      } else {
        this.logger.warn(`Wish "${updatedWish.id}" not found in list "${list.id}"`);
        list.wishes.push(updatedWish);
      }
      this.sharedWishLists[listIndex] = list;
      this.sharedWishLists = [...this.sharedWishLists];
    } else {
      this.logger.warn(`Wish list with id "${updatedWish.wishListId}" not found`);
    }
  }

  updatePublicSharedWish(updatedWish: FriendWish): void {
    const list = this.publicSharedWishLists.find(wish => wish.id === updatedWish.wishListId);
    if (list) {
      const listIndex = this.publicSharedWishLists.indexOf(list);
      const itemIndex = list.wishes.findIndex(wish => wish.id === updatedWish.id);
      if (itemIndex !== -1) {
        list.wishes[itemIndex] = updatedWish;
      } else {
        this.logger.warn(`Wish "${updatedWish.id}" not found in list "${list.id}"`);
        list.wishes.push(updatedWish);
      }
      this.publicSharedWishLists[listIndex] = list;
      this.publicSharedWishLists = [...this.publicSharedWishLists];
    } else {
      this.logger.warn(`Wish list with id "${updatedWish.wishListId}" not found`);
    }
  }

  /**
   * Is this a wish list from a friend?
   * @param wishListId Id of the wish list.
   * @returns True or false
   */
  async isSharedWishList(wishListId: string): Promise<boolean> {
    try {
      const wishLists = await this.loadSharedWishLists();
      const wishList = wishLists.find((w) => w.id === wishListId);
      return wishList !== undefined;
    } catch (error) {
      return false;
    }
  }

  clearCache(): void {
    this.sharedWishLists = [];
    this.publicSharedWishLists = [];
  }

}
