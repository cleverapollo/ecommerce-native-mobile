import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService } from '@core/services/toast.service';
import { ProductListCreatePage } from './product-list-create.page';

describe('ProductListCreatePage', () => {

  let analyticsService: AnalyticsService
  let navController: NavController
  let loadingService: LoadingService
  let productListStore: ProductListStoreService
  let toastService = new MockToastService();
  let router: Router

  let component: ProductListCreatePage;
  let fixture: ComponentFixture<ProductListCreatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListCreatePage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule
      ],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: NavController, useValue: navController },
        { provide: LoadingService, useValue: loadingService },
        { provide: ProductListStoreService, useValue: productListStore },
        { provide: CoreToastService, useValue: toastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListCreatePage);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
