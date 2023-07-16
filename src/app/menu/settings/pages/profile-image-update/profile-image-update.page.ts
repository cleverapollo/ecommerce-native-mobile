import { Component, OnInit } from '@angular/core';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { FileChangeEvent } from '@shared/components/photo/photo.component';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-image-update',
  templateUrl: './profile-image-update.page.html',
  styleUrls: ['./profile-image-update.page.scss'],
})
export class ProfileImageUpdatePage implements OnInit {

  user: UserProfile;
  image$ = new BehaviorSubject<Blob | null>(null);
  fileName: string;

  constructor(
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private userStore: UserProfileStore
  ) { }

  ngOnInit() {
    this.fileName = this.userStore.isCreatorAccountActive$.value ?
      'creator_photo' :
      'user_photo';
    this._initUser();
  }

  ionViewDidEnter() {
    const screenName = this.userStore.isCreatorAccountActive$.value ?
      'profile_settings-creator-image' :
      'profile_settings-image';
    this.analyticsService.setFirebaseScreenName(screenName);
  }

  async onFileChanged(event: FileChangeEvent): Promise<void> {
    try {
      await this.loadingService.showLoadingSpinner();
      this.userStore.isCreatorAccountActive$.value ?
        await this.userStore.updateCreatorImage(event.formData, event.filePath, event.fileName) :
        await this.userStore.updateUserImage(event.formData, event.filePath, event.fileName);
      await this.loadingService.stopLoadingSpinner();
      return this.toastService.presentSuccessToast('Dein Bild wurde erfolgreich aktualisiert.')
    } catch (error) {
      await this.loadingService.stopLoadingSpinner();
      return this.toastService.presentErrorToast('Dein Bild konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.')
    }
  }

  onFileDelete(): void {
    const request = this.userStore.isCreatorAccountActive$.value ?
      this.userStore.deleteCreatorImage() :
      this.userStore.deleteUserImage();
    this._handleRequest(
      request,
      'Dein Bild wurde erfolgreich gelöscht.',
      'Dein Bild konnte nicht gelöscht werden. Bitte versuche es später noch einmal.'
    );
  }

  private async _handleRequest(request: Observable<void>, successMessage: string, errorMessage: string) {
    await this.loadingService.showLoadingSpinner();
    request.subscribe({
      next: _ => {
        this.loadingService.stopLoadingSpinner()
          .then(() => this.toastService.presentSuccessToast(successMessage));
      },
      error: _ => {
        this.loadingService.stopLoadingSpinner()
          .then(() => this.toastService.presentErrorToast(errorMessage));
      }
    })
  }

  private _initUser() {
    const user$ = this.userStore.user$.pipe(filter((user): user is UserProfile => !!user));
    const isCreatorAccountActive$ = this.userStore.isCreatorAccountActive$;
    combineLatest([user$, isCreatorAccountActive$]).pipe(
      map(result => ({ user: result[0], isCreatorAccountActive: result[1] }))
    ).subscribe({
      next: value => {
        this.user = value.user;
        value.isCreatorAccountActive ?
          this._updatePhoto(this.user.creatorAccount.hasImage, this.userStore.downloadCreatorImage()) :
          this._updatePhoto(this.user.hasImage, this.userStore.downloadUserImage());
      }
    });
  }

  private _updatePhoto(hasImage: boolean, request: Observable<any>) {
    if (hasImage) {
      request.subscribe({
        next: blob => this.image$.next(blob)
      })
    } else {
      this.image$.next(null);
    }
  }

}
