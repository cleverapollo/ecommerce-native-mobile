import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { PublicResourceApiMockService } from '@core/api/public-resource-api-mock-service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule } from '@ionic/angular';
import { OwnerNamesPipe } from '@shared/pipes/owner-names.pipe';
import { of } from 'rxjs';

import { MockLoadingService } from '@core/services/loading-mock.service';
import { LoadingService } from '@core/services/loading.service';
import { WishListTestDataUtils } from '@core/test/wish-list-data.utils';
import { OwnersInfoComponentFake } from '@test/components/owners-info.component.mock';
import { SharedWishListPage } from './shared-wish-list.page';

describe('SharedWishListPage', () => {
  let component: SharedWishListPage;
  let fixture: ComponentFixture<SharedWishListPage>;
  const wishList = WishListTestData.sharedWishListBirthday;
  const route = {
    snapshot: {
      data: {
        data: {
          wishList
        }
      }
    },
    paramMap: of(convertToParamMap({
      wishListId: wishList.id
    }))
  };
  const router: Partial<Router> = {
    url: '/secure/app-path'
  }
  const analyticsServiceSpy = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);
  const storeMock: Partial<FriendWishListStoreService> = {
    updateSharedWish(updatedWish) { return; },
    updatePublicSharedWish(updatedWish) { return; },
    sharedWishLists$: of([])
  }
  const loadingServiceMock = new MockLoadingService();
  let publicResourceApiServiceMock = new PublicResourceApiMockService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SharedWishListPage, OwnerNamesPipe, OwnersInfoComponentFake],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
        { provide: PublicResourceApiService, useValue: publicResourceApiServiceMock },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
        { provide: FriendWishListStoreService, useValue: storeMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedWishListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track the page if page is loaded', () => {
    component.ionViewDidEnter();
    expect(analyticsServiceSpy.setFirebaseScreenName).toHaveBeenCalledWith('shared-wishlist');
  });

  describe('updateWishList', () => {
    it('should update wish in wish list', async () => {
      const spy = spyOn(storeMock, 'updateSharedWish');
      const wish = WishListTestData.sharedWishListWedding.wishes[0];
      const updatedWish = WishListTestDataUtils.fakeCancelReservationStateChange(wish);

      component.updateWishList(updatedWish);
      await fixture.whenStable();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(updatedWish);
    });
  })

  afterEach(() => {
    route.snapshot.data.data.wishList = WishListTestData.sharedWishListBirthday;
    publicResourceApiServiceMock = new PublicResourceApiMockService();
  })
});
