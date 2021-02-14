import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';
import { LogService } from '@core/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private logger: LogService) { }

  post<T>(url: string, body: any) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    this.logger.log(`${SERVER_URL}/${url}`);
    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  put<T>(url: string, body: any) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.put<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  patch<T>(url: string, body?: any | null) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.patch<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  delete<T>(url: string, body?: any | null) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.request<T>('delete', `${SERVER_URL}/${url}`, {
      headers: headers,
      body: body,
      responseType: 'json'
    });
  }

  get<T>(url: string, queryParams?: HttpParams) : Observable<T> {
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

  uploadFile<T>(url: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'multipart/form-data');

    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, formData, {
      headers: headers,
      responseType: 'json'
    });
  }

  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')

    return this.httpClient.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }
}