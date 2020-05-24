import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  post(url: string, body: any) : Observable<Object> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.post(`http://127.0.0.1:8080/${url}`, body, {
      headers: headers
    });
  }

  put(url: string, body: any) : Observable<Object> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.put(`http://127.0.0.1:8080/${url}`, body, {
      headers: headers
    });
  }

  patch(url: string) : Observable<Object> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.patch(`http://127.0.0.1:8080/${url}`, {
      headers: headers
    });
  }

  delete(url: string) : Observable<Object> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');

    return this.httpClient.delete(`http://127.0.0.1:8080/${url}`, {
      headers: headers
    });
  }

  get<T>(url: string, queryParams?: HttpParams) : Observable<T> {
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Content-Type', 'application/json')

    return this.httpClient.get<T>(`http://127.0.0.1:8080/${url}`, {
      headers: headers,
      responseType: 'json',
      params: queryParams
    });
  }
}
