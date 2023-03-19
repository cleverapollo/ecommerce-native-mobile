import { Injectable } from '@angular/core';
import { SearchService } from '@core/api/search.service';
import { SearchResult } from '@core/models/search-result-item';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { SearchQuery, SearchResultDataService, SearchType } from './search-result-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  get $lastUrlSearchQuery(): Observable<SearchQuery> {
    return this.searchResultDataService.$lastSearchQuery.pipe(
      filter(query => query.type === SearchType.URL)
    );
  }

  get $lastAmazonSearchQuery(): Observable<SearchQuery> {
    return this.searchResultDataService.$lastSearchQuery.pipe(
      filter(query => query.type === SearchType.AMAZON_API)
    );
  }


  constructor(
    private searchResultDataService: SearchResultDataService,
    private searchService: SearchService
  ) {
  }

  searchByUrl(url: string): Observable<SearchResult> {
    return this.searchService.searchByUrl(url).pipe(
      first(),
      tap({
        next: searchResult => {
          this.updateResults({
            searchTerm: url,
            type: SearchType.URL,
            results: searchResult.items,
            totalResultCount: searchResult.totalResultCount,
            pageCount: 1
          });
        }
      })
    )
  }

  searchByAmazonApi(keywords: string, page: number): Observable<SearchResult> {
    return this.searchService.searchByAmazon(keywords, page).pipe(
      first(),
      tap({
        next: searchResult => {
          this.updateResults({
            searchTerm: keywords,
            type: SearchType.AMAZON_API,
            results: searchResult.items,
            totalResultCount: searchResult.totalResultCount,
            pageCount: page
          });
        }
      })
    )
  }

  clearResults() {
    this.searchResultDataService.clear();
  }

  updateResults(searchQuery: SearchQuery) {
    this.searchResultDataService.update(searchQuery);
  }

}
