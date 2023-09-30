import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonicModule, NavController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { BehaviorSubject, of } from 'rxjs';

import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { CreatorComponentFake } from '@test/components/creator.component.mock';
import { userMax } from '@test/fixtures/user.fixture';
import { ProductListOverviewPage } from './product-list-overview.page';

describe('ProductListOverviewPage', () => {

  let logger: Logger
  let productListStore: jasmine.SpyObj<ProductListStoreService> = jasmine.createSpyObj('ProductListStoreService', ['getAll']);
  let analyticsService: AnalyticsService
  let navController: NavController
  let loadingService: LoadingService = jasmine.createSpyObj('LoadingService', ['showLoadingSpinner', 'stopLoadingSpinner']);

  let component: ProductListOverviewPage;
  let fixture: ComponentFixture<ProductListOverviewPage>;

  let userProfileStore = {
    loadUserProfile: () => of(new UserProfile()),
    user$: new BehaviorSubject(userMax),
    creatorImage$: new BehaviorSubject(null)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListOverviewPage, NavToolbarComponentFake, CreatorComponentFake],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: UserProfileStore, useValue: userProfileStore },
        { provide: Logger, useValue: logger },
        { provide: ProductListStoreService, useValue: productListStore },
        { provide: NavController, useValue: navController },
        { provide: LoadingService, useValue: loadingService }
      ]
    }).compileComponents();

    productListStore.getAll.and.returnValue(of([]));

    fixture = TestBed.createComponent(ProductListOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
