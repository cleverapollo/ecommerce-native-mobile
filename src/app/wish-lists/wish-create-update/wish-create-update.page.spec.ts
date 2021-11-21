import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WishApiService } from '@core/api/wish-api.service';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { MockAlertService } from '@core/services/alert-mock.service';
import { AlertService, AppAlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { AppLoadingService, LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { IonicModule } from '@ionic/angular';
import { WishCreateUpdatePage } from './wish-create-update.page';


describe('WishNewPage', () => {

  let component: WishCreateUpdatePage;
  let fixture: ComponentFixture<WishCreateUpdatePage>;

  let formBuilder: FormBuilder; 
  let wishListApiService: WishListApiService;
  let wishApiService: WishApiService;
  let alertService: AppAlertService = new MockAlertService();
  let wishListStore: WishListStoreService;
  let searchResultDataService: SearchResultDataService;
  let loadingService: AppLoadingService = new MockLoadingService();
  let toastService: ToastService = new MockToastService();
  let analyticsService: AnalyticsService = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishCreateUpdatePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        FormBuilder,
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: WishListApiService, useValue: wishListApiService },
        { provide: AlertService, useValue: alertService },
        { provide: WishApiService, useValue: wishApiService },
        { provide: WishListStoreService, useValue: wishListStore },
        { provide: SearchResultDataService, useValue: searchResultDataService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishCreateUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
