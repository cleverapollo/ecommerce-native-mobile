import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserApiService } from '@core/api/user-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { CoreToastService } from '@core/services/toast.service';
import { IonicModule } from '@ionic/angular';

import { SignupMailTwoPage } from './signup-mail-two.page';

describe('SignupMailTwoPage', () => {

  const formBuilder: any = {
    group() {  },
    control() {}
  }

  const logger: any = {};
  const analyticsService: any = {};
  const loadingService: any = {};
  const toastService: any = {};
  const userApiService: any = {};
  const authService: any = {};
  const privacyPolicyService: any = {};

  let component: SignupMailTwoPage;
  let fixture: ComponentFixture<SignupMailTwoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupMailTwoPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: LogService, useValue: logger },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
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
