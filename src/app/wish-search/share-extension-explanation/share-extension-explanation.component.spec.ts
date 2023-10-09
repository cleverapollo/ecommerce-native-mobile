import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { UserApiService } from '@core/api/user-api.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShareExtensionExplanationComponent } from './share-extension-explanation.component';

describe('OnboardingSlidesComponent', () => {

  const modalController = {};
  const userApiService = {};
  const logger = {};
  const userProfileStore = {};
  const domSanitzer = {};
  const platformService = {
    get isAndroid(): boolean { return false },
    get isIOS(): boolean { return false }
  }

  let component: ShareExtensionExplanationComponent;
  let fixture: ComponentFixture<ShareExtensionExplanationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ShareExtensionExplanationComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalController },
        { provide: UserApiService, useValue: userApiService },
        { provide: Logger, useValue: logger },
        { provide: UserProfileStore, useValue: userProfileStore },
        { provide: DomSanitizer, useValue: domSanitzer },
        { provide: PlatformService, useValue: platformService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareExtensionExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
