import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VerifyEmailResponse } from '@core/models/google-api.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private httpClient: HttpClient) { }

  verifyEmail(oobCode: string): Observable<VerifyEmailResponse> {
    const headers = (new HttpHeaders())
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebaseConfig.apiKey}`
    return this.httpClient.post<VerifyEmailResponse>(url, { 
      oobCode: oobCode
    }, {
      headers: headers
    })
  }

}
