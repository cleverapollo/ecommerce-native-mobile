import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResult } from '@core/models/search-result-item';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

enum StateChangeAction {
  RESERVE, CANCEL
}

export interface PublicResourceApi {
  getSharedWishList(wishListId: string): Observable<FriendWishList>;
  reserveSharedWish(wishListId: string, wishId: string): Observable<FriendWish>;
  cancelSharedWishReservation(wishListId: string, wishId: string): Observable<FriendWish>;
  searchForItems(keywords: string, page: number): Observable<SearchResult>;
}

@Injectable({
  providedIn: 'root'
})
export class PublicResourceApiService implements PublicResourceApi {

  private static REST_END_POINT = 'public';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  getSharedWishList(wishListId: string): Observable<FriendWishList> {
    const uri = `${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/shared-wish-lists/${wishListId}`;
    return this.apiService.get<FriendWishList>(uri).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  reserveSharedWish(wishListId: string, wishId: string): Observable<FriendWish> {
    return this.createRequestForWishReservationStateChange(wishListId, wishId, StateChangeAction.RESERVE);
  }

  cancelSharedWishReservation(wishListId: string, wishId: string): Observable<FriendWish> {
    return this.createRequestForWishReservationStateChange(wishListId, wishId, StateChangeAction.CANCEL);
  }

  private createRequestForWishReservationStateChange(
    wishListId: string,
    wishId: string,
    action: StateChangeAction
  ): Observable<FriendWish> {
    const actionString = StateChangeAction[action];
    const uri = `${ApiVersion.v2}/${PublicResourceApiService.REST_END_POINT}/shared-wish-lists/${wishListId}/wish/${wishId}?action=${actionString}`;
    return this.apiService.patch<FriendWish>(uri).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  searchForItems(keywords: string, page: number): Observable<SearchResult> {
    const queryParams = new HttpParams()
      .set('keywords', keywords)
      .set('page', page.toString());
    const uri = `${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/product-search`;
    return this.apiService.get<SearchResult>(uri, queryParams).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
