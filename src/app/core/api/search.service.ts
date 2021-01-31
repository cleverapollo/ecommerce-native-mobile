import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SearchResult } from '../models/search-result-item';
import { Observable } from 'rxjs';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static REST_END_POINT = 'search';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  searchForItems(keywords: string, page: number): Observable<SearchResult> {
    let queryParams = new HttpParams()
      .set('keywords', keywords)
      .set('page', page.toString())
    return this.apiService.get<SearchResult>(`${SearchService.REST_END_POINT}`, queryParams).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }
}
