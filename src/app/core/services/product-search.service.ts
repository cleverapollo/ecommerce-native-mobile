import { Injectable } from '@angular/core';
import { SearchService } from '@core/api/search.service';
import { SearchResult } from '@core/models/search-result-item';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { SearchQuery, SearchResultDataService, SearchType } from './search-result-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  constructor(
    private searchResultDataService: SearchResultDataService,
    private searchService: SearchService
  ) {
  }

  searchByAmazonApi(keywords: string, page: number): Observable<SearchResult> {
    return this.searchService.searchForItems(keywords, page).pipe(
      first(),
      tap({
        next: searchResult => {
          const searchQuery = new SearchQuery();
          searchQuery.searchTerm = keywords;
          searchQuery.type = SearchType.AMAZON_API;
          searchQuery.results = searchResult.items;
          searchQuery.totalResultCount = searchResult.totalResultCount;
          searchQuery.pageCount = page;
          this.searchResultDataService.update(searchQuery);
        }
      })
    )
  }

}
