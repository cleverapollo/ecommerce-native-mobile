import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding-slides',
  templateUrl: './onboarding-slides.component.html',
  styleUrls: ['./onboarding-slides.component.scss'],
})
export class OnboardingSlidesComponent implements OnInit {

  counter: number = 0;

  constructor(
    private modalController: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {}

  countUp() {
    this.counter++;
  }

  countDown() {
    this.counter--;
  }

  completeOnboarding() {
    this.userService.updateShowOnboardingSlidesState().then(() => {
      this.modalController.dismiss();
    })
  }

}
