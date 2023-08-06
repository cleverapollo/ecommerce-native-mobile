import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserApiService } from '@core/api/user-api.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { ASSETS_IMAGES_PATH } from '@core/ui.constants';
import { IonSlides, ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

class WanticSlideItem {
  imgSrc: string;
  imgAlt: string;
  description: SafeHtml
}

@Component({
  selector: 'app-share-extension-explanation',
  templateUrl: './share-extension-explanation.component.html',
  styleUrls: ['./share-extension-explanation.component.scss'],
})
export class ShareExtensionExplanationComponent {

  @ViewChild(IonSlides) slides: IonSlides;

  showBackButton = false;
  showCompleteButton = false;

  get slidesItems(): Array<WanticSlideItem> {
    let items = [];
    if (this.platformService.isAndroid) {
      items = this.androidSlides;
    } else if (this.platformService.isIOS) {
      items = this.iOSSlides;
    }
    return items;
  };

  constructor(
    private modalController: ModalController,
    private userApiService: UserApiService,
    private logger: Logger,
    private userProfileStore: UserProfileStore,
    private domSanitzer: DomSanitizer,
    public platformService: PlatformService
  ) { }

  private get androidSlides(): WanticSlideItem[] {
    return [
      {
        imgSrc: `${ASSETS_IMAGES_PATH}/onboarding-slide-android-1.png`,
        imgAlt: 'Onboarding Slide 1', // ToDo: improve description
        description: this.domSanitzer.bypassSecurityTrustHtml(`Springe in deinen Browser und
          füge Wünsche aus deinem liebsten
          Onlineshop über dieses Icon <ion-icon color="primary" name="ellipsis-vertical-outline"></ion-icon> hinzu.`)
      },
      {
        imgSrc: `${ASSETS_IMAGES_PATH}/onboarding-slide-android-2.png`,
        imgAlt: 'Onboarding Slide 2', // ToDo: improve description
        description: this.domSanitzer.bypassSecurityTrustHtml(`Drücke dann auf Teilen <ion-icon color="primary" name="share-social-outline"></ion-icon>,
          um unsere App auf deinem
          Smartphone auswählen zu können.`)
      },
      {
        imgSrc: `${ASSETS_IMAGES_PATH}/onboarding-slide-android-3.png`,
        imgAlt: 'Onboarding Slide 3', // ToDo: improve description
        description: this.domSanitzer.bypassSecurityTrustHtml(`Gehe in deinem App-Menü bis ganz nach
          rechts & wähle unter &bdquo;Mehr&ldquo; wantic aus. `)
      },
      {
        imgSrc: `${ASSETS_IMAGES_PATH}/onboarding-slide-android-4.png`,
        imgAlt: 'Onboarding Slide 4', // ToDo: improve description
        description: this.domSanitzer.bypassSecurityTrustHtml(`Klicke auf das Wantic-Symbol & speichere deinen Wunsch auf deiner Wunschliste.`)
      },
    ];
  }

  private get iOSSlides(): WanticSlideItem[] {
    return [
      {
        imgSrc: `${ASSETS_IMAGES_PATH}/onboarding-slide-1.png`,
        imgAlt: 'Onboarding Slide 1', // ToDo: improve description
        description: this.domSanitzer.bypassSecurityTrustHtml(`Springe in deinen Browser und <br>
        füge Wünsche aus deinem liebsten <br>
        Onlineshop über dieses Icon <ion-icon class="share-icon" name="share-outline"></ion-icon> hinzu.`)
      },
      {
        imgSrc: `${ASSETS_IMAGES_PATH}/onboarding-slide-2.png`,
        imgAlt: 'Onboarding Slide 2', // ToDo: improve description
        description: this.domSanitzer.bypassSecurityTrustHtml(`Wische bei den App-Favoriten nach rechts <br>
        und füge unter "Mehr" Wantic hinzu.<br><br>`)
      },
      {
        imgSrc: `${ASSETS_IMAGES_PATH}/onboarding-slide-3.png`,
        imgAlt: 'Onboarding Slide 3', // ToDo: improve description
        description: this.domSanitzer.bypassSecurityTrustHtml(`Klicke auf das Wantic-Symbol und füge<br>
        deinen Wunsch zu deiner Liste hinzu.<br><br>`)
      },
    ]
  }

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
    const request = this.getRequest();
    if (request === null) {
      return;
    }

    request.pipe(first()).subscribe({
      next: () => {
        this.userProfileStore.clearUserProfile().finally(() => {
          this.modalController.dismiss();
        });
      },
      error: error => {
        this.logger.error(error);
        this.modalController.dismiss();
      }
    })
  }

  private getRequest(): Observable<void> {
    let request: Observable<void> = null;
    if (this.platformService.isIOS) {
      request = this.userApiService.updateShowOnboardingSlidesIosState(false);
    } else if (this.platformService.isAndroid) {
      request = this.userApiService.updateShowOnboardingSlidesAndroidState(false);
    } else {
      this.logger.error(`platform ${this.platformService} is not supported.`);
    }
    return request;
  }
}
