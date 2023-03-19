import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService } from '@core/services/toast.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { IonicModule } from '@ionic/angular';

import { WishUpdatePage } from './wish-update.page';

describe('WishUpdatePage', () => {
  let component: WishUpdatePage;
  let fixture: ComponentFixture<WishUpdatePage>;

  const loadingServiceFake = new MockLoadingService();
  const wishListStoreFake = new MockWishListStoreService();
  const toastServiceFake = new MockToastService();
  const searchResultDataServiceSpy = jasmine.createSpyObj<SearchResultDataService>('searchResultDataService', ['clear']);
  const analyticsServiceSpy = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['setFirebaseScreenName']);

  let router: Router;
  const routes: Routes = [];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WishUpdatePage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
        FormsModule, ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: LoadingService, useValue: loadingServiceFake },
        { provide: WishListStoreService, useValue: wishListStoreFake },
        { provide: CoreToastService, useValue: toastServiceFake },
        { provide: SearchResultDataService, useValue: searchResultDataServiceSpy },
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(WishUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
