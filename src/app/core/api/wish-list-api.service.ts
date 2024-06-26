import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { WishListDto, WishDto, WishListCreateRequest, WishListUpdateRequest } from '@core/models/wish-list.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { ApiVersion } from './api-version';

export interface WishListApi {
  acceptInvitation(id: string): Promise<void>;
  create(wishList: WishListCreateRequest): Observable<WishListDto>;
  getWishLists() : Observable<Array<WishListDto>>;
  getWishList(id: string): Observable<WishListDto>;
  update(wishList: WishListUpdateRequest): Observable<WishListDto>;
  delete(id: string): Observable<object>;
  removeWish(wish: WishDto): Observable<object>;
}
@Injectable({
  providedIn: 'root'
})
export class WishListApiService implements WishListApi {

  private static REST_END_POINT = 'wish-lists';

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
    return this.apiService.get<Array<WishListDto>>(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}`).pipe(
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

  delete(id: string): Observable<any> {
    return this.apiService.delete(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  removeWish(wish: WishDto): Observable<any> {
    return this.apiService.delete(`${ApiVersion.v1}/${WishListApiService.REST_END_POINT}/${wish.wishListId}/wishes/${wish.id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
