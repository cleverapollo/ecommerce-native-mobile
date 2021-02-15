import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { ModalController } from '@ionic/angular';
import { OnboardingSlidesComponent } from './onboarding-slides/onboarding-slides.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private modalController: ModalController, 
    private userService: UserService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.userService.showOnboardingSlides.then(show => {
      if (show) {
        this.openOnboardingSlidesModal();
      }
    });
  }

  private async openOnboardingSlidesModal() {
    const modal = await this.modalController.create({
      component: OnboardingSlidesComponent,
      cssClass: 'wantic-modal wantic-modal-large',
      backdropDismiss: false
    });
    modal.present();
  }

}
