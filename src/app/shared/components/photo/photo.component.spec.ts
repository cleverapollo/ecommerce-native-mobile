import { BehaviorSubject, of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertService } from '@core/services/alert.service';
import { BackgroundImageDirectiveFake } from '@test/directives/background-image.directive.mock';
import { CoreToastService } from '@core/services/toast.service';
import { IonicModule } from '@ionic/angular';
import { Logger } from '@core/services/log.service';
import { MockAlertService } from '@core/services/alert-mock.service';
import { PhotoComponent } from './photo.component';
import { PlatformService } from '@core/services/platform.service';
import { SecurePipe } from '@shared/pipes/secure.pipe';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

describe('PhotoComponent', () => {
  let component: PhotoComponent;
  let fixture: ComponentFixture<PhotoComponent>;

  let loggerSpy: jasmine.SpyObj<Logger> = jasmine.createSpyObj('Logger', ['error', 'warn', 'debug']);
  let platformServiceSpy: jasmine.SpyObj<PlatformService> = jasmine.createSpyObj('PlatformService', ['isNativePlatform']);
  let toastServiceSpy: jasmine.SpyObj<CoreToastService> = jasmine.createSpyObj('CoreToastService', ['presentErrorToast', 'presentInfoToast']);
  let userService: Partial<UserProfileStore> = { isCreatorAccountActive$: new BehaviorSubject(false) };
  let alertServiceFake = new MockAlertService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoComponent, SecurePipe, BackgroundImageDirectiveFake],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Logger, useValue: loggerSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: CoreToastService, useValue: toastServiceSpy },
        { provide: AlertService, useValue: alertServiceFake },
        { provide: UserProfileStore, useValue: userService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
