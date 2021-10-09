import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { UserApiService } from '@core/api/user-api.service';
import { LogService } from '@core/services/log.service';
import { DefaultPlatformService } from '@core/services/platform.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

import { OnboardingSlidesComponent } from './onboarding-slides.component';

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

  let component: OnboardingSlidesComponent;
  let fixture: ComponentFixture<OnboardingSlidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingSlidesComponent ],
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

    fixture = TestBed.createComponent(OnboardingSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
