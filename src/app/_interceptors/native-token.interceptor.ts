import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService, StorageKeys } from '@core/services/storage.service';

@Injectable()
export class NativeTokenInterceptor implements HttpInterceptor {
    constructor(private platform: Platform, private storageService: StorageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.platform.is('cordova')) {
            return next.handle(request);
        }

        return from(this.handle(request, next))
    }

    private async handle(req: HttpRequest<any>, next: HttpHandler) {
        try {
            const token = await this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true);
            if (token) {
                const authRequest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                })
                return next.handle(authRequest).toPromise();
            } else {
                return next.handle(req).toPromise();
            }
        } catch(error) {
            return next.handle(req).toPromise();
        }
    }
}