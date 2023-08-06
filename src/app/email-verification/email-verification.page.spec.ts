import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonicModule } from '@ionic/angular';

import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { EmailVerificationPage } from './email-verification.page';

describe('EmailVerificationPage', () => {

  const analyticsService: any = {};

  let component: EmailVerificationPage;
  let fixture: ComponentFixture<EmailVerificationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmailVerificationPage, NavToolbarComponentFake],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
