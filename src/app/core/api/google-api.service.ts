import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VerifyEmailResponse, VerifyPasswordResetCodeResponse } from '@core/models/google-api.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

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
    return this.httpClient.post<VerifyEmailResponse>(url, { oobCode }, { headers })
  }

  verifyPasswortResetCode(oobCode: string): Observable<VerifyPasswordResetCodeResponse> {
    const headers = (new HttpHeaders())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${environment.firebaseConfig.apiKey}`
    return this.httpClient.post<VerifyPasswordResetCodeResponse>(url, { oobCode }, { headers })
  }

}
