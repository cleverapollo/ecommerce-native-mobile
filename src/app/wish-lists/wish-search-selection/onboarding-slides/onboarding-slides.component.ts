import { Component, OnInit } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { LogService } from '@core/services/log.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { UserService } from '@core/services/user.service';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-onboarding-slides',
  templateUrl: './onboarding-slides.component.html',
  styleUrls: ['./onboarding-slides.component.scss'],
})
export class OnboardingSlidesComponent implements OnInit {

  counter: number = 0;

  constructor(
    private modalController: ModalController,
    private storageService: StorageService,
    private userApiService: UserApiService,
    private logger: LogService
  ) { }

  ngOnInit() {}

  countUp() {
    this.counter++;
  }

  countDown() {
    this.counter--;
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
