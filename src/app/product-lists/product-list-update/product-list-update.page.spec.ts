import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { CoreToastService } from '@core/services/toast.service';
import { ProductListUpdatePage } from './product-list-update.page';

describe('ProductListUpdatePage', () => {

  let route: ActivatedRoute
  let router: Router
  let analyticsService: AnalyticsService
  let alertService: AlertService
  let loadingService: LoadingService
  let productListStore: ProductListStoreService
  let toastService: CoreToastService

  let component: ProductListUpdatePage;
  let fixture: ComponentFixture<ProductListUpdatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListUpdatePage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule
      ],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: AlertService, useValue: alertService },
        { provide: LoadingService, useValue: loadingService },
        { provide: ProductListStoreService, useValue: productListStore },
        { provide: CoreToastService, useValue: toastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListUpdatePage);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
