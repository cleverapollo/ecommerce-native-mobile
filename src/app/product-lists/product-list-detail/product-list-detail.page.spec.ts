import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ProductListDetailPage } from './product-list-detail.page';

describe('ProductListDetailPage', () => {

  let analyticsService: AnalyticsService;
  let userStore: UserProfileStore;
  let logger: Logger;
  let productListStore: ProductListStoreService;
  let loadingService: LoadingService;

  let router: Router;
  let route: ActivatedRoute;

  let component: ProductListDetailPage;
  let fixture: ComponentFixture<ProductListDetailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListDetailPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: Logger, useValue: logger },
        { provide: LoadingService, useValue: loadingService },
        { provide: ProductListStoreService, useValue: productListStore },
        { provide: UserProfileStore, useValue: userStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListDetailPage);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
