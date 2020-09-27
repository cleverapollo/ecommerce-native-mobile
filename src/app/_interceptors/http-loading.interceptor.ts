import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';
import { retryWhen, delay, tap, catchError, finalize, map } from 'rxjs/operators';
import { LoadingService } from '../shared/services/loading.service';

@Injectable()
export class HttpRequestLoadingInterceptor implements HttpInterceptor {

    private static MAX_RETRY_COUNT = 3;
    private static RETRY_DELAY = 1000;

    constructor(private loadingService: LoadingService, 
        private toastController: ToastController,
        private alertController: AlertController) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingService.showLoadingSpinner();
        return next.handle(request).pipe( 
            retryWhen(err => {
                let retries = 1;
                return err.pipe(
                    delay(HttpRequestLoadingInterceptor.RETRY_DELAY),
                    tap(() => {
                        this.showRetryToast(retries);
                    }),
                    map(error => {
                        if (retries++ === HttpRequestLoadingInterceptor.MAX_RETRY_COUNT) {
                            throw error;
                        } 
                        return error;
                    })
                )
            }),
            catchError(err => {
                console.log(err);
                this.showPresentFailedAlert('present failed');
                return EMPTY;
            }),
            finalize(() => {
                this.loadingService.dismissLoadingSpinner();
            })
        );
    }

    async showRetryToast(retryCount) {
        const toast = await this.toastController.create({
            message: `Retry: ${retryCount}/${HttpRequestLoadingInterceptor.MAX_RETRY_COUNT}`,
            duration: HttpRequestLoadingInterceptor.RETRY_DELAY
        });
        toast.present();
    }

    async showPresentFailedAlert(msg) {
        const alert = await this.alertController.create({
            header: 'Technischer Fehler',
            message: 'Deine Aktion konnte aufgrund eines technischen Fehlers nicht abgeschlossen werden.',
            buttons: ['OK']
        });
        alert.present();
    }

}