import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WanticError } from '@core/models/error.model';
import { SharedProductList } from '@core/models/product-list.model';
import { SearchResult } from '@core/models/search-result-item';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

enum StateChangeAction {
  RESERVE, CANCEL
}

enum Resource {
  Creator = 'content-creators',
  ProductList = 'product-lists',
  WishList = 'shared-wish-lists'
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
    const uri = `${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/${Resource.WishList}/${wishListId}`;
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
    const uri = `${ApiVersion.v2}/${PublicResourceApiService.REST_END_POINT}/${Resource.WishList}/${wishListId}/wish/${wishId}?action=${actionString}`;
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

  // Product Lists

  getProductList(userName: string, listName: string): Observable<SharedProductList> {
    const uri = `${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/${Resource.Creator}/${userName}/${Resource.ProductList}/${listName}`;
    return this.apiService.get<SharedProductList>(uri).pipe(
      catchError(error => throwError(new WanticError(error)))
    )
  }

  getProductLists(userName: string): Observable<SharedProductList[]> {
    const uri = `${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/${Resource.Creator}/${userName}/${Resource.ProductList}`;
    return this.apiService.get<SharedProductList[]>(uri).pipe(
      catchError(error => throwError(new WanticError(error)))
    )
  }

}
