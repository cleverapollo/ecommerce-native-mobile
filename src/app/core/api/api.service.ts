import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appVersion, SERVER_URL } from 'src/environments/environment';
import { Logger } from '@core/services/log.service';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { DefaultPlatformService } from '@core/services/platform.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private clientInfoHeader?: string;

  constructor(
    private httpClient: HttpClient,
    private logger: Logger,
    private platformService: DefaultPlatformService) {
    this.initClientInfoHeader();
  }

  private async initClientInfoHeader() {
    this.clientInfoHeader = await this.setupClientInfoHeader();
  }

  post<T>(url: string, body: any) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  put<T>(url: string, body: any) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.put<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  patch<T>(url: string, body?: any | null) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.patch<T>(`${SERVER_URL}/${url}`, body, {
      headers,
      responseType: 'json'
    });
  }

  delete<T>(url: string) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.delete<T>(`${SERVER_URL}/${url}`, {
      headers,
      responseType: 'json'
    });
  }

  get<T>(url: string, queryParams?: HttpParams) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.get<T>(`${SERVER_URL}/${url}`, {
      headers,
      responseType: 'json',
      params: queryParams
    });
  }

  uploadFile<T>(url: string, formData: FormData) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'multipart/form-data');

    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, formData, {
      headers,
      responseType: 'json'
    });
  }

  downloadFile(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
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
    let platform = 'unknown';
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
    } else {
      platform = 'web';
    }

    const headerValue = `platform=${platform}; osVersion=${osVersion}; appVersion=${version}; locale=${locale};`
    this.logger.debug(headerValue);
    return headerValue;
  }

}