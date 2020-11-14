import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WishListCreateRequest, WishListUpdateRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { SharedWishListDto, RegisterAndSatisfyWishRequest, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishListApiService {

  private static REST_END_POINT = 'wish-list';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  acceptInvitation(id: number) {
    return this.apiService.patch(`${WishListApiService.REST_END_POINT}/${id}/accept-invitation`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ).toPromise();
  }

  create(wishList: WishListCreateRequest): Observable<WishListDto> {
    return this.apiService.post<WishListDto>(`${WishListApiService.REST_END_POINT}`, wishList).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishLists() : Observable<Array<WishListDto>> {
    return this.apiService.get<Array<WishListDto>>(`wish-list`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishList(id: Number): Observable<WishListDto> {
    return this.apiService.get<WishListDto>(`${WishListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  update(wishList: WishListUpdateRequest): Observable<WishListDto> {
    return this.apiService.put<WishListDto>(`${WishListApiService.REST_END_POINT}/${wishList.id}`, wishList).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  delete(id: Number): Observable<Object> {
    return this.apiService.delete(`${WishListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  removeWish(wish: WishDto): Observable<Object> {
    return this.apiService.delete(`${WishListApiService.REST_END_POINT}/${wish.wishListId}/wish/${wish.id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }


  getLinkForSocialSharing(id: Number): Observable<string> {
    return this.apiService.get<string>(`${WishListApiService.REST_END_POINT}/${id}/create-social-sharing-link`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  // shared wish list 

  getSharedWishList(identifier: string): Observable<SharedWishListDto> {
    const params = new HttpParams().set('identifier', identifier);
    return this.apiService.get<SharedWishListDto>('shared-wish-list', params).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  registerAndSatisfyWish(data: RegisterAndSatisfyWishRequest): Observable<SharedWishListDto> {
    return this.apiService.post<SharedWishListDto>('shared-wish-list', data).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }
}
