import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserApiService } from '@core/api/user-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { ToastService } from '@core/services/toast.service';
import { IonicModule } from '@ionic/angular';

import { SignupMailTwoPage } from './signup-mail-two.page';

describe('SignupMailTwoPage', () => {

  let formBuilder: any = {
    group() {  },
    control() {}
  }

  let logger: LogService;
  let analyticsService: AnalyticsService;
  let loadingService: LoadingService;
  let toastService: ToastService;
  let userApiService: UserApiService;
  let authService: AuthenticationService;
  let privacyPolicyService: PrivacyPolicyService;

  let component: SignupMailTwoPage;
  let fixture: ComponentFixture<SignupMailTwoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupMailTwoPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: LogService, useValue: logger },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: LoadingService, useValue: loadingService },
        { provide: ToastService, useValue: toastService },
        { provide: UserApiService, useValue: userApiService },
        { provide: AuthenticationService, useValue: authService },
        { provide: PrivacyPolicyService, useValue: privacyPolicyService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupMailTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
