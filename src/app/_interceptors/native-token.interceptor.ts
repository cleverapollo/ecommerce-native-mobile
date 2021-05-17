import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, from, NEVER, throwError } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService, StorageKeys } from '@core/services/storage.service';
import { LogService } from '@core/services/log.service';
import { catchError } from 'rxjs/operators';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Injectable()
export class NativeTokenInterceptor implements HttpInterceptor {
    constructor(
        private platform: Platform, 
        private router: Router,
        private authService: AuthenticationService,
        private storageService: StorageService, 
        private logger: LogService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.platform.is('capacitor')) {
            return next.handle(request);
        }

        return from(this.handle(request, next))
    }

    private async handle(req: HttpRequest<any>, next: HttpHandler) {
        const isLoginRequest = req.url.includes('/login');
        try {
            this.logger.log('NativeTokenInterceptor');
            const token = await this.storageService.get<string>(StorageKeys.FIREBASE_ID_TOKEN, true);
            if (token) {
                const authRequest = this.addAuthToken(req, token)
                return next.handle(authRequest).pipe(catchError( error => {
                    this.logger.debug('catched error ', error);
                    if (!isLoginRequest && (error.status === HttpStatusCodes.UNAUTHORIZED || error.status === HttpStatusCodes.FORBIDDEN)) {
                        return from(new Promise<never>((resolve) => {
                             this.authService.getIdToken(true)
                             .then(idToken => {
                                const authRequest = this.addAuthToken(req, idToken);
                                next.handle(authRequest)
                             })
                             .catch(() => this.router.navigateByUrl('/login') )
                             .finally(() => resolve(NEVER.toPromise()) )
                         })); 
                     } else {
                         return throwError(error);
                     }
                })).toPromise();
            } else {
                return next.handle(req).toPromise();
            }
        } catch(error) {
            return next.handle(req).toPromise();
        }
    }

    private addAuthToken(req: HttpRequest<any>, token: string) {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}