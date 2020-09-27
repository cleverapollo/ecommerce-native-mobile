import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserEventType, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { isArray, isObject } from 'util';
import { SearchResultItem } from '../../shared/features/product-search/search-result-item';
import { LoadingService } from './loading.service';
import { HttpClient } from '@angular/common/http';
import { SearchResultDataService } from './search-result-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  private searchResults: SearchResultItem[] = [];

  constructor(
    private http: HttpClient,
    private inAppBrowser: InAppBrowser, 
    private loadingService: LoadingService,
    private searchResultDataService: SearchResultDataService
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
      this.searchResultDataService.updateSearchTerm(url);
      this.searchResultDataService.update(this.searchResults);
      return Promise.resolve(results)
    } catch(e) {
      return Promise.reject(e);
    }
  }

  private async getCodeToExecute(url) {
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

  private mapSearchResultArray(results: [any], url: string) {
    results.forEach(result => {
      if (isObject(result) && result.hasOwnProperty('name') && result.hasOwnProperty('imageUrl')) {
        this.searchResults.push(new SearchResultItem(result.name, result.imageUrl, result.productUrl ? result.productUrl : url, result.price));
      } else if (isArray(result)) {
        this.mapSearchResultArray(result as [any], url);
      }
    });
  }

}
