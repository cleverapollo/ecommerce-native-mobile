import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResult } from '@core/models/search-result-item';
import { FriendWishList, RegisterUserAndReserveWishRequest } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PublicResourceApiService {

  private static REST_END_POINT = 'public';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  getSharedWishList(identifier: string): Observable<FriendWishList> {
    const params = new HttpParams().set('identifier', identifier);
    return this.apiService.get<FriendWishList>(`${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/shared-wish-lists`, params).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  registerUserAndReserveWish(data: RegisterUserAndReserveWishRequest): Observable<FriendWishList> {
    return this.apiService.post<FriendWishList>(`${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/shared-wish-lists`, data).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  toggleWishReservation(wishListId: string, wishId: string): Observable<FriendWishList> {
    return this.apiService.patch<FriendWishList>(`${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/shared-wish-lists/${wishListId}/wish/${wishId}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  searchForItems(keywords: string, page: number): Observable<SearchResult> {
    let queryParams = new HttpParams()
      .set('keywords', keywords)
      .set('page', page.toString())
    return this.apiService.get<SearchResult>(`${ApiVersion.v1}/${PublicResourceApiService.REST_END_POINT}/product-search`, queryParams).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
