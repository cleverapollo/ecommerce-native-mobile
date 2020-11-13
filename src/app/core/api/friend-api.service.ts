import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FriendApiService {

  private static REST_END_POINT = 'friend';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  getWishLists(): Observable<Array<FriendWishList>> {
    return this.apiService.get<Array<FriendWishList>>(`${FriendApiService.REST_END_POINT}/wish-lists`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishListById(id: Number): Observable<FriendWishList> {
    return this.apiService.get<FriendWishList>(`${FriendApiService.REST_END_POINT}/wish-lists/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
