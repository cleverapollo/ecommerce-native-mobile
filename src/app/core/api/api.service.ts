import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { App } from '@capacitor/app';
import { CapacitorHttp } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { Observable } from 'rxjs';
import { SERVER_URL, appVersion } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private clientInfoHeader?: string;

  constructor(
    private httpClient: HttpClient,
    private nativeHttpClient: HTTP,
    private logger: Logger,
    private platformService: PlatformService) {
    this.initClientInfoHeader();
  }

  private async initClientInfoHeader() {
    this.clientInfoHeader = await this.setupClientInfoHeader();
  }

  post<T>(url: string, body: any): Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  postRaw<T>(url: string, body: any): Observable<HttpResponse<T>> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json',
      observe: 'response'
    });
  }

  put<T>(url: string, body: any): Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.put<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  patch<T>(url: string, body?: any | null): Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.patch<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  delete<T>(url: string): Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.delete<T>(`${SERVER_URL}/${url}`, {
      headers,
      responseType: 'json'
    });
  }

  get<T>(url: string, queryParams?: HttpParams): Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.get<T>(`${SERVER_URL}/${url}`, {
      headers,
      responseType: 'json',
      params: queryParams
    });
  }

  async uploadFile(url: string, formData: FormData, filePath: string, fileName: string): Promise<void> {
    await CapacitorHttp.post({
      url: `${SERVER_URL}/${url}`,
      data: formData,
      headers: {
        Authorization: this.nativeHttpClient.getHeaders(SERVER_URL)['Authorization'],
        'Content-Type': 'multipart/form-data',
        enctype: 'multipart/form-data',
        'Wantic-Client-Info': this.clientInfoHeader
      }
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

  private createDefaultHeaders(): HttpHeaders {
    if (this.clientInfoHeader) {
      return (new HttpHeaders())
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Wantic-Client-Info', this.clientInfoHeader);
    } else {
      return (new HttpHeaders())
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');
    }
  }

  private async setupClientInfoHeader() {
    let platform = 'web';
    let osVersion = '0.0.0';
    let version = appVersion;
    let locale = 'de_DE';

    if (this.platformService.isNativePlatform) {
      const appInfo = await App.getInfo();
      const deviceInfo = await Device.getInfo();
      const languageCode = await Device.getLanguageCode();

      platform = deviceInfo.platform;
      osVersion = deviceInfo.osVersion;
      version = appInfo.version;
      locale = languageCode.value;
    }

    const headerValue = `platform=${platform}; osVersion=${osVersion}; appVersion=${version}; locale=${locale};`
    this.logger.debug(headerValue);
    return headerValue;
  }

}