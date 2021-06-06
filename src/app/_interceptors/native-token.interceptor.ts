import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError, of, Subject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService } from '@core/services/storage.service';
import { LogService } from '@core/services/log.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Injectable()
export class NativeTokenInterceptor implements HttpInterceptor {

    private refreshTokenInProgress = false;

    private tokenRefreshedSource = new Subject();
    private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

    constructor(
        private platform: Platform, 
        private router: Router,
        private authService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const isLoginRequest = request.url.includes('/signin');
        const isSignupRequest = request.url.includes('/signup');
        const isConfirmPasswordReset = request.url.includes('/confirm-password-reset');
        const isGoogleApiRequest = request.url.startsWith('https://identitytoolkit.googleapis.com');
        if (!this.platform.is('capacitor') || isLoginRequest || isGoogleApiRequest || isConfirmPasswordReset || isSignupRequest) {
            return next.handle(request);
        }
        request = this.addAuthToken(request);
        return next.handle(request).pipe(catchError(error => {
            return this.handleResponseError(error, request, next);
        }));
    }

    handleResponseError(error: any, request?: HttpRequest<any>, next?: HttpHandler) {
        // Business error
        if (error.status === 400) {
            // Show message
        }

        // Invalid token error
        else if (error.status === HttpStatusCodes.UNAUTHORIZED) {
            return this.refreshToken().pipe(
                switchMap(() => {
                    request = this.addAuthToken(request);
                    return next.handle(request);
                }),
                catchError(e => {
                    if (e.status !== HttpStatusCodes.UNAUTHORIZED) {
                        return this.handleResponseError(e);
                    } else {
                        this.logout();
                    }
                }));
        }

        // Access denied error
        else if (error.status === HttpStatusCodes.FORBIDDEN) {
            // Show message
            // Logout
            this.logout();
        }

        // Server error
        else if (error.status === 500) {
            // Show message
        }

        // Maintenance error
        else if (error.status === 503) {
            // Show message
            // Redirect to the maintenance page
        }

        return throwError(error);
    }

    private refreshToken(): Observable<any> {
        if (this.refreshTokenInProgress) {
            return new Observable(observer => {
                this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        } else {
            this.refreshTokenInProgress = true;

            return of(this.authService.refreshFirebaseIdToken(true)).pipe(
                tap(() => {
                    this.refreshTokenInProgress = false;
                    this.tokenRefreshedSource.next();
                }),
                catchError(() => {
                    this.refreshTokenInProgress = false;
                    return of(this.logout());
                }));
        }
    }

    private addAuthToken(req: HttpRequest<any>): HttpRequest<any> {
        const token = this.authService.firebaseAccessToken.value;
        if (token) {
            return req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            return req;
        }
    }

    async logout() {
        await this.authService.logout();
        this.router.navigateByUrl('start');
    }
}