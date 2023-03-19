import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SearchResult } from '../models/search-result-item';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiVersion } from './api-version';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static REST_END_POINT = 'searches';

  constructor(
    private readonly apiService: ApiService,
    private readonly errorHandler: ApiErrorHandlerService
  ) { }

  searchByAmazon(keywords: string, page: number): Observable<SearchResult> {
    const queryParams = new HttpParams()
      .set('keywords', keywords)
      .set('page', page.toString())
    return this.apiService.get<SearchResult>(`${ApiVersion.v1}/${SearchService.REST_END_POINT}/amazon`, queryParams).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  searchByUrl(url: string): Observable<SearchResult> {
    const queryParams = new HttpParams()
      .set('url', url);
    return this.apiService.get<SearchResult>(`${ApiVersion.v1}/${SearchService.REST_END_POINT}/url`, queryParams).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }
}
