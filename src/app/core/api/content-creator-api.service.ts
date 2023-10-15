import { Injectable } from '@angular/core';
import { ContentCreatorAccount, NewCreator, SocialMediaLinks } from '@core/models/content-creator.model';
import { WanticError } from '@core/models/error.model';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ContentCreatorApiService {

  private static REST_END_POINT = 'content-creators';
  private static PUBLIC_REST_END_POINT = 'public/content-creators';

  constructor(private apiService: ApiService) { }

  createAccount(data: NewCreator): Observable<string> {
    return this.apiService.postRaw<void>(`${ApiVersion.v1}/${ContentCreatorApiService.REST_END_POINT}`, data).pipe(
      catchError(error => throwError(() => new WanticError(error))),
      map(response => response.headers.get('Location'))
    );
  }

  getAccountByUserName(userName: string): Observable<ContentCreatorAccount> {
    return this.apiService.get<ContentCreatorAccount>(`${ApiVersion.v1}/${ContentCreatorApiService.PUBLIC_REST_END_POINT}/${userName}/`).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  searchForAccounts(searchTerm: string): Observable<ContentCreatorAccount[]> {
    return this.apiService.get<ContentCreatorAccount[]>(`${ApiVersion.v1}/${ContentCreatorApiService.PUBLIC_REST_END_POINT}?searchTerm=${searchTerm}`).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  updateName(name: string): Observable<ContentCreatorAccount> {
    return this.apiService.patch<ContentCreatorAccount>(this._buildUrl('name'), { name }).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  updateUserName(newUserName: string): Observable<ContentCreatorAccount> {
    return this.apiService.patch<ContentCreatorAccount>(this._buildUrl('user-name'), { userName: newUserName }).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  updateDescription(description: string): Observable<ContentCreatorAccount> {
    return this.apiService.patch<ContentCreatorAccount>(this._buildUrl('description'), { description }).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  updateSocialMediaLinks(socialMediaLinks: SocialMediaLinks): Observable<ContentCreatorAccount> {
    return this.apiService.patch<ContentCreatorAccount>(this._buildUrl('social-media-links'), socialMediaLinks).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  getImage(): Observable<Blob> {
    return this.apiService.downloadFile(this._buildUrl('image')).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  getImageByUserName(userName: string): Observable<Blob> {
    return this.apiService.downloadFile(this._buildPublicUrl(userName, 'image')).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  async updateImage(file: ArrayBuffer): Promise<void> {
    try {
      return await lastValueFrom(this.apiService.uploadFile<void>(this._buildUrl('image'), file));
    } catch (error) {
      throw new WanticError(error);
    }
  }

  deleteImage(): Observable<ContentCreatorAccount> {
    return this.apiService.delete<ContentCreatorAccount>(this._buildUrl('image')).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  private _buildPublicUrl(userName: string, resource: string): string {
    return `${ApiVersion.v1}/${ContentCreatorApiService.PUBLIC_REST_END_POINT}/${userName}/${resource}`;
  }

  private _buildUrl(resource: string): string {
    return `${ApiVersion.v1}/${ContentCreatorApiService.REST_END_POINT}/${resource}`;
  }

}
