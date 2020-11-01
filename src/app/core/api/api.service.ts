import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  post<T>(url: string, body: any) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.post<T>(`${SERVER_URL}/${url}`, body, {
      headers: headers
    });
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

  patch<T>(url: string, body?: any | null) : Observable<T> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.patch<T>(`${SERVER_URL}/${url}`, body, {
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

  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')

    return this.httpClient.get(url, {
      headers: headers,
      responseType: 'blob'
    });
  }
}