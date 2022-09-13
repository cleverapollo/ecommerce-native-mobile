import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FriendWishList } from '@core/models/wish-list.model';
import { MockAlertService } from '@core/services/alert-mock.service';
import { AlertService, AppAlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { MockFriendWishListStoreService } from '@core/services/friend-wish-list-store-mock.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { AppLoadingService, LoadingService } from '@core/services/loading.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule, NavController } from '@ionic/angular';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { FriendsWishListDetailPage } from './friends-wish-list-detail.page';

describe('FriendsWishListDetailPage', () => {

  const navController: NavController = jasmine.createSpyObj('navController', ['navigateBack']);
  const sharedWishListStore: MockFriendWishListStoreService = new MockFriendWishListStoreService();
  const analyticsService: AnalyticsService = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);
  const alertService: AppAlertService = new MockAlertService();
  const loadingService: AppLoadingService = new MockLoadingService();
  const toastService: ToastService = new MockToastService();

  let paramMapMock: ParamMap;
  let paramMapSubscription: Subscription;
  let paramMapObservable: Observable<ParamMap>;
  let activatedRouteStub: {
    paramMap: Observable<ParamMap>;
  };

  let component: FriendsWishListDetailPage;
  let fixture: ComponentFixture<FriendsWishListDetailPage>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    createParamMapSpy();

    TestBed.configureTestingModule({
      declarations: [ FriendsWishListDetailPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
        { provide: AlertService, useValue: alertService },
        { provide: FriendWishListStoreService, useValue: sharedWishListStore },
        { provide: NavController, useValue: navController },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FriendsWishListDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  function createParamMapSpy() {
    paramMapMock = {
      keys: [],
      has: jasmine.createSpy('has'),
      get: jasmine.createSpy('get'),
      getAll: jasmine.createSpy('getAll')
    };

    paramMapSubscription = new Subscription();
    paramMapObservable = new Observable<ParamMap>();

    spyOn(paramMapSubscription, 'unsubscribe').and.callThrough();
    spyOn(paramMapObservable, 'subscribe').and.callFake((fn: any): Subscription => {
      fn(paramMapMock);
      return paramMapSubscription;
    });

    activatedRouteStub = {
        paramMap: paramMapObservable
    };
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe on route params', () => {
      expect(paramMapObservable.subscribe).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should subscribe sharedWishListStore loadWishList', () => {
      const observable = new Observable<FriendWishList>();
      const observableSpy = spyOn(observable, 'subscribe');

      spyOn(sharedWishListStore, 'loadWishList').and.returnValue(observable);

      component.ionViewWillEnter();

      expect(observableSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe param map subscription', () => {
      component.ngOnDestroy();

      expect(paramMapSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe sharedWishListStore loadWishList subscription', () => {
      const observable = new Observable<FriendWishList>();
      const subscription = new Subscription();
      spyOn(sharedWishListStore, 'loadWishList').and.returnValue(observable);

      spyOn(subscription, 'unsubscribe').and.callThrough();
      spyOn(observable, 'subscribe').and.callFake((fn: any): Subscription => {
        return subscription;
      });

      component.ionViewWillEnter();

      component.ngOnDestroy();

      expect(subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should send analytics event', () => {
      component.ionViewDidEnter();
      expect(analyticsService.setFirebaseScreenName).toHaveBeenCalledWith('wishlist-family_friends');
    });
  });

  describe('goBack', () => {
    it('should navigate back to the wish list overview', () => {
      component.goBack();
      expect(navController.navigateBack).toHaveBeenCalledWith('/friends-wish-list-overview');
    });
  })

  describe('forceRefresh', () => {
    it('should refresh wish list on pull-to-refresh action', fakeAsync(() => {
      let completed = false;
      const loadWishListSpy = spyOn(sharedWishListStore, 'loadWishList');
      loadWishListSpy.and.returnValue(of(WishListTestData.sharedWishListWedding));

      component.wishList = WishListTestData.sharedWishListWedding;
      component.forceRefresh({ target: {
        complete() { completed = true; }
      }});

      tick();

      expect(loadWishListSpy).toHaveBeenCalledWith('2', true);
      expect(completed).toBeTruthy();

      flush();
    }));
  });

  describe('updateWish', () => {
    it('should update a wish', () => {
      const updateCachedWishListSpy = spyOn(sharedWishListStore, 'updateCachedWishList');
      const updatedWish = WishListTestData.sharedWishKindle;
      updatedWish.name = 'Updated Name';
      component.wishList = WishListTestData.sharedWishListWedding;

      expect(component.wishList.wishes[1].name).toEqual('Kindle');

      component.updateWish(updatedWish);

      expect(component.wishList.wishes[1].name).toEqual('Updated Name');
      expect(updateCachedWishListSpy).toHaveBeenCalledWith(component.wishList);
    });

    it('should not throw or modify wish list', () => {
      const updateCachedWishListSpy = spyOn(sharedWishListStore, 'updateCachedWishList');
      const unknownWish = WishListTestData.sharedWishVanityUnit;

      component.wishList = WishListTestData.sharedWishListWedding;
      component.updateWish(unknownWish);

      expect(updateCachedWishListSpy).not.toHaveBeenCalled();
    });
  });

  describe('showDeleteAlert', () => {

    let navigateSpy: jasmine.Spy;
    let showLoadingServiceSpy: jasmine.Spy;
    let dismissLoadingServiceSpy: jasmine.Spy;

    beforeEach(() => {
      navigateSpy = spyOn(router, 'navigateByUrl');
      showLoadingServiceSpy = spyOn(loadingService, 'showLoadingSpinner');
      dismissLoadingServiceSpy = spyOn(loadingService, 'stopLoadingSpinner');
      component.wishList = new FriendWishList();
    })

    it('shows delete alert', fakeAsync(() => {
      sharedWishListStore.removeWishListByIdResponse = Promise.resolve();
      component.showDeleteAlert();

      tick();

      expect(showLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(dismissLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith('/secure/friends-home/friends-wish-list-overview?forceRefresh=true');

      flush();
    }));

    it('dismisses the loading spinner if something goes wrong', fakeAsync(() => {
      dismissLoadingServiceSpy.and.returnValue(Promise.resolve());
      // fake error response
      sharedWishListStore.removeWishListByIdResponse = Promise.reject();

      component.showDeleteAlert();

      tick();

      expect(showLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(dismissLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).not.toHaveBeenCalled();

      flush();
    }));
  });


});
