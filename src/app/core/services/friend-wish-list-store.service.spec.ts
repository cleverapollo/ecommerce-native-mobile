import { TestBed } from '@angular/core/testing';

import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { SharedWishListApiService } from '@core/api/shared-wish-list-api.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { of } from 'rxjs';
import { FriendWishListStoreService } from './friend-wish-list-store.service';
import { Logger } from './log.service';

describe('FriendWishListStoreService', () => {

  let service: FriendWishListStoreService;
  let sharedWishListApiSpy: jasmine.SpyObj<SharedWishListApiService>;
  let publicResourceApiSpy: jasmine.SpyObj<PublicResourceApiService>;
  let loggerSpy: jasmine.SpyObj<Logger>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FriendWishListStoreService,
        { provide: SharedWishListApiService, useValue: jasmine.createSpyObj<SharedWishListApiService>('SharedWishListApiService', ['getWishListById', 'getWishLists', 'removeWishListById']) },
        { provide: PublicResourceApiService, useValue: jasmine.createSpyObj<PublicResourceApiService>('PublicResourceApiService', ['getSharedWishList']) },
        { provide: Logger, useValue: jasmine.createSpyObj<Logger>('Logger', ['warn', 'error']) },
      ]
    })

    service = TestBed.inject(FriendWishListStoreService);
    sharedWishListApiSpy = TestBed.inject(SharedWishListApiService) as jasmine.SpyObj<SharedWishListApiService>;
    publicResourceApiSpy = TestBed.inject(PublicResourceApiService) as jasmine.SpyObj<PublicResourceApiService>;
    loggerSpy = TestBed.inject(Logger) as jasmine.SpyObj<Logger>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.publicSharedWishLists).toEqual([]);
    expect(service.sharedWishLists).toEqual([]);
  });

  it('loadSharedWishLists: loads wish lists', async () => {
    let wishLists = await service.loadSharedWishLists();
    expect(wishLists).toEqual([]);

    sharedWishListApiSpy.getWishLists.and.returnValue(of([WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding]));
    wishLists = await service.loadSharedWishLists(true);
    expect(wishLists).toEqual([WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding]);
    expect(service.sharedWishLists).toEqual([WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding]);

    sharedWishListApiSpy.getWishLists.and.throwError('any error');
    wishLists = await service.loadSharedWishLists(true);
    expect(wishLists).toEqual([]);
  });

  it('loadSharedWishList: loads any shared wish list by id', async () => {
    sharedWishListApiSpy.getWishListById.and.returnValue(of(WishListTestData.sharedWishListBirthday));

    let wishList = await service.loadSharedWishList('1');
    expect(wishList).toEqual(WishListTestData.sharedWishListBirthday);
    expect(service.sharedWishLists).toContain(WishListTestData.sharedWishListBirthday);
    // test caching
    wishList = await service.loadSharedWishList('1');
    expect(wishList).toEqual(WishListTestData.sharedWishListBirthday);
    expect(service.sharedWishLists).toContain(WishListTestData.sharedWishListBirthday);
    expect(sharedWishListApiSpy.getWishListById).toHaveBeenCalledTimes(1);
  });

  it('loadPublicSharedWishList: loads any public shared wish list by id', async () => {
    publicResourceApiSpy.getSharedWishList.and.returnValue(of(WishListTestData.sharedWishListBirthday));

    let wishList = await service.loadPublicSharedWishList('1');
    expect(wishList).toEqual(WishListTestData.sharedWishListBirthday);
    expect(service.publicSharedWishLists).toContain(WishListTestData.sharedWishListBirthday);
    // test caching
    wishList = await service.loadPublicSharedWishList('1');
    expect(wishList).toEqual(WishListTestData.sharedWishListBirthday);
    expect(service.publicSharedWishLists).toContain(WishListTestData.sharedWishListBirthday);
    expect(publicResourceApiSpy.getSharedWishList).toHaveBeenCalledTimes(1);
  });

  it('removeWishListById: removes any wish list by id', async () => {
    service.sharedWishLists = [WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding];
    sharedWishListApiSpy.removeWishListById.and.returnValue(of(void 0));

    await service.removeWishListById('1');
    expect(service.sharedWishLists).toEqual([WishListTestData.sharedWishListWedding]);

    service.sharedWishLists = [WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding];
    sharedWishListApiSpy.removeWishListById.and.throwError('any error');
    try {
      await service.removeWishListById('1');
      fail();
    } catch (error) {
      expect(service.sharedWishLists).toEqual([WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding]);
    }

  });

  it('updateSharedWish: updates any wish in wish list', () => {
    // wish list not found
    service.updateSharedWish(WishListTestData.sharedWishBoschWasher);
    expect(loggerSpy.warn).toHaveBeenCalledWith('Wish list with id "1" not found');

    // wish update
    service.sharedWishLists = [WishListTestData.sharedWishListBirthday];
    service.updateSharedWish({
      ...WishListTestData.sharedWishBoschWasher,
      note: 'Any Update'
    });
    expect(service.sharedWishLists[0].wishes).toContain(
      {
        ...WishListTestData.sharedWishBoschWasher,
        note: 'Any Update'
      }
    );

    // wish not found
    service.updateSharedWish({
      ...WishListTestData.sharedWishBoschWasher,
      id: '99'
    });
    expect(loggerSpy.warn).toHaveBeenCalledWith('Wish "99" not found in list "1"');
    expect(service.sharedWishLists[0].wishes).toContain(
      {
        ...WishListTestData.sharedWishBoschWasher,
        id: '99'
      }
    );
  })

  it('updatePublicSharedWish: updates any wish in wish list', () => {
    // wish list not found
    service.updatePublicSharedWish(WishListTestData.sharedWishBoschWasher);
    expect(loggerSpy.warn).toHaveBeenCalledWith('Wish list with id "1" not found');

    // wish update
    service.publicSharedWishLists = [WishListTestData.sharedWishListBirthday];
    service.updatePublicSharedWish({
      ...WishListTestData.sharedWishBoschWasher,
      note: 'Any Update'
    });
    expect(service.publicSharedWishLists[0].wishes).toContain(
      {
        ...WishListTestData.sharedWishBoschWasher,
        note: 'Any Update'
      }
    );

    // wish not found
    service.updatePublicSharedWish({
      ...WishListTestData.sharedWishBoschWasher,
      id: '99'
    });
    expect(loggerSpy.warn).toHaveBeenCalledWith('Wish "99" not found in list "1"');
    expect(service.publicSharedWishLists[0].wishes).toContain(
      {
        ...WishListTestData.sharedWishBoschWasher,
        id: '99'
      }
    );
  })

  it('isSharedWishList', async () => {
    sharedWishListApiSpy.getWishLists.and.returnValue(of([WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding]));
    let isSharedWishList = await service.isSharedWishList('1');
    expect(isSharedWishList).toBeTruthy();

    isSharedWishList = await service.isSharedWishList('99');
    expect(isSharedWishList).toBeFalsy();

    sharedWishListApiSpy.getWishLists.and.throwError('any error');
    expect(isSharedWishList).toBeFalsy();
  });

  it('clearCache', async () => {
    service.publicSharedWishLists = [WishListTestData.sharedWishListBirthday];
    service.sharedWishLists = [WishListTestData.sharedWishListBirthday, WishListTestData.sharedWishListWedding];

    service.clearCache();
    expect(service.sharedWishLists).toEqual([]);
    expect(service.publicSharedWishLists).toEqual([]);
  });
});
