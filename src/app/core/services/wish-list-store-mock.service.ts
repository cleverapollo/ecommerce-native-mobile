import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { WishListCreateRequest, WishListUpdateRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';
import { Observable, of } from 'rxjs';
import { WishListStore } from './wish-list-store.service';

export class MockWishListStoreService implements WishListStore {

    wishLists: WishListDto[] = [];
    wishlist: WishListDto = new WishListDto();
    wish: WishDto = new WishDto();

    loadWishLists(forceRefresh: boolean): Observable<WishListDto[]> {
        return of(this.wishLists);
    }
    loadWishList(id: string, forceRefresh: boolean): Observable<WishListDto> {
        return of(this.wishlist);
    }
    loadWish(id: string, forceRefresh: boolean): Observable<WishDto> {
        return of(this.wish);
    }
    clearWishLists(): Promise<void> {
        return Promise.resolve();
    }
    createWish(wish: WishDto): Promise<WishDto> {
        return Promise.resolve(wish);
    }
    createWishList(wish: WishListCreateRequest): Promise<WishListDto> {
        return Promise.resolve(this.wishlist);
    }
    removeWish(wish: WishDto): Promise<void> {
        return Promise.resolve();
    }
    updatedCachedWishList(wishList: WishListDto): Promise<void> {
        return Promise.resolve();
    }
    updateWish(wish: WishDto): Promise<WishDto> {
        return Promise.resolve(wish);
    }
    updateWishList(wishList: WishListUpdateRequest): Promise<WishListDto> {
        return Promise.resolve(this.wishlist);
    }
    saveWishListToCache(wishList: WishListDto): Promise<void> {
        return Promise.resolve();
    }
    clear(): Promise<any> {
        return Promise.resolve();
    }
}