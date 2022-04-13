import { DatePipe } from '@angular/common';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PublicResourceApiMockService } from '@core/api/public-resource-api-mock-service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { WishListTestDataUtils } from '@core/test/wish-list-data.utils';
import { IonicModule } from '@ionic/angular';
import { OwnersInfoComponent } from '@shared/components/owners-info/owners-info.component';
import { OwnerNamesPipe } from '@shared/pipes/owner-names.pipe';
import { SortByIsFavoritePipe } from '@shared/pipes/sort-by-is-favorite.pipe';

import { SharedWishListPage } from './shared-wish-list.page';

describe('SharedWishListPage', () => {
  let component: SharedWishListPage;
  let fixture: ComponentFixture<SharedWishListPage>;
  const wishList = WishListTestData.sharedWishListBirthday;
  let route = {
    snapshot: {
      data: {
        data: {
          wishList: wishList
        }
      }
    }
  }
  let analyticsServiceSpy = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);
  let publicResourceApiServiceMock = new PublicResourceApiMockService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedWishListPage, OwnerNamesPipe, OwnersInfoComponent, SortByIsFavoritePipe],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
        { provide: PublicResourceApiService, useValue: publicResourceApiServiceMock },
        { provide: ActivatedRoute, useValue: route },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedWishListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.wishList).toEqual(WishListTestData.sharedWishListBirthday);
  });

  it('should track the page if page is loaded', () => {
    component.ionViewDidEnter();
    expect(analyticsServiceSpy.setFirebaseScreenName).toHaveBeenCalledWith('shared-wishlist');
  });

  describe('updateWishList', () => {
    it('should update wish in wish list', () => {
      const wish = component.wishList.wishes[0];
      const updatedWish = WishListTestDataUtils.fakeCancelReservationStateChange(wish);
  
      component.updateWishList(updatedWish);
  
      expect(component.wishList.wishes.includes(updatedWish)).toBeTruthy();
      expect(component.wishList.wishes.includes(wish)).toBeFalsy();
    });
  
    it('should refresh data if update of wish in wish list failed', fakeAsync(() => {
      const weddingWishList = WishListTestData.sharedWishListWedding;
      publicResourceApiServiceMock.getSharedWishListResult = weddingWishList;
  
      component.updateWishList(WishListTestData.sharedWishVanityUnit);
      tick();
  
      expect(component.wishList).toEqual(weddingWishList);
      flush();
    }));
  })

  afterEach(() => {
    route.snapshot.data.data.wishList = WishListTestData.sharedWishListBirthday;
    publicResourceApiServiceMock = new PublicResourceApiMockService();
  })
});
