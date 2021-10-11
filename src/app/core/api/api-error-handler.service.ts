import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from '@core/services/log.service';
import { CoreToastService } from '@core/services/toast.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  private generalErrorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';

  constructor(private toastService: CoreToastService,private logger: LogService) { }

  handleError(error: any, getSpecificServerError?: (error: HttpErrorResponse) => string) {
    let errorMessage = this.generalErrorMessage;
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        this.logger.log(`Error: ${error.error.message}`);
      } else {
        this.logger.log(`error status : ${error.status} ${error.statusText}`);
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
