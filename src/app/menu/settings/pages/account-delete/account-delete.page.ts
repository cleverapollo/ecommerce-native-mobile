import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '@core/api/user-api.service';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { DeleteAccountRequest } from '@core/models/user.model';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { ToastService } from '@core/services/toast.service';
import { NavController } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.page.html',
  styleUrls: ['./account-delete.page.scss'],
})
export class AccountDeletePage implements OnInit, OnDestroy {

  form: FormGroup;

  subscription: Subscription;

  get validationMessages(): ValidationMessages {
    return {
      password: [
        new ValidationMessage('required', 'Gib bitte dein Passwort an.')
      ]
    }
  }

  constructor(
    private userApiService: UserApiService, 
    private authService: AuthenticationService,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private logger: LogService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteAccount() {
    const requestBody = new DeleteAccountRequest(this.form.controls);
    this.loadingService.showLoadingSpinner();
    this.subscription = this.userApiService.deleteUser(requestBody).subscribe({
      next: () => {
        this.toastService.presentSuccessToast('Dein Account wurde erfolgreich gelöscht!');
        this.loadingService.dismissLoadingSpinner();
        this.authService.logout().finally(() => {
          this.navController.navigateRoot('start');
        });
      },
      error: errorResponse => {
        let errorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';
        if (errorResponse instanceof HttpErrorResponse) {
          if (errorResponse.error instanceof ErrorEvent) {
            this.logger.log(`Error: ${errorResponse.error.message}`);
          } else if (errorResponse.status === HttpStatusCodes.BAD_REQUEST) {
            errorMessage = 'Dein Passwort ist nicht korrekt.';
          }
        }
        this.toastService.presentErrorToast(errorMessage);
        this.loadingService.dismissLoadingSpinner();
      }
    })
  }

}
