import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { CoreToastService } from '@core/services/toast.service';
import { BackendConfigType } from '@env/backend-config-type';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.page.html',
  styleUrls: ['./account-delete.page.scss'],
})
export class AccountDeletePage {

  mailToString = 'mailto:support@wantic.io?subject=Wantic%20-%20Account%20l%C3%B6schen'

  get showDeleteButton(): boolean {
    return environment.backendType === BackendConfigType.beta ||
      environment.backendType === BackendConfigType.dev;
  }

  constructor(
    private userApiService: UserApiService,
    private authService: AuthenticationService,
    private navController: NavController,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private logger: LogService,
    private analyticsService: AnalyticsService
  ) { }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-delete_account');
  }

  async deleteAccount() {
    const loadingSpinner = await this.loadingService.createLoadingSpinner();
    await loadingSpinner.present();
    this.userApiService.deleteUser().pipe(first()).subscribe({
      next: () => {
        this.toastService.presentSuccessToast('Dein Account wurde erfolgreich gelöscht!');
        this.authService.logout().finally(() => {
          this.navController.navigateRoot('start', { replaceUrl: true });
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
      },
      complete: () => {
        this.loadingService.dismissLoadingSpinner(loadingSpinner);
      }
    })
  }

}
