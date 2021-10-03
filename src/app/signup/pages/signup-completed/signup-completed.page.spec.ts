import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonicModule } from '@ionic/angular';

import { SignupCompletedPage } from './signup-completed.page';

describe('SignupCompletedPage', () => {

  let analyticsService: any;

  let component: SignupCompletedPage;
  let fixture: ComponentFixture<SignupCompletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupCompletedPage ],
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
