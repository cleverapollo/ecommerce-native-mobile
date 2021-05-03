import { Component, OnInit, ViewChild } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { LogService } from '@core/services/log.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-onboarding-slides',
  templateUrl: './onboarding-slides.component.html',
  styleUrls: ['./onboarding-slides.component.scss'],
})
export class OnboardingSlidesComponent implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  showBackButton: boolean = false;
  showCompleteButton: boolean = false;

  constructor(
    private modalController: ModalController,
    private userApiService: UserApiService,
    private logger: LogService,
    private userProfileStore: UserProfileStore
  ) { }

  ngOnInit() {}

  slideNext() {
    this.showBackButton = true;
    this.slides.slideNext();
  }

  slidePrev() {
    this.showCompleteButton = false;
    this.slides.slidePrev();
  }

  onSlideNextEnd() {
    this.showBackButton = true;
  }

  onSlidePrevEnd() {
    this.showCompleteButton = false;
  }

  onSlideReachEnd() {
    this.showCompleteButton = true;
  }

  onSlideReachStart() {
    this.showBackButton = false;
  }

  completeOnboarding() {
    this.userApiService.updateShowOnboardingSlidesIosState(false).pipe(first()).subscribe({
      next: () => {
        this.userProfileStore.removeCachedUserProfile().finally(() => {
          this.modalController.dismiss();
        });
      },
      error: error => {
        this.logger.error(error);
        this.modalController.dismiss();
      }
    })
  }

}
