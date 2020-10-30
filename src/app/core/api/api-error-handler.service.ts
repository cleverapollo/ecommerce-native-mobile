import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  private generalErrorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';

  constructor(private toastService: ToastService) { }

  handleError(error: any, getSpecificServerError?: (error: HttpErrorResponse) => string) {
    let errorMessage = this.generalErrorMessage;
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.log(`Error: ${error.error.message}`);
      } else {
        console.log(`error status : ${error.status} ${error.statusText}`);
        if (getSpecificServerError) {
          let specificErrorMessage = getSpecificServerError(error);
          if (specificErrorMessage) {
            errorMessage = specificErrorMessage;
          }
        }
      }
    }
    this.toastService.presentErrorToast(errorMessage);
    return throwError(error);
  }

}
