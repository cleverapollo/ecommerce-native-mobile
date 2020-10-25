import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { isArray, isObject } from 'util';
import { SearchResultItem } from '@core/models/search-result-item';
import { LoadingService } from './loading.service';
import { HttpClient } from '@angular/common/http';
import { SearchQuery, SearchResultDataService, SearchType } from './search-result-data.service';
import { SearchService } from '@core/api/search.service';
import { from, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  private searchResults: SearchResultItem[] = [];

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private inAppBrowser: InAppBrowser, 
    private loadingService: LoadingService,
    private searchResultDataService: SearchResultDataService,
    private searchService: SearchService
  ) { }

  async searchByUrl(url: string): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
      const browser = this.inAppBrowser.create(url, '_blank', { location: 'no', clearcache: 'yes', toolbar: 'no', hidden: 'yes' });
      browser.on('loadstart').subscribe(event => {
        this.onLoadStart();
      }); 
      browser.on('exit').subscribe(event => {
        this.onBrowserExit();
      });
      browser.on('loadstop').subscribe(event => {
        console.log('loading finished ...');
        this.onLoadComplete(browser, url).then(results => {
          resolve(results);
        }, reject);
      }, console.error);
      browser.on('loaderror').subscribe(event => {
        this.onLoadError();
        reject();
      });
    });
  }

  private async onLoadComplete(browser: InAppBrowserObject, url) {
    try {
      const code = await (await this.getCodeToExecute(url)).toPromise();
      const results: [any] = await browser.executeScript({ code: code });
      console.log('result after execution', results);
      this.searchResults = [];
      this.mapSearchResultArray(results, url);

      const searchQuery = new SearchQuery();
      searchQuery.searchTerm = url;
      searchQuery.type = SearchType.URL;
      searchQuery.results = this.searchResults;
      this.searchResultDataService.update(searchQuery);

      return Promise.resolve(results)
    } catch(e) {
      return Promise.reject(e);
    }
  }

  private async getCodeToExecute(url) {
    if (this.platform.is('cordova')) {
      return from(this.scriptParseImgsFromWebsite.toString()); 
    }
    return this.http.get(this.scriptFilePath(url), { responseType: 'text' });
  }

  private onLoadError() {
    console.log('loading error');
    this.loadingService.dismissLoadingSpinner();
  }

  private onLoadStart() {
    console.log('start loading ...');
    this.loadingService.showLoadingSpinner();
  }

  private onBrowserExit() {
    console.log('exit browser ...');
    this.loadingService.dismissLoadingSpinner();
  }

  private scriptFilePath(url: string) {
    let assetPath = './assets/scripts';
    if (url.indexOf('otto.de') !== -1) {
      console.log(assetPath);
      return `${assetPath}/parse-articles-from-otto.js`;
    } else {
      return `${assetPath}/parse-imgs-from-website.js`;
    }
  }

  private scriptParseImgsFromWebsite() {
    Array.from(document.getElementsByTagName('img')).map(x => {
      if (x.src) {
        return { name: x.alt, imageUrl: x.src };
      } else if (x.srcset) {
        return { name: x.alt, imageUrl: x.srcset.split(',')[0] };
      }
      return { name: '', imageUrl: '' };
    }).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith('http'));
  }

  private mapSearchResultArray(results: [any], url: string) {
    results.forEach(result => {
      if (isObject(result) && result.hasOwnProperty('name') && result.hasOwnProperty('imageUrl')) {
        this.searchResults.push(new SearchResultItem(result.name, result.imageUrl, result.productUrl ? result.productUrl : url, result.price));
      } else if (isArray(result)) {
        this.mapSearchResultArray(result as [any], url);
      }
    });
  }

  searchByAmazonApi(keywords: string): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
      this.searchService.searchForItems(keywords).toPromise().then( results => {
        const searchQuery = new SearchQuery();
        searchQuery.searchTerm = keywords;
        searchQuery.type = SearchType.AMAZON_API;
        searchQuery.results = results;
        this.searchResultDataService.update(searchQuery);
        resolve(results);
      }, reject);
    });
  }

}
