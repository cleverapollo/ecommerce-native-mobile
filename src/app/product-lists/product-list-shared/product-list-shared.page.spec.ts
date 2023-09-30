import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { ProductListSharedPage } from './product-list-shared.page';

describe('ProductListSharedPage', () => {

  let route: ActivatedRoute
  let analyticsService: AnalyticsService
  let productListStore: ProductListStoreService
  let loadingService: LoadingService

  let component: ProductListSharedPage;
  let fixture: ComponentFixture<ProductListSharedPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListSharedPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: LoadingService, useValue: loadingService },
        { provide: ProductListStoreService, useValue: productListStore },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListSharedPage);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
