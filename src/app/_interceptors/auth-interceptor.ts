import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { from, NEVER, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { HttpStatusCodes } from '@core/models/http-status-codes';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isLoginRequest = request.url.includes('/login');

        return next.handle(request).pipe(catchError( error => {
            if (!isLoginRequest && (error.status === HttpStatusCodes.UNAUTHORIZED || error.status === HttpStatusCodes.FORBIDDEN)) {
               return from(new Promise<never>((resolve) => {
                    this.authService.getIdToken(true)
                    .then(() => next.handle(request))
                    .catch(() => this.router.navigateByUrl('/login') )
                    .finally(() => resolve(NEVER.toPromise()) )
                })); 
            } else {
                return throwError(error);
            }
        }));
    }

}