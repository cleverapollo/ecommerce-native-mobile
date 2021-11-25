import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WishApiService } from '@core/api/wish-api.service';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishDto } from '@core/models/wish-list.model';
import { MockAlertService } from '@core/services/alert-mock.service';
import { AlertService, AppAlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { AppLoadingService, LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStore, WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { CacheModule } from 'ionic-cache';
import { LoggerConfig, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { WishCreateUpdatePage } from './wish-create-update.page';


class MockAuthService {
  isEmailVerified = new BehaviorSubject<boolean>(true)
}

describe('WishCreateUpdatePage', () => {

  let component: WishCreateUpdatePage;
  let fixture: ComponentFixture<WishCreateUpdatePage>;
  const defaultSnapshotData: any = {'wishList': WishListTestData.wishListBirthday};
  let snapshotData: any = defaultSnapshotData;

  const loggerConfig: LoggerConfig = {
    level: NgxLoggerLevel.DEBUG,
  };
  let authService: MockAuthService = new MockAuthService();

  let activatedRoute: any = {snapshot: {data: snapshotData}}; 
  let wishListApiService: WishListApiService;
  let wishApiService: WishApiService;
  let alertService: AppAlertService = new MockAlertService();
  let wishListStore: WishListStore = new MockWishListStoreService();
  let searchResultDataService: SearchResultDataService;
  let loadingService: AppLoadingService = new MockLoadingService();
  let toastService: ToastService = new MockToastService();
  let analyticsService: AnalyticsService = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);

  function configureTestingModule(newSnapshotData: any = defaultSnapshotData) {
    snapshotData = newSnapshotData;
    TestBed.configureTestingModule({
      declarations: [ WishCreateUpdatePage ],
      imports: [
        IonicModule.forRoot(), 
        LoggerModule.forRoot(loggerConfig),
        CacheModule.forRoot({ keyPrefix: 'wantic-unit-test-app-cache' }),
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        HttpClientTestingModule 
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: WishListApiService, useValue: wishListApiService },
        { provide: AlertService, useValue: alertService },
        { provide: WishApiService, useValue: wishApiService },
        { provide: WishListStoreService, useValue: wishListStore },
        { provide: SearchResultDataService, useValue: searchResultDataService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
        { provide: AuthenticationService, useValue: authService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishCreateUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    configureTestingModule();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should create the form with default values', () => {
      configureTestingModule();
      component.ngOnInit();
      const formControls = component.form.controls;

      expect(formControls.wishListId).toBeDefined();
      expect(formControls.wishListId.value).toBe('1');
      expect(formControls.wishListId.hasError('required')).toBeFalsy();

      expect(formControls.name).toBeDefined();
      expect(formControls.name.value).toBe('');
      expect(formControls.name.hasError('required')).toBeTruthy();

      expect(formControls.note).toBeDefined();
      expect(formControls.note.value).toBeNull();
      expect(formControls.note.hasError('required')).toBeFalsy();

      expect(formControls.price).toBeDefined();
      expect(formControls.price.value).toBe('0.00');
      expect(formControls.price.hasError('required')).toBeFalsy();
    });
  });
  
  describe('ionViewDidEnter', () => {

    beforeEach(async(() => {
      configureTestingModule();
    }))

    it('should send the right analytics event (create)', () => {
      component.wish = new WishDto();
      component.ionViewDidEnter();
      expect(analyticsService.setFirebaseScreenName).toHaveBeenCalledWith('wish_add');
    });

    it('should send the right analytics event (update)', () => {
      component.wish = WishListTestData.wishBoschWasher;
      component.ionViewDidEnter();
      expect(analyticsService.setFirebaseScreenName).toHaveBeenCalledWith('wish_settings');
    });

  });

  it('should update form values on form changes', () => {
    configureTestingModule();
    const formControls = component.form.controls;

    expect(formControls.wishListId).toBeDefined();
    expect(formControls.wishListId.value).toBe('1');
    expect(formControls.wishListId.hasError('required')).toBeFalsy();

    component.form.controls.name.setValue('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
    component.form.controls.price.setValue('469.00');

    expect(formControls.name).toBeDefined();
    expect(formControls.name.value).toBe('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
    expect(formControls.name.hasError('required')).toBeFalsy();

    expect(formControls.note).toBeDefined();
    expect(formControls.note.value).toBeNull();
    expect(formControls.note.hasError('required')).toBeFalsy();

    expect(formControls.price).toBeDefined();
    expect(formControls.price.value).toBe('469.00');
    expect(formControls.price.hasError('required')).toBeFalsy();
  })
});
