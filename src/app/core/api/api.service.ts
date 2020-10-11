import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient, 
    private nativeHttpClient: HTTP,
    private platform: Platform
    ) { }

  post<T>(url: string, body: any) : Observable<T> {
    if (this.platform.is('cordova')) {
      return this.postNativeHttpClient(url, body);
    } else {
      return this.postHttpClient(url, body);
    }
  }

  private postHttpClient<T>(url: string, body: any) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers
    });

  }

  private postNativeHttpClient<T>(url: string, body: any) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return from(this.nativeHttpClient.post(`${SERVER_URL}/${url}`, body, {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    })).pipe(map( response => response.data));
  }

  put<T>(url: string, body: any) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.put<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers
    });
  }

  patch(url: string, body?: any | null) : Observable<Object> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.patch(`${SERVER_URL}/${url}`, body, {
      headers: headers
    });
  }

  delete(url: string) : Observable<Object> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.delete(`${SERVER_URL}/${url}`, {
      headers: headers
    });
  }

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
    let params = {};
    queryParams.keys().forEach( (key) => {
      params[key] = queryParams.get(key);
    });

    const headers = {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
    return from(this.nativeHttpClient.get(url, params, headers)).pipe(
      map((response) => response.data)
    ) 
  }
}
