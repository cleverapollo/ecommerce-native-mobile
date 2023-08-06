import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { PlatformService } from '@core/services/platform.service';
import { Observable } from 'rxjs';
import { SERVER_URL, appVersion } from 'src/environments/environment';

const MIME_TYPE_JSON = 'application/json';
const CLIENT_INFO = `platform=web; osVersion=0.0.0; appVersion=${appVersion}; locale=de_DE;`;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private clientInfoHeader = CLIENT_INFO;

  constructor(
    private httpClient: HttpClient,
    private platformService: PlatformService) {
    this.initClientInfoHeader();
  }

  private async initClientInfoHeader() {
    this.clientInfoHeader = await this._setupClientInfoHeader();
  }

  post<T>(url: string, body: any): Observable<T> {
    const headers = this._createDefaultHeaders();
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  postRaw<T>(url: string, body: any): Observable<HttpResponse<T>> {
    const headers = this._createDefaultHeaders();
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json',
      observe: 'response'
    });
  }

  put<T>(url: string, body: any): Observable<T> {
    const headers = this._createDefaultHeaders();
    return this.httpClient.put<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  patch<T>(url: string, body?: any | null): Observable<T> {
    const headers = this._createDefaultHeaders();
    return this.httpClient.patch<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  delete<T>(url: string): Observable<T> {
    const headers = this._createDefaultHeaders();
    return this.httpClient.delete<T>(`${SERVER_URL}/${url}`, {
      headers,
      responseType: 'json'
    });
  }

  get<T>(url: string, queryParams?: HttpParams): Observable<T> {
    const headers = this._createDefaultHeaders();
    return this.httpClient.get<T>(`${SERVER_URL}/${url}`, {
      headers,
      responseType: 'json',
      params: queryParams
    });
  }

  uploadFile<T>(url: string, file: ArrayBuffer): Observable<T> {
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, file, {
      headers: new HttpHeaders({
        'Content-Type': 'image/jpeg',
        'Wantic-Client-Info': this.clientInfoHeader
      })
    });
  }

  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Wantic-Client-Info': this.clientInfoHeader
    });
    return this.httpClient.get(`${SERVER_URL}/${url}`, {
      headers,
      responseType: 'blob'
    });
  }

  private _createDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': MIME_TYPE_JSON,
      'Content-Type': MIME_TYPE_JSON,
      'Wantic-Client-Info': this.clientInfoHeader
    });
  }

  private async _setupClientInfoHeader(): Promise<string> {
    if (this.platformService.isNativePlatform) {
      const { version } = await App.getInfo();
      const { platform, osVersion } = await Device.getInfo();
      const { value } = await Device.getLanguageCode();
      return `platform=${platform}; osVersion=${osVersion}; appVersion=${version}; locale=${value};`;
    }
    return CLIENT_INFO;
  }

}