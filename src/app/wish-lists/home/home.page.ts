import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OnboardingSlidesComponent } from './onboarding-slides/onboarding-slides.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  showOnboardingSlides: boolean;

  constructor(private modalController: ModalController, private route: ActivatedRoute) {}

  ngOnInit() {
    this.showOnboardingSlides = this.route.snapshot.data.showOnboardingSlides;
  }

  ionViewDidEnter() {
    if (this.showOnboardingSlides) {
      this.openOnboardingSlidesModal();
    }
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
