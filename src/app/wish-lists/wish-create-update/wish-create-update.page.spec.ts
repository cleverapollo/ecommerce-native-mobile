import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WishDto } from '@core/models/wish-list.model';
import { MockAlertService } from '@core/services/alert-mock.service';
import { AlertService, AppAlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { AppLoadingService, LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStore, WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { CacheModule } from 'ionic-cache';
import { LoggerConfig, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { WishCreateUpdatePage } from './wish-create-update.page';


class MockAuthService {
  isEmailVerified = new BehaviorSubject<boolean>(true)
}

describe('WishCreateUpdatePage', () => {

  let component: WishCreateUpdatePage;
  let fixture: ComponentFixture<WishCreateUpdatePage>;
  const defaultSnapshotData: any = {wishList: WishListTestData.wishListBirthday};
  let snapshotData: any = defaultSnapshotData;

  const loggerConfig: LoggerConfig = {
    level: NgxLoggerLevel.DEBUG,
  };
  const authService: MockAuthService = new MockAuthService();

  const activatedRoute: any = {snapshot: {data: snapshotData}};
  let router: Router;
  const alertService: AppAlertService = new MockAlertService();
  const wishListStore: WishListStore = new MockWishListStoreService();
  const searchResultDataService: SearchResultDataService = jasmine.createSpyObj('searchResultDataService', ['clear']);
  const loadingService: AppLoadingService = new MockLoadingService();
  const toastService: ToastService = jasmine.createSpyObj('toastService', ['presentSuccessToast', 'presentErrorToast']);
  const analyticsService: AnalyticsService = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName', 'logAppsflyerEvent', 'logFirebaseEvent']);

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
        { provide: AlertService, useValue: alertService },
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
      expect(formControls.name.valid).toBeFalsy();
      expect(formControls.name.hasError('required')).toBeTruthy();

      expect(formControls.note).toBeDefined();
      expect(formControls.note.value).toBeNull();
      expect(formControls.note.hasError('required')).toBeFalsy();

      expect(formControls.price).toBeDefined();
      expect(formControls.price.value).toBe('0.00');
      expect(formControls.price.hasError('required')).toBeFalsy();

      expect(formControls.isFavorite).toBeDefined();
      expect(formControls.isFavorite.value).toBeFalsy();
      expect(formControls.isFavorite.valid).toBeTruthy();
    });
  });

  describe('ionViewDidEnter', () => {

    beforeEach(waitForAsync(() => {
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
    expect(formControls.wishListId.valid).toBeTruthy();

    component.form.controls.name.setValue('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
    component.form.controls.price.setValue('469.00');
    component.form.controls.isFavorite.setValue(true);

    expect(formControls.name).toBeDefined();
    expect(formControls.name.value).toBe('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
    expect(formControls.name.valid).toBeTruthy();

    expect(formControls.note).toBeDefined();
    expect(formControls.note.value).toBeNull();
    expect(formControls.note.valid).toBeTruthy();

    expect(formControls.price).toBeDefined();
    expect(formControls.price.value).toBe('469.00');
    expect(formControls.price.valid).toBeTruthy();

    expect(formControls.isFavorite).toBeDefined();
    expect(formControls.isFavorite.value).toBeTruthy();
    expect(formControls.isFavorite.valid).toBeTruthy();
  });

  describe('createOrUpdateWish', () => {

    let navigateSpy: jasmine.Spy;
    let showLoadingServiceSpy: jasmine.Spy;
    let dismissLoadingServiceSpy: jasmine.Spy;

    beforeEach(() => {
      configureTestingModule();
      navigateSpy = spyOn(router, 'navigateByUrl');
      showLoadingServiceSpy = spyOn(loadingService, 'showLoadingSpinner');
      dismissLoadingServiceSpy = spyOn(loadingService, 'stopLoadingSpinner');
    })

    it('should create a wish', fakeAsync(() => {
      // given
      const wish = new WishDto();
      wish.wishListId = '1';
      component.wish = wish

      spyOn(wishListStore, 'createWish').and.returnValue(of({
        id: '1234',
        wishListId: '1',
        name: 'BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min',
        price: {
          amount: 469.00,
          currency: '€',
          displayString: '469,00 €'
        },
        productUrl: '',
        imageUrl: '',
        isFavorite: false
      }));

      // when

      component.form.controls.name.setValue('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
      component.form.controls.price.setValue('469.00');
      component.createOrUpdateWish();

      tick();

      // then

      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(searchResultDataService.clear).toHaveBeenCalled();
      expect(analyticsService.logAppsflyerEvent).toHaveBeenCalledWith('af_add_to_wishlist', {
        af_price: 469.00,
        af_content_id: undefined,
        af_currency: '€'
      });
      expect(analyticsService.logFirebaseEvent).toHaveBeenCalledWith('add_to_wishlist',{
        content_id: undefined,
        value: 469.00,
        currency: '€'
      });
      expect(toastService.presentSuccessToast).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/secure/home/wish-list/1?forceRefresh=true');
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();

      flush();
    }));

    it('shows user feedback on error when creating a wish', fakeAsync(() => {
      // given
      component.wish = {
        wishListId: '1',
        name: undefined,
        price: undefined,
        productUrl: '',
        imageUrl: '',
        isFavorite: false
      }
      component.form.controls.name.setValue('BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min');
      component.form.controls.price.setValue('469.00');

      spyOn(wishListStore, 'createWish').and.returnValue(throwError('something went wrong'));

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
      const wishApiSpy = spyOn(wishListStore, 'createWish');
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

    it('updates a wish', fakeAsync(() => {
      // given
      component.wish = WishListTestData.wishBoschWasher;

      const wishListStoreSpy = spyOn(wishListStore, 'updateWish').and.returnValue(of({
        id: '1234',
        wishListId: '1',
        name: 'Waschmaschine',
        price: {
          amount: 469.00,
          currency: '€',
          displayString: '469,00 €'
        },
        productUrl: '',
        imageUrl: '',
        isFavorite: false
      }));

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

    it('shows user feedback on error when updating a wish', fakeAsync(() => {
      // given
      component.wish = WishListTestData.wishBoschWasher;

      // when
      spyOn(wishListStore, 'updateWish').and.returnValue(throwError('an error occured'));
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
      dismissLoadingServiceSpy = spyOn(loadingService, 'stopLoadingSpinner');
    })

    // ToDo: Check how we can test this
    xit('deletes a wish', waitForAsync(() => {
      component.wish = WishListTestData.wishBoschWasher;
      component.deleteWish();

      expect(showLoadingServiceSpy).toHaveBeenCalled();
      expect(toastService.presentSuccessToast).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['secure/home/wish-list/1']);
      expect(dismissLoadingServiceSpy).toHaveBeenCalled();
    }));

    it('shows user feedback on error when deleting a wish', fakeAsync(() => {
      // given
      component.wish = WishListTestData.wishBoschWasher;

      // when
      spyOn(wishListStore, 'removeWish').and.returnValue(throwError('an error occured while deleting a wish'));
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
