import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WishApiMockService } from '@core/api/wish-api-mock.service';
import { WishApi, WishApiService } from '@core/api/wish-api.service';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListApiMockService } from '@core/api/wish-list-mock.service';
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
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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
  let router: Router;
  let wishListApiService: WishListApiMockService = new WishListApiMockService();
  let wishApiService: WishApiMockService = new WishApiMockService();
  let alertService: AppAlertService = new MockAlertService();
  let wishListStore: WishListStore = new MockWishListStoreService();
  let searchResultDataService: SearchResultDataService = jasmine.createSpyObj('searchResultDataService', ['clear']);
  let loadingService: AppLoadingService = new MockLoadingService();
  let toastService: ToastService = jasmine.createSpyObj('toastService', ['presentSuccessToast', 'presentErrorToast']);
  let analyticsService: AnalyticsService = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName', 'logAppsflyerEvent', 'logFirebaseEvent']);

  function configureTestingModule(newSnapshotData: any = defaultSnapshotData) {
    snapshotData = newSnapshotData;
    TestBed.configureTestingModule({
      declarations: [ WishCreateUpdatePage ],
      imports: [
        IonicModule.forRoot(), 
        LoggerModule.forRoot(loggerConfig),
        CacheModule.forRoot({ keyPrefix: 'wantic-unit-test-app-cache' }),
        RouterTestingModule,
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

    router = TestBed.inject(Router);
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
  });

  describe('createOrUpdateWish', () => {

    let navigateSpy: jasmine.Spy;
    let showLoadingServiceSpy: jasmine.Spy;
    let dismissLoadingServiceSpy: jasmine.Spy;

    beforeEach(() => {
      configureTestingModule();
      navigateSpy = spyOn(router, 'navigateByUrl');
      showLoadingServiceSpy = spyOn(loadingService, 'showLoadingSpinner');
      dismissLoadingServiceSpy = spyOn(loadingService, 'dismissLoadingSpinner');
    })

    it('should create a wish', fakeAsync(() => {
      // given 
      let wish = new WishDto();
      wish.wishListId = '1';
      component.wish = wish

      wishApiService.createWishResponse = of({
        id: '1234',
        wishListId: '1',
        name: 'BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min',
        price: {
          amount: 469.00,
          currency: '€',
          displayString: '469,00 €'
        },
        productUrl: '',
        imageUrl: ''
      });

      // when

      component.form.controls.name.setValue('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
      component.form.controls.price.setValue('469.00');
      component.createOrUpdateWish();

      tick();

      // then

      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(searchResultDataService.clear).toHaveBeenCalled();
      expect(analyticsService.logAppsflyerEvent).toHaveBeenCalledWith('af_add_to_wishlist', {
        'af_price': 469.00,
        'af_content_id': undefined,
        'af_currency': '€'
      });
      expect(analyticsService.logFirebaseEvent).toHaveBeenCalledWith('add_to_wishlist',{
        'content_id':undefined,
        'value': 469.00,
        'currency': '€'
      });
      expect(toastService.presentSuccessToast).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/secure/home/wish-list/1?forceRefresh=true');
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();

      flush();
    }));

    it('should show user feedback on error when creating a wish', fakeAsync(() => {
      // given
      component.wish = {
        wishListId: '1',
        name: undefined,
        price: undefined,
        productUrl: '',
        imageUrl: ''
      }
      component.form.controls.name.setValue('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
      component.form.controls.price.setValue('469.00');

      wishApiService.createWishResponse = throwError('something went wrong');

      // when
      component.createOrUpdateWish();
      tick();

      // then
      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(toastService.presentErrorToast).toHaveBeenCalled();
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();

      flush();
    }));

    it('should not trigger a request if any required form input is missing', () => {
      const wishApiSpy = spyOn(wishApiService, 'createWish');
      let wish = new WishDto();
      wish.wishListId = '1';
      component.wish = wish;

      // missing name and price

      component.createOrUpdateWish();
      expect(showLoadingServiceSpy).not.toHaveBeenCalled();
      expect(wishApiSpy).not.toHaveBeenCalled();

      // missing price

      wish = new WishDto();
      wish.name = 'BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min';
      component.wish = wish;

      component.createOrUpdateWish();
      expect(showLoadingServiceSpy).not.toHaveBeenCalled();
      expect(wishApiSpy).not.toHaveBeenCalled();

      // missing name

      wish = new WishDto();
      wish.price = {
        amount: 469.00,
        currency: '€',
        displayString: '469,00 €'
      }
      component.wish = wish;

      component.createOrUpdateWish();
      expect(showLoadingServiceSpy).not.toHaveBeenCalled();
      expect(wishApiSpy).not.toHaveBeenCalled();
    })

    it('should update a wish', fakeAsync(() => {
      const wishListStoreSpy = spyOn(wishListStore, 'updateCachedWish');
      // given
  
      component.wish = WishListTestData.wishBoschWasher;

      wishApiService.updateResponse = of({
        id: '1234',
        wishListId: '1',
        name: 'Waschmaschine',
        price: {
          amount: 469.00,
          currency: '€',
          displayString: '469,00 €'
        },
        productUrl: '',
        imageUrl: ''
      })

      // when
      component.form.controls.name.setValue('Waschmaschine');
      component.createOrUpdateWish();
      tick();

      // then
      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(wishListStoreSpy).toHaveBeenCalled();
      expect(toastService.presentSuccessToast).toHaveBeenCalled();
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();

      flush();
    }));

    it('should show user feedback on error when updating a wish', fakeAsync(() => {
      // given
      component.wish = WishListTestData.wishBoschWasher;

      // when
      wishApiService.updateResponse = throwError('an error occured');
      component.form.controls.name.setValue('Waschmaschine');
      component.createOrUpdateWish();
      tick();

      // then
      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(toastService.presentErrorToast).toHaveBeenCalled();
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();

      flush();
    }));
  });

  describe('deleteWish', () => {
    let navigateSpy: jasmine.Spy;
    let showLoadingServiceSpy: jasmine.Spy;
    let dismissLoadingServiceSpy: jasmine.Spy;

    beforeEach(() => {
      configureTestingModule();
      navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      showLoadingServiceSpy = spyOn(loadingService, 'showLoadingSpinner');
      dismissLoadingServiceSpy = spyOn(loadingService, 'dismissLoadingSpinner');
    })

    it('should delete a wish', fakeAsync(() => {
      // given
      component.wish = WishListTestData.wishBoschWasher;
      wishListApiService.removeResponse = of();

      // when
      component.deleteWish();
      tick();

      // then
      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(toastService.presentSuccessToast).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['secure/home/wish-list/1']);
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();

      flush();
    }));
    
    it('should show user feedback on error when deleting a wish', fakeAsync(() => {
      // given
      component.wish = WishListTestData.wishBoschWasher;

      // when
      wishListApiService.removeResponse = throwError('an error occured while deleting a wish');
      component.deleteWish();
      tick();

      // then
      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(toastService.presentErrorToast).toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();
      
      flush();
    }));
  });
});
