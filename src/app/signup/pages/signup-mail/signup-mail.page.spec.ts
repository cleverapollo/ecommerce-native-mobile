import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { IonicModule } from '@ionic/angular';

import { SignupMailPage } from './signup-mail.page';

describe('SignupMailPage', () => {

  let formBuilder: any = {
    group() {  },
    control() {}
  }

  let analyticsService: AnalyticsService;
  let authService: AuthenticationService;
  let loadingService: LoadingService;
  let toastService: CoreToastService;

  let component: SignupMailPage;
  let fixture: ComponentFixture<SignupMailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupMailPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: AuthenticationService, useValue: authService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupMailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
