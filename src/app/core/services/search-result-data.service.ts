import { Injectable } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject } from 'rxjs';

export enum SearchType {
  AMAZON_API, URL
}
export class SearchQuery {
  results: SearchResultItem[] = [];
  searchTerm = '';
  type: SearchType = SearchType.AMAZON_API;
  pageCount = 1;
  totalResultCount = 0;
}

@Injectable({
  providedIn: 'root'
})
export class SearchResultDataService {

  private readonly CACHE_KEY = 'lastSearchQuery';

  private _lastSearchQuery: BehaviorSubject<SearchQuery> = new BehaviorSubject(new SearchQuery());
  $lastSearchQuery = this._lastSearchQuery.asObservable();

  constructor(private cache: CacheService) {
    this.cache.itemExists(this.CACHE_KEY).then( exists => {
      if (exists) {
        this.cache.getItem(this.CACHE_KEY).then(( query => {
          this.update(query);
        }));
      }
    });
  }

  update(searchQuery: SearchQuery) {
    this._lastSearchQuery.next(searchQuery);
    this.cache.saveItem(this.CACHE_KEY, searchQuery, null, 60 * 60);
  }

  clear() {
    this._lastSearchQuery.next(new SearchQuery());
    this.cache.removeItem(this.CACHE_KEY);
  }

}
