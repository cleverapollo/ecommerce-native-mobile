import { Injectable } from '@angular/core';
import { SearchResult, SearchResultItem } from '@core/models/search-result-item';
import { SearchQuery, SearchResultDataService, SearchType } from './search-result-data.service';
import { SearchService } from '@core/api/search.service';
import { WebPageCrawlerService } from './web-page-crawler.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  constructor(
    private searchResultDataService: SearchResultDataService,
    private searchService: SearchService,
    private webPageCrawler: WebPageCrawlerService
  ) {
  }

  searchByUrl(url: string): Observable<SearchResultItem[]> {
    this.searchResultDataService.clear();
    this.webPageCrawler.closeInAppBrowser();
    return this.webPageCrawler.search(url);
  }

  searchByAmazonApi(keywords: string, page: number): Promise<SearchResult> {
    return new Promise((resolve, reject) => {
      this.searchService.searchForItems(keywords, page).toPromise().then( searchResult => {
        const searchQuery = new SearchQuery();
        searchQuery.searchTerm = keywords;
        searchQuery.type = SearchType.AMAZON_API;
        searchQuery.results = searchResult.items;
        searchQuery.totalResultCount = searchResult.totalResultCount;
        searchQuery.pageCount = page;
        this.searchResultDataService.update(searchQuery);
        resolve(searchResult);
      }, reject);
    });
  }

}
