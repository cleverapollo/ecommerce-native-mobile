import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WishListCreateRequest, WishListUpdateRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { FriendWishList, RegisterAndSatisfyWishRequest } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { ApiVersion } from './api-version';

@Injectable({
  providedIn: 'root'
})
export class WishListApiService {

  private static REST_END_POINT = 'wish-list';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  acceptInvitation(id: string): Promise<void> {
    return this.apiService.patch<void>(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}/${id}/accept-invitation`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ).toPromise();
  }

  create(wishList: WishListCreateRequest): Observable<WishListDto> {
    return this.apiService.post<WishListDto>(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}`, wishList).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishLists() : Observable<Array<WishListDto>> {
    return this.apiService.get<Array<WishListDto>>(`${ApiVersion.v1}/wish-list`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishList(id: string): Observable<WishListDto> {
    return this.apiService.get<WishListDto>(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  update(wishList: WishListUpdateRequest): Observable<WishListDto> {
    return this.apiService.put<WishListDto>(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}/${wishList.id}`, wishList).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  delete(id: string): Observable<Object> {
    return this.apiService.delete(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  removeWish(wish: WishDto): Observable<Object> {
    return this.apiService.delete(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}/${wish.wishListId}/wish/${wish.id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // shared wish list 

  getSharedWishList(identifier: string): Observable<FriendWishList> {
    const params = new HttpParams().set('identifier', identifier);
    return this.apiService.get<FriendWishList>(`${ApiVersion.v1}/shared-wish-list`, params).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  registerUserAndReserveWish(data: RegisterAndSatisfyWishRequest): Observable<FriendWishList> {
    return this.apiService.post<FriendWishList>(`${ApiVersion.v1}/shared-wish-list`, data).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  toggleWishReservation(wishListId: string, wishId: string, email: string): Observable<FriendWishList> {
    return this.apiService.patch<FriendWishList>(`${ApiVersion.v1}/shared-wish-list/${wishListId}/wish/${wishId}?userEmail=${email}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }
}
