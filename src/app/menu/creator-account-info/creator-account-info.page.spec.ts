import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonicModule } from '@ionic/angular';

import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { CreatorAccountInfoPage } from './creator-account-info.page';

describe('CreatorAccountInfoPage', () => {
  let component: CreatorAccountInfoPage;
  let fixture: ComponentFixture<CreatorAccountInfoPage>;

  const analyticsService = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorAccountInfoPage, NavToolbarComponentFake],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorAccountInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
