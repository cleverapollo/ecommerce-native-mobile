import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonicModule } from '@ionic/angular';

import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { SignupCompletedPage } from './signup-completed.page';

describe('SignupCompletedPage', () => {

  const analyticsService: any = {};

  let component: SignupCompletedPage;
  let fixture: ComponentFixture<SignupCompletedPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignupCompletedPage, NavToolbarComponentFake],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
