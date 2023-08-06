import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RouterTestingModule } from '@angular/router/testing';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { CreatorComponentFake } from '@test/components/creator.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { creatorMax } from '@test/fixtures/user.fixture';
import { of } from 'rxjs';
import { CreatorDetailPublicPage } from './creator-detail-public.page';

describe('CreatorDetailPublicPage', () => {

  const logger = {};
  let analyticsService: AnalyticsService
  let creatorApi: Partial<ContentCreatorApiService> = {
    getAccountByUserName: () => of(creatorMax)
  }
  let platformService: Partial<PlatformService> = {
    isWeb: false
  }

  let component: CreatorDetailPublicPage;
  let fixture: ComponentFixture<CreatorDetailPublicPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorDetailPublicPage, CreatorComponentFake, NavToolbarComponentFake],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: ContentCreatorApiService, useValue: creatorApi },
        { provide: PlatformService, useValue: platformService },
        { provide: Logger, useValue: logger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorDetailPublicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
