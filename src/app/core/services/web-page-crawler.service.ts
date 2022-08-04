import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { FileService } from './file.service';
import { LogService } from './log.service';
import { DefaultPlatformService } from './platform.service';
import { SearchQuery, SearchResultDataService, SearchType } from './search-result-data.service';

@Injectable({
  providedIn: 'root'
})
export class WebPageCrawlerService {

  private result$: Observable<SearchResultItem[]>;
  private _result$: BehaviorSubject<SearchResultItem[]> = new BehaviorSubject([]);

  private browser: InAppBrowserObject;
  private url: string;
  private webCrawlerScriptContent: string = null;
  private webCrawlerScriptLoading = false;
  private loadingComplete = false;

  constructor(
    private logger: LogService,
    private http: HttpClient,
    private inAppBrowser: InAppBrowser,
    private searchResultDataService: SearchResultDataService,
    private platformService: DefaultPlatformService,
    private fileService: FileService
  ) {
    this._result$ =  new BehaviorSubject([]);
    this.result$ = this._result$.asObservable();
  }

  search(url: string): Observable<SearchResultItem[]> {
    this.loadingComplete = false;
    this.url = url;
    this.browser = this.inAppBrowser.create(url, '_blank', { location: 'yes', clearcache: 'yes', toolbar: 'no', hidden: 'yes' });
    this.browser.on('loadstart')?.subscribe(event => {
      this.onLoadStart();
    }, this.handleGeneralError);
    this.browser.on('exit')?.subscribe(event => {
      this.onBrowserExit();
    }, this.handleGeneralError);
    this.browser.on('loadstop')?.subscribe(event => {
      this.onLoadComplete(url)
    }, this.handleGeneralError);
    this.browser.on('loaderror')?.subscribe(event => {
      this.onLoadError();
    });
    this.browser.on('message')?.subscribe(event => {
      this.onMessageReceived(event);
    }, this.handleGeneralError);
    return this.result$;
  }

  private async onLoadComplete(url: string) {
    if (this.loadingComplete) { return }
    this.loadingComplete = true;
    this.logger.log('loading finished ...');
    try {
      const code = await this.getCode();
      const webPageCrawlerResult = await this.iabResolveExecuteScript(code);
      this.logger.log('web crawler result ...', webPageCrawlerResult);

      this.mapSearchResultArray(webPageCrawlerResult[0], url);
      this.updateSearchQuery(this._result$.value);
    } catch (error) {
      this.handleGeneralError(error);
    }
  }

  private async getCode() {
    let code = this.webCrawlerScriptContent;
    if (code === null) {
      code = await this.loadWebCrawlerScriptContent();
    }
    return code;
  }

  private async loadWebCrawlerScriptContent(): Promise<string> {
    const fileName = 'parse-imgs-from-website.js';
    const subDir = 'scripts';
    if (this.webCrawlerScriptLoading) { return; }
    this.webCrawlerScriptLoading = true;
    if (this.platformService.isNativePlatform) {
      const content = await this.fileService.getTextContentFromFileInAssetFolder(fileName, subDir);
      this.webCrawlerScriptContent = content;
    } else {
      const content = await this.http.get(`${window.location.origin}/assets/${subDir}/${fileName}`, { responseType: 'text' }).toPromise();
      this.webCrawlerScriptContent = content;
    }
    this.webCrawlerScriptLoading = false;
    return this.webCrawlerScriptContent;
  }


  private iabResolveExecuteScript(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.log('execute script ...');
      this.browser.executeScript({ code }).then((result) => {
        resolve(result);
      }, e => {
        this.logger.error(e);
        reject();
      });
    });
  }

  private updateSearchQuery(results: SearchResultItem[]) {
    const searchQuery = new SearchQuery();
    searchQuery.searchTerm = this.url;
    searchQuery.type = SearchType.URL;
    searchQuery.results = results;
    this.searchResultDataService.update(searchQuery);
  }

  private onLoadError() {
    this.logger.log('loading error');
    this.loadingComplete = true;
  }

  private async onLoadStart() {
    this.logger.log('start loading ...');

  }

  private onBrowserExit() {
    this.logger.log('exit browser ...');
    this.loadingComplete = true;
  }

  private onMessageReceived(event: InAppBrowserEvent) {
    this.logger.log('message recieved ...', event);
    if (typeof event.data === 'string') {
      this.logger.log(event.data);
    } else if (typeof event.data === 'object') {
      const item = event.data;
      this.mapSearchResultItem(item);
    }
  }

  private handleGeneralError(error) {
    this.logger.log('general error ...', error);
  }

  private mapSearchResultArray(results: any[], url: string) {
    results.forEach(result => {
      this.mapSearchResultItem(result, url);
    });
  }

  private mapSearchResultItem(result: any, url?: string) {
    if (result !== null && typeof result === 'object' && result.hasOwnProperty('name') && result.hasOwnProperty('imageUrl')) {
      const item = new SearchResultItem(
        result.asin,
        result.name,
        result.imageUrl,
        result.productUrl ? result.productUrl : url,
        result.price,
        result.id
      );
      this.addItem(item);
    } else if (Array.isArray(result)) {
      this.mapSearchResultArray(result as any[], url);
    }
  }

  private addItem(item: SearchResultItem) {
    const items = this._result$.value;
    if (!items.some(i => i.id === item.id)) {
      this._result$.value.push(item);
      this._result$.next(this._result$.value);
      this.updateSearchQuery(this._result$.value);
    }
  }

  closeInAppBrowser() {
    this._result$.next([]);
    if (this.browser) {
      this.browser.close();
    }
  }


}
