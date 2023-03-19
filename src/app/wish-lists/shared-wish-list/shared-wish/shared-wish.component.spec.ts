import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { PublicResourceApiMockService } from '@core/api/public-resource-api-mock-service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { BrowserService } from '@core/services/browser.service';
import { MockStorageService } from '@core/services/storage-mock.service';
import { StorageService } from '@core/services/storage.service';
import { CoreToastService } from '@core/services/toast.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { WishListTestDataUtils } from '@core/test/wish-list-data.utils';
import { IonicModule, ModalController } from '@ionic/angular';

import { SharedWishComponent, SharedWishListState } from './shared-wish.component';

describe('SharedWishComponent', () => {
  let component: SharedWishComponent;
  let fixture: ComponentFixture<SharedWishComponent>;

  const browserService: any = jasmine.createSpyObj('browserService', ['openInAppBrowser']);
  const modalController: any = {};
  let storageService: MockStorageService = new MockStorageService();
  let publicResourceApiService: PublicResourceApiMockService = new PublicResourceApiMockService();
  const toastServiceSpy = jasmine.createSpyObj('toastService', ['presentSuccessToast', 'presentErrorToast']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SharedWishComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: CoreToastService, useValue: toastServiceSpy },
        { provide: PublicResourceApiService, useValue: publicResourceApiService },
        { provide: ModalController, useValue: modalController },
        { provide: BrowserService, useValue: browserService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SharedWishComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    component.wish = WishListTestData.sharedWishBoschWasher;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should init with the correct values for wish bosch washer', () => {
    component.wish = WishListTestData.sharedWishBoschWasher;
    fixture.detectChanges();
    expect(component.isCancellable).toBeFalsy();
    expect(component.isReservable).toBeTruthy();
    expect(component.isStateChangeable).toBeTruthy();
    expect(component.cssClassWishReservedState).toBeNull();
    expect(component.state).toBe(SharedWishListState.RESERVABLE);
  });

  it('should init with the correct values for wish amazon kindle (reserved by friend)', fakeAsync(() => {
    component.wish = WishListTestData.sharedWishKindle;
    storageService.getResult = null;

    fixture.detectChanges();
    tick();

    expect(component.isCancellable).toBeFalsy();
    expect(component.isReservable).toBeFalsy();
    expect(component.isStateChangeable).toBeFalsy();
    expect(component.cssClassWishReservedState).toBe('wish-reserved');
    expect(component.state).toBe(SharedWishListState.RESERVED);

    flush();
  }));

  it('should init with the correct values for wish amazon kindle (reserved by himself)', fakeAsync(() => {
    component.wish = WishListTestData.sharedWishKindle;
    storageService.getResult = true;

    fixture.detectChanges();
    tick(3000);

    expect(component.isCancellable).toBeTruthy();
    expect(component.isReservable).toBeFalsy();
    expect(component.isStateChangeable).toBeTruthy();
    expect(component.isLoading).toBeFalsy();
    expect(component.cssClassWishReservedState).toBe('wish-bought');
    expect(component.state).toBe(SharedWishListState.CANCELLABLE);

    flush();
  }));

  it('should init with the correct values for wish wallet', () => {
    component.wish = WishListTestData.sharedWishWallet;
    fixture.detectChanges();

    expect(component.isCancellable).toBeTruthy();
    expect(component.isReservable).toBeFalsy();
    expect(component.isStateChangeable).toBeTruthy();
    expect(component.isLoading).toBeFalsy();
    expect(component.cssClassWishReservedState).toBe('wish-bought');
    expect(component.state).toBe(SharedWishListState.CANCELLABLE);
  });

  it('should reserve a wish', fakeAsync(() => {
    const testWish = WishListTestData.sharedWishBoschWasher;
    const expectedResult = WishListTestDataUtils.fakeReserveStateChange(testWish, true);

    publicResourceApiService.reserveSharedWishResult = expectedResult;
    component.wishList = WishListTestData.sharedWishListBirthday;
    component.wish = testWish;
    storageService.getResult = true;
    fixture.detectChanges();
    tick();

    spyOn(storageService, 'set');
    spyOn(component.wishStateChanged, 'emit');

    component.reserve();

    expect(SharedWishListState[component.state]).toBe(SharedWishListState[SharedWishListState.CANCELLABLE]);
    expect(toastServiceSpy.presentSuccessToast).toHaveBeenCalledTimes(1);
    expect(storageService.set).toHaveBeenCalledWith('sharedWish_1', true);
    expect(component.wishStateChanged.emit).toHaveBeenCalledWith(expectedResult);

    flush();

  }));

  it('shouldn\'t change the state if wish reservation failed', async () => {
    const testWish = WishListTestData.sharedWishBoschWasher;

    publicResourceApiService.reserveSharedWishResult = null;
    component.wishList = WishListTestData.sharedWishListBirthday;
    component.wish = testWish;
    storageService.getResult = true;

    fixture.detectChanges();
    await fixture.whenStable();

    spyOn(storageService, 'set');
    spyOn(component.wishStateChanged, 'emit');

    component.reserve();

    expect(SharedWishListState[component.state]).toBe(SharedWishListState[SharedWishListState.RESERVABLE]);
    expect(toastServiceSpy.presentErrorToast).toHaveBeenCalledTimes(1);
    expect(storageService.set).not.toHaveBeenCalledWith('sharedWish_1', true);
    expect(component.wishStateChanged.emit).not.toHaveBeenCalled();
  });

  it('should cancel a wish', fakeAsync(() => {
    const testWish = WishListTestData.sharedWishKindle;
    const expectedResult = WishListTestDataUtils.fakeCancelReservationStateChange(testWish);

    publicResourceApiService.cancelSharedWishReservationResult = expectedResult;
    component.wishList = WishListTestData.sharedWishListBirthday;
    component.wish = testWish;
    fixture.detectChanges();
    tick();

    spyOn(storageService, 'remove');
    spyOn(component.wishStateChanged, 'emit');

    component.cancelReservation();

    expect(SharedWishListState[component.state]).toBe(SharedWishListState[SharedWishListState.RESERVABLE]);
    expect(toastServiceSpy.presentSuccessToast).toHaveBeenCalledTimes(1);
    expect(storageService.remove).toHaveBeenCalledWith('sharedWish_2');
    expect(component.wishStateChanged.emit).toHaveBeenCalledWith(expectedResult);

    flush();
  }));

  it('shouldn\'t change the state if cancelation of wish reservation failed', fakeAsync(() => {
    const testWish = WishListTestData.sharedWishKindle;

    publicResourceApiService.cancelSharedWishReservationResult = null;
    component.wishList = WishListTestData.sharedWishListBirthday;
    component.wish = testWish;
    storageService.getResult = true;
    fixture.detectChanges();
    tick();

    spyOn(storageService, 'remove');
    spyOn(component.wishStateChanged, 'emit');

    component.cancelReservation();

    expect(SharedWishListState[component.state]).toBe(SharedWishListState[SharedWishListState.CANCELLABLE]);
    expect(toastServiceSpy.presentErrorToast).toHaveBeenCalledTimes(1);
    expect(storageService.remove).not.toHaveBeenCalled();
    expect(component.wishStateChanged.emit).not.toHaveBeenCalled();

    flush();
  }));

  it('should open the product link in in app browser', () => {
    const wish = WishListTestData.sharedWishKindle;
    component.wish = wish;
    component.wishList = WishListTestData.sharedWishListBirthday;
    fixture.detectChanges();

    component.openProductURL();

    expect(browserService.openInAppBrowser).toHaveBeenCalledWith(wish.productUrl);
  })

  afterEach(() => {
    toastServiceSpy.presentSuccessToast.calls.reset();
    toastServiceSpy.presentErrorToast.calls.reset();
    storageService = new MockStorageService();
    publicResourceApiService = new PublicResourceApiMockService()
  })

});
