import { SearchResult } from '@core/models/search-result-item';
import { FriendWishList, FriendWish } from '@core/models/wish-list.model';
import { Observable, of, throwError } from 'rxjs';
import { PublicResourceApi } from './public-resource-api.service';

export class PublicResourceApiMockService implements PublicResourceApi {

    getSharedWishListResult: FriendWishList = null;
    reserveSharedWishResult: FriendWish = null;
    cancelSharedWishReservationResult: FriendWish = null;
    searchForItemsResult: SearchResult = null;

    getSharedWishList(wishListId: string): Observable<FriendWishList> {
        if (this.getSharedWishListResult === null) {
            return throwError('');
        }
        return of(this.getSharedWishListResult);
    }
    reserveSharedWish(wishListId: string, wishId: string): Observable<FriendWish> {
        if (this.reserveSharedWishResult === null) {
            return throwError('');
        }
        return of(this.reserveSharedWishResult);
    }
    cancelSharedWishReservation(wishListId: string, wishId: string): Observable<FriendWish> {
        if (this.cancelSharedWishReservationResult === null) {
            return throwError('');
        }
        return of(this.cancelSharedWishReservationResult);
    }
    searchForItems(keywords: string, page: number): Observable<SearchResult> {
        if (this.searchForItemsResult === null) {
            return throwError('');
        }
        return of(this.searchForItemsResult);
    }

  }