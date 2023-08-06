import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { CoreToastService } from '@core/services/toast.service';
import { SecurePipe } from '@shared/pipes/secure.pipe';
import { BackgroundImageDirectiveFake } from '@test/directives/background-image.directive.mock';
import { PhotoComponent } from './photo.component';

describe('PhotoComponent', () => {
  let component: PhotoComponent;
  let fixture: ComponentFixture<PhotoComponent>;

  let loggerSpy: jasmine.SpyObj<Logger> = jasmine.createSpyObj('Logger', ['error', 'warn', 'debug']);
  let platformServiceSpy: jasmine.SpyObj<PlatformService> = jasmine.createSpyObj('PlatformService', ['isNativePlatform']);
  let toastServiceSpy: jasmine.SpyObj<CoreToastService> = jasmine.createSpyObj('CoreToastService', ['presentErrorToast', 'presentInfoToast']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoComponent, SecurePipe, BackgroundImageDirectiveFake],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Logger, useValue: loggerSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: CoreToastService, useValue: toastServiceSpy }
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
