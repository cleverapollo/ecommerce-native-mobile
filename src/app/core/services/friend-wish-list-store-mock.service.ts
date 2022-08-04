import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { Observable, of } from 'rxjs';
import { FriendWishListStore } from './friend-wish-list-store.service';

export class MockFriendWishListStoreService implements FriendWishListStore {

    wishLists: FriendWishList[] = [];
    wishList: FriendWishList = null;

    removeWishListByIdResponse: Promise<void> = Promise.resolve();

    loadWishLists(forceRefresh: boolean): Observable<FriendWishList[]> {
        return of(this.wishLists);
    }
    loadWishList(id: string, forceRefresh: boolean): Observable<FriendWishList> {
        return of(this.wishList);
    }
    removeWishListById(wishListId: string): Promise<void> {
        return this.removeWishListByIdResponse;
    }
    removeCachedWishLists(): Promise<void> {
        return Promise.resolve();
    }
    updateCachedWishList(wishList: FriendWishList): void {
        this.wishList = wishList;
    }

}