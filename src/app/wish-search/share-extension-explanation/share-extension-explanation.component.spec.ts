import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { UserApiService } from '@core/api/user-api.service';
import { LogService } from '@core/services/log.service';
import { DefaultPlatformService } from '@core/services/platform.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

import { ShareExtensionExplanationComponent } from './share-extension-explanation.component';

describe('OnboardingSlidesComponent', () => {

  let modalController
  let userApiService
  let logger
  let userProfileStore
  let domSanitzer
  let platformService = {
    get isAndroid(): boolean { return false },
    get isIOS(): boolean { return false }
  }

  let component: ShareExtensionExplanationComponent;
  let fixture: ComponentFixture<ShareExtensionExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareExtensionExplanationComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalController },
        { provide: UserApiService, useValue: userApiService },
        { provide: LogService, useValue: logger },
        { provide: UserProfileStore, useValue: userProfileStore },
        { provide: DomSanitizer, useValue: domSanitzer },
        { provide: DefaultPlatformService, useValue: platformService },
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
