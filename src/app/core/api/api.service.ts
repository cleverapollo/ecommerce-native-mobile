import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';
import { LogService } from '@core/services/log.service';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private clientInfoHeader?: string;

  constructor(private httpClient: HttpClient, private logger: LogService) { 
    this.initClientInfoHeader();
  }

  private async initClientInfoHeader() {
    const clientInfoHeader = await this.createClientInfoHeader();
    this.clientInfoHeader = clientInfoHeader;
  }

  post<T>(url: string, body: any) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  put<T>(url: string, body: any) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.put<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  patch<T>(url: string, body?: any | null) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.patch<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  delete<T>(url: string) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.delete<T>(`${SERVER_URL}/${url}`, {
      headers: headers,
      responseType: 'json'
    });
  }

  get<T>(url: string, queryParams?: HttpParams) : Observable<T> {
    const headers = this.createDefaultHeaders();
    return this.httpClient.get<T>(`${SERVER_URL}/${url}`, {
      headers: headers,
      responseType: 'json',
      params: queryParams
    });
  }

  uploadFile<T>(url: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'multipart/form-data');

    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, formData, {
      headers: headers,
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

  private async createClientInfoHeader() {
    const deviceInfo = await Device.getInfo();
    const languageCode = (await Device.getLanguageCode()).value;
    return `platform=${deviceInfo.platform}; osVersion=${deviceInfo.osVersion}; appVersion=${deviceInfo.appVersion}; locale=${languageCode};`;
  }

}