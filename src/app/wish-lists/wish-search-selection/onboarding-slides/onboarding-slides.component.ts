import { Component, OnInit, ViewChild } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { LogService } from '@core/services/log.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { UserService } from '@core/services/user.service';
import { IonSlides, ModalController } from '@ionic/angular';
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
    private storageService: StorageService,
    private userApiService: UserApiService,
    private logger: LogService
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
        this.storageService.set(StorageKeys.SHOW_ONBOARDING_SLIDES, false);
      },
      error: this.logger.error,
      complete: () => {
        this.modalController.dismiss();
      }
    })
  }

}
