import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FriendWishList } from '@core/models/wish-list.model';
import { MockAlertService } from '@core/services/alert-mock.service';
import { AlertService, AppAlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { AppLoadingService, LoadingService } from '@core/services/loading.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule, NavController } from '@ionic/angular';
import { OwnerNamesPipe } from '@shared/pipes/owner-names.pipe';
import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { Observable, Subscription } from 'rxjs';
import { FriendsWishListDetailPage } from './friends-wish-list-detail.page';

describe('FriendsWishListDetailPage', () => {

  const navController: NavController = jasmine.createSpyObj('navController', ['navigateBack']);
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
  let storeSpy: jasmine.SpyObj<FriendWishListStoreService>

  beforeEach(waitForAsync(() => {
    createParamMapSpy();

    const friendWishListStoreSpy = jasmine.createSpyObj<FriendWishListStoreService>('FriendWishListStoreService', [
      'loadSharedWishList',
      'loadPublicSharedWishList',
      'updatePublicSharedWish',
      'removeWishListById'
    ])

    TestBed.configureTestingModule({
      declarations: [FriendsWishListDetailPage, NavToolbarComponentFake, EmailUnverifiedHintComponentFake, OwnerNamesPipe],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
        { provide: AlertService, useValue: alertService },
        { provide: FriendWishListStoreService, useValue: friendWishListStoreSpy },
        { provide: NavController, useValue: navController },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    storeSpy = TestBed.inject(FriendWishListStoreService) as jasmine.SpyObj<FriendWishListStoreService>;
    spyOn(router, 'getCurrentNavigation').and.callFake(() => {
      return {
        extras: {
          state: {
            wishList: WishListTestData.sharedWishListWedding
          }
        }
      } as any
    })

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
      const spy = storeSpy.loadPublicSharedWishList.and.returnValue(Promise.resolve(WishListTestData.sharedWishListWedding));

      component.wishList = WishListTestData.sharedWishListWedding;
      component.forceRefresh({
        target: {
          complete() { completed = true; }
        }
      });

      tick();

      expect(spy).toHaveBeenCalledWith('2', true);
      expect(completed).toBeTruthy();

      flush();
    }));
  });

  describe('updateWish', () => {
    it('should update a wish', () => {
      const updatedWish = {
        ...WishListTestData.sharedWishKindle,
        name: 'Updated Name'
      };
      component.updateWish(updatedWish);
      expect(storeSpy.updatePublicSharedWish).toHaveBeenCalledWith(updatedWish);
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
      storeSpy.removeWishListById.and.returnValue(Promise.resolve());
      component.showDeleteAlert();

      tick();

      expect(showLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(dismissLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith('/secure/friends-home/friends-wish-list-overview');

      flush();
    }));

    it('dismisses the loading spinner if something goes wrong', fakeAsync(() => {
      dismissLoadingServiceSpy.and.returnValue(Promise.resolve());
      // fake error response
      storeSpy.removeWishListById.and.throwError('any error');

      component.showDeleteAlert();

      tick();

      expect(showLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(dismissLoadingServiceSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).not.toHaveBeenCalled();

      flush();
    }));
  });


});
