import {
    HttpHandler,
    HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { AuthenticationService } from '@core/services/authentication.service';
import { FirebaseService } from '@core/services/firebase.service';
import { SERVER_URL } from '@env/environment';
import { Observable, Subject, from, lastValueFrom, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class NativeTokenInterceptor implements HttpInterceptor {

    private refreshTokenInProgress = false;

    private tokenRefreshedSource = new Subject<void>();
    private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

    constructor(
        private readonly router: Router,
        private readonly authService: AuthenticationService,
        private readonly firebaseService: FirebaseService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const isLoginRequest = request.url.includes('/signin');
        const isSignupRequest = request.url.includes('/signup');
        const isResetPasswordRequest = request.url.includes('/reset-password');
        const isConfirmPasswordReset = request.url.includes('/confirm-password-reset');
        const isGoogleApiRequest = request.url.startsWith('https://identitytoolkit.googleapis.com');

        if (isLoginRequest || isGoogleApiRequest || isResetPasswordRequest || isConfirmPasswordReset || isSignupRequest) {
            return next.handle(request);
        }
        return from(this.handle(request, next));
    }

    async handle(request: HttpRequest<any>, next: HttpHandler): Promise<any> {
        const authToken = await this.firebaseService.getIdToken(false);
        if (authToken) {
            request = this.addAuthToken(request, authToken);
        }
        return lastValueFrom(next.handle(request).pipe(catchError(error => {
            return this.handleResponseError(error, request, next);
        })));
    }

    handleResponseError(error: any, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Business error
        if (error.status === 400) {
            // Show message
        }

        // Invalid token error
        else if (error.status === HttpStatusCodes.UNAUTHORIZED) {
            return this.refreshToken().pipe(
                switchMap(() => {
                    return from(this.handleRequestAfterTokenRefresh(request, next));
                }),
                catchError(e => {
                    if (e.status !== HttpStatusCodes.UNAUTHORIZED) {
                        return this.handleResponseError(e, request, next);
                    } else {
                        return this.logout();
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

        throwError(() => error);
    }

    async handleRequestAfterTokenRefresh(request: HttpRequest<any>, next: HttpHandler) {
        const authToken = await this.authService.setupFirebaseIdToken(false);
        if (authToken) {
            request = this.addAuthToken(request, authToken);
        }
        return lastValueFrom(next.handle(request));
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

            return of(this.authService.setupFirebaseIdToken(true)).pipe(
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

    private addAuthToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        if (token && request.url.startsWith(SERVER_URL)) {
            return request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            return request;
        }
    }

    async logout() {
        await this.authService.logout();
        return this.router.navigateByUrl('start');
    }
}