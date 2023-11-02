import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { iife } from '@shared/helpers/common.helper';
import { finalize, first, lastValueFrom } from 'rxjs';
import { TabBarRoute, getTaBarPath } from 'src/app/tab-bar/tab-bar-routes';


@Component({
  selector: 'app-creator-account-delete',
  templateUrl: './creator-account-delete.page.html'
})
export class CreatorAccountDeletePage {

  constructor(
    private readonly creatorApi: ContentCreatorApiService,
    private readonly toastService: CoreToastService,
    private readonly analyticsService: AnalyticsService,
    private readonly loadingService: LoadingService,
    private readonly router: Router,
    private readonly userStore: UserProfileStore,
    private readonly alertService: AlertService
  ) { }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-creator-delete_account');
  }

  async deleteAccount(): Promise<void> {
    (await this.alertService.createDeleteAlert(
      'Creator Account löschen',
      'Möchtest du dein Konto wirklich löschen?',
      async () => {
        await this.loadingService.showLoadingSpinner();
        this.creatorApi.deleteAccount().pipe(
          first(),
          finalize(() => iife(this.loadingService.stopLoadingSpinner()))
        ).subscribe({
          next: _ => iife(this.onSuccess()),
          error: _ => iife(this.toastService.presentErrorToast('Beim Löschen deines Profils ist ein Fehler aufgetreten.'))
        })
      }
    )).present();
  }

  private async onSuccess(): Promise<void> {
    await this.toastService.presentSuccessToast('Dein Creator Profil wurde erfolgreich gelöscht');
    await this.userStore.toggleIsCreatorAccountActive();
    await lastValueFrom(this.userStore.loadUserProfile(true));
    await this.router.navigateByUrl(getTaBarPath(TabBarRoute.MENU, true));
  }
}
