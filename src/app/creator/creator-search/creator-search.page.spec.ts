import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { CreatorService } from '@core/services/creator.service';
import { PagingService } from '@core/services/paging.service';
import { IonicModule } from '@ionic/angular';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';

import { CreatorSearchPage } from './creator-search.page';

describe('CreatorSearchPage', () => {
  let component: CreatorSearchPage;
  let fixture: ComponentFixture<CreatorSearchPage>;

  let analyticsService: AnalyticsService;
  let pagingService: PagingService;
  let creatorApiService: ContentCreatorApiService;
  let creatorServiceSpy: jasmine.SpyObj<CreatorService> = jasmine.createSpyObj('CreatorService', ['setSelectedCreator']);
  let router: Router;
  let route: Partial<ActivatedRoute> = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorSearchPage, NavToolbarComponentFake],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: CreatorService, useValue: creatorServiceSpy },
        { provide: PagingService, useValue: pagingService },
        { provide: ContentCreatorApiService, useValue: creatorApiService },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorSearchPage);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(creatorServiceSpy.setSelectedCreator).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
});
