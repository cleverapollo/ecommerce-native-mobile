import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { from, Observable, EMPTY, of } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { map, catchError, finalize } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { LoadingService } from '@core/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private nativeHttpClient: HTTP,
    private platform: Platform,
    private loadingService: LoadingService
  ) {
    this.initNativeHttpClient();
  }

  private initNativeHttpClient() {
    if (this.platform.is('cordova')) {
      this.nativeHttpClient.setHeader('*', 'Accept', 'application/json');
      this.nativeHttpClient.setHeader('*', 'Content-Type', 'application/json');
      this.nativeHttpClient.setDataSerializer('json');
    }
  }

  // POST

  post<T>(url: string, body: any) : Observable<T> {
    if (this.platform.is('cordova')) {
      return this.postNativeHttpClient(url, body);
    } else {
      return this.postHttpClient(url, body);
    }
  }

  private postHttpClient<T>(url: string, body: any) : Observable<T> {
    let headers = new HttpHeaders();
    this.createHttpHeaders(headers);
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers
    });
  }

  private postNativeHttpClient<T>(url: string, body: any) : Observable<T> {
    const request = this.nativeHttpClient.post(`${SERVER_URL}/${url}`, body, {});
    this.loadingService.showLoadingSpinner();
    return this.handleResponse<T>(from(request));
  }

  // PUT

  put<T>(url: string, body: any) : Observable<T> {
    if (this.platform.is('cordova')) {
      return this.putNativeHttpClient(url, body);
    } else {
      return this.putHttpClient(url, body);
    }
  }

  private putHttpClient<T>(url: string, body: any): Observable<T> {
    let headers = new HttpHeaders();
    this.createHttpHeaders(headers);
    return this.httpClient.put<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers
    });
  }

  private putNativeHttpClient<T>(url: string, body: any) : Observable<T> {
    const request = this.nativeHttpClient.put(`${SERVER_URL}/${url}`, body, {});
    this.loadingService.showLoadingSpinner();
    return this.handleResponse<T>(from(request));
  }

  // PATCH

  patch(url: string, body?: any | null) : Observable<Object> {
    if (this.platform.is('cordova')) {
      return this.patchNativeHttpClient(url, body);
    } else {
      return this.patchHttpClient(url, body);
    }
  }

  private patchHttpClient<T>(url: string, body?: any | null): Observable<T> {
    let headers = new HttpHeaders();
    this.createHttpHeaders(headers);
    return this.httpClient.patch<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers
    });
  }

  private patchNativeHttpClient<T>(url: string, body?: any | null) : Observable<T> {
    const request = this.nativeHttpClient.patch(`${SERVER_URL}/${url}`, body, {});
    this.loadingService.showLoadingSpinner();
    return this.handleResponse<T>(from(request));
  }

  // DELETE

  delete(url: string) : Observable<Object> {
    if (this.platform.is('cordova')) {
      return this.deleteNativeHttpClient(url);
    } else {
      return this.deleteHttpClient(url);
    }
  }

  private deleteHttpClient<T>(url: string): Observable<T> {
    let headers = new HttpHeaders();
    this.createHttpHeaders(headers);
    return this.httpClient.delete<T>(`${SERVER_URL}/${url}`, {
      headers: headers
    });
  }

  private deleteNativeHttpClient<T>(url: string) : Observable<T> {
    const request = this.nativeHttpClient.delete(`${SERVER_URL}/${url}`, null, {});
    this.loadingService.showLoadingSpinner();
    return this.handleResponse<T>(from(request));
  }

  // GET

  get<T>(url: string, queryParams?: HttpParams) : Observable<T> {
    if (this.platform.is('cordova')) {
      return this.getNativeHttpClient(url, queryParams);
    } else {
      return this.getHttpClient(url, queryParams);
    }
  }

  private getHttpClient<T>(url: string, queryParams?: HttpParams) : Observable<T> {
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Content-Type', 'application/json')
    return this.httpClient.get<T>(`${SERVER_URL}/${url}`, {
      headers: headers,
      responseType: 'json',
      params: queryParams
    });
  } 

  private getNativeHttpClient<T>(url: string, queryParams?: HttpParams): Observable<T> {
    let urlForRequest = `${SERVER_URL}/${url}`;
    if (queryParams) {
      urlForRequest = `${urlForRequest}?${queryParams.toString()}`;
    }
    console.debug('GET ', urlForRequest);
    let request = this.nativeHttpClient.get(urlForRequest, null, null)
    this.loadingService.showLoadingSpinner();
    return this.handleResponse<T>(from(request));
  }

  // helper

  private createHttpHeaders(headers: HttpHeaders) {
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
  }

  private handleResponse<T>(request: Observable<any>): Observable<T> {
    return request.pipe(
      map(response => this.parseResponseData(response)),
      finalize(() => {
        this.loadingService.dismissLoadingSpinner();
      })
    ) as Observable<T>;
  }

  private parseResponseData<T>(response: HTTPResponse): T {
    console.debug('GET response: ', response);
    if (response.data) {
      return JSON.parse(response.data);
    }
    return null;
  }

}
