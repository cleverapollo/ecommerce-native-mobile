import { TestBed, waitForAsync } from '@angular/core/testing';
import { WishApiService } from '@core/api/wish-api.service';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishDto, WishListCreateRequest, WishListDto, WishListUpdateRequest } from '@core/models/wish-list.model';
import { WishListTestData } from '@core/test/wish-list-data';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, combineLatest, from, of, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { Logger } from './log.service';

import { WishListStoreService } from './wish-list-store.service';

describe('WishListStoreService', () => {

  let service: WishListStoreService;
  let wishLists$ = new BehaviorSubject<WishListDto[]>([])

  const wishListApiServiceSpy: jasmine.SpyObj<WishListApiService> = jasmine.createSpyObj('WishListApiService', [
    'getWishLists',
    'getWishList',
    'create',
    'update',
    'delete',
    'removeWish'
  ]);
  const wishApiServiceSpy: jasmine.SpyObj<WishApiService> = jasmine.createSpyObj('WishApiService', [
    'getWishById',
    'createWish',
    'update'
  ]);
  const cacheSpy: jasmine.SpyObj<CacheService> = jasmine.createSpyObj('CacheService', [
    'clearGroup',
    'loadFromObservable',
    'removeItem',
    'saveItem',
    'getItem'
  ]);
  const loggerSpy: jasmine.SpyObj<Logger> = jasmine.createSpyObj('Logger', [
    'error',
    'log',
    'warn',
    'debug'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WishListApiService, useValue: wishListApiServiceSpy },
        { provide: WishApiService, useValue: wishApiServiceSpy },
        { provide: CacheService, useValue: cacheSpy },
        { provide: Logger, useValue: loggerSpy }
      ]
    });
    service = TestBed.inject(WishListStoreService);
    wishLists$ = new BehaviorSubject<WishListDto[]>([]);
    service['_wishLists'] = wishLists$;

    cacheSpy.saveItem.calls.reset();
    cacheSpy.removeItem.calls.reset();
    cacheSpy.getItem.calls.reset();
    cacheSpy.loadFromObservable.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('clear', () => {

    it('removes cached items', waitForAsync(() => {
      cacheSpy.clearGroup.and.returnValue(Promise.resolve());

      wishLists$.next([
        WishListTestData.wishListWedding,
        WishListTestData.wishListBirthday
      ])

      combineLatest([
        from(service.clear()),
        service.wishLists
      ]).pipe(
        first()
      ).subscribe({
        next: ([_, wishLists]) => {
          // check caching
          expect(cacheSpy.clearGroup).toHaveBeenCalledWith('wishList');
          // check results
          expect(wishLists).toEqual([]);
        },
      })
    }));

    it('logs an error if caching failes', waitForAsync(() => {
      cacheSpy.clearGroup.and.returnValue(Promise.reject());
      service.clear().catch(() => {
        expect(loggerSpy.error).toHaveBeenCalled();
      })
    }))
  })

  describe('loadWishLists', () => {

    const wishLists = [
      WishListTestData.wishListBirthday,
      WishListTestData.wishListWedding
    ];
    const cachedWishLists = [
      WishListTestData.wishListBirthday
    ];

    beforeEach(() => {
      wishListApiServiceSpy.getWishLists.calls.reset();
    })

    it('returns all wish lists from backend', waitForAsync(() => {
      // fake successful caching
      cacheSpy.loadFromObservable.and.returnValue(of(wishLists));
      cacheSpy.removeItem.and.returnValue(Promise.resolve());
      // fake successful backend call
      wishListApiServiceSpy.getWishLists.and.returnValue(of(wishLists));
      // test
      combineLatest([
        service.loadWishLists(true),
        service.wishLists
      ]).pipe(
        first()
      ).subscribe({
        next: ([backendWishLists, cachedWishLists]) => {
          // check backend call
          expect(wishListApiServiceSpy.getWishLists).toHaveBeenCalledTimes(1);
          // check caching
          expect(cacheSpy.removeItem).toHaveBeenCalledWith('getWishLists');
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(backendWishLists.length).toBe(2);
          expect(backendWishLists).toEqual(wishLists);
          expect(cachedWishLists).toEqual(backendWishLists);
        },
      });
    }));

    it('returns all wish lists from cache', waitForAsync(() => {
      // fake successful caching
      wishLists$.next(cachedWishLists);
      cacheSpy.loadFromObservable.and.returnValue(of(cachedWishLists));
      // fake successful backend call
      wishListApiServiceSpy.getWishLists.and.returnValue(of(cachedWishLists));
      // test
      service.loadWishLists().pipe(first()).subscribe({
        next (result) {
          // check caching
          expect(cacheSpy.removeItem).not.toHaveBeenCalled();
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(result).toEqual(cachedWishLists);
        },
      })
    }));

    it('returns wish lists from backend if no items are cached', waitForAsync(() => {
      wishLists$.next(cachedWishLists);
      // fake caching issues
      cacheSpy.removeItem.and.returnValue(Promise.reject());
      // fake successful backend call
      cacheSpy.loadFromObservable.and.returnValue(of(cachedWishLists));
      wishListApiServiceSpy.getWishLists.and.returnValue(of(cachedWishLists));
      // test
      service.loadWishLists(true).pipe(
        first()
      ).subscribe({
        next: result => {
          // check caching
          expect(cacheSpy.removeItem).toHaveBeenCalled();
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(result).toEqual(cachedWishLists);
        },
      })
    }));

    it('returns an empty array if there are errors', waitForAsync(() => {
      // fake issues
      cacheSpy.removeItem.and.returnValue(Promise.reject());
      cacheSpy.loadFromObservable.and.returnValue(throwError(''));
      // test
      service.loadWishLists(true).pipe(
        first()
      ).subscribe({
        next: result => {
          // check caching
          expect(cacheSpy.removeItem).toHaveBeenCalled();
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(result).toEqual([]);
        }
      })
    }));
  });

  describe('loadWishList', () => {

    beforeEach(() => {
      wishListApiServiceSpy.getWishList.calls.reset();
    })

    it('return null if there are errors', waitForAsync(() => {
      // fake backend issue
      cacheSpy.loadFromObservable.and.returnValue(throwError(''));
      // test
      service.loadWishList('1').pipe(first()).subscribe({
        next: result => {
          expect(result).toBeNull();
        }
      })
    }));

    it('returns wish list from cache', waitForAsync(() => {
      const cachedWishList = WishListTestData.wishListBirthday

      cacheSpy.loadFromObservable.and.returnValue(of(cachedWishList))
      wishListApiServiceSpy.getWishList.and.returnValue(of(cachedWishList))

      service.loadWishList('1').pipe(
        first()
      ).subscribe({
        next: wishList => {
          // check caching
          expect(cacheSpy.removeItem).not.toHaveBeenCalled();
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(wishList).toEqual(cachedWishList);
        },
      })
    }));

    it('returns wish list from backend', waitForAsync(() => {
      const wishListFromBackend = WishListTestData.wishListBirthday

      cacheSpy.removeItem.and.returnValue(Promise.reject());
      cacheSpy.loadFromObservable.and.returnValue(of(wishListFromBackend))
      wishListApiServiceSpy.getWishList.and.returnValue(of(wishListFromBackend))

      service.loadWishList('1', true).pipe(
        first()
      ).subscribe({
        next: wishList => {
          // check caching
          expect(cacheSpy.removeItem).toHaveBeenCalledTimes(1);
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(wishList).toEqual(wishListFromBackend);
        },
      })
    }));
  });

  describe('createWishList', () => {

    beforeEach(() => {
      wishListApiServiceSpy.create.calls.reset();
    })

    it('returns the created wish list from cache', waitForAsync(() => {
      const wishList = WishListTestData.wishListBirthday;
      const newWishList: WishListCreateRequest = {
        name: 'Birthday',
        showReservedWishes: false
      }

      wishListApiServiceSpy.create.and.returnValue(of(wishList));

      cacheSpy.saveItem.and.returnValue(Promise.resolve());
      cacheSpy.removeItem.and.returnValue(Promise.resolve());

      combineLatest([
        service.createWishList(newWishList),
        service.wishLists
      ]).pipe(
        first()
      ).subscribe(([createdWishList, allWishLists]) => {
        // check backend call
        expect(wishListApiServiceSpy.create).toHaveBeenCalledWith(newWishList);
        expect(wishListApiServiceSpy.create).toHaveBeenCalledTimes(1);
        // check caching
        expect(cacheSpy.saveItem).toHaveBeenCalledTimes(2);
        expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishList1', createdWishList, 'wishList', 60 * 60);
        expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishLists', [createdWishList], 'wishList', 60 * 60);
        // check result
        expect(createdWishList).toBe(wishList);
        expect(allWishLists.length).toBe(1);
        expect(allWishLists).toContain(createdWishList);
      });
    }));

    it('returns an error if the data can\'t be saved on backend', waitForAsync(() => {
      // fake backend error
      wishListApiServiceSpy.create.and.returnValue(throwError(''));
      // test
      service.createWishList({
        name: 'Birthday',
        showReservedWishes: false
      }).pipe(
        first()
      ).subscribe({
        error: () => {
          // check backend call
          expect(wishListApiServiceSpy.create).toHaveBeenCalledTimes(1);
          // check caching
          expect(cacheSpy.saveItem).toHaveBeenCalledTimes(0);
        }
      })
    }));

    it('returns the created wish list from backend if there are caching issues', waitForAsync(() => {
      const wishList = WishListTestData.wishListBirthday;
      // fake successful backend call
      wishListApiServiceSpy.create.and.returnValue(of(wishList));
      // fake caching issues
      cacheSpy.saveItem.and.returnValue(Promise.reject())
      // test
      combineLatest([
        service.createWishList({
          name: 'Birthday',
          showReservedWishes: false
        }),
        service.wishLists
      ]).pipe(
        first()
      ).subscribe({
        next: ([createdWishList, allWishLists]) => {
          // check backend call
          expect(wishListApiServiceSpy.create).toHaveBeenCalledTimes(1);
          // check caching
          expect(cacheSpy.saveItem).toHaveBeenCalledTimes(2);
          // check result
          expect(createdWishList).toBe(wishList);
          expect(allWishLists).toContain(wishList);
        },
      })
    }));
  });

  describe('updateWishList', () => {

    const updatedWishList: WishListUpdateRequest = {
      id: '1',
      name: 'Birthday',
      showReservedWishes: true
    }

    beforeEach(() => {
      wishListApiServiceSpy.update.calls.reset();
    })

    it('rejects if the wish list can\'t be updated on backend', waitForAsync(() => {
      wishListApiServiceSpy.update.and.returnValue(throwError(''));

      service.updateWishList(updatedWishList).pipe(
        first()
      ).subscribe({
        error: _ => {
          expect(wishListApiServiceSpy.update).toHaveBeenCalledWith(updatedWishList);
          expect(wishListApiServiceSpy.update).toHaveBeenCalledTimes(1);
        },
      })
    }));

    it('returns updated wish list from cache', waitForAsync(() => {
      const wishList = WishListTestData.wishListBirthday;

      wishListApiServiceSpy.update.and.returnValue(of(wishList));

      cacheSpy.saveItem.and.returnValue(Promise.resolve());
      cacheSpy.removeItem.and.returnValue(Promise.resolve());

      service.updateWishList(updatedWishList).pipe(
        first()
      ).subscribe({
        next: updatedWishList => {
          // check caching
          expect(cacheSpy.saveItem).toHaveBeenCalledTimes(2);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishList1', wishList, 'wishList', 60 * 60);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishLists', [], 'wishList', 60 * 60);
          // check result
          expect(updatedWishList).toBe(wishList);
        },
      })
    }));

    it('returns updated wish list from backend on caching issues', waitForAsync(() => {
      const wishList = WishListTestData.wishListBirthday;
      const wishListUpdate = {...wishList, name: 'My updated wish list'};

      wishLists$.next([wishList]);

      wishListApiServiceSpy.update.and.returnValue(of(wishListUpdate));

      cacheSpy.saveItem.and.returnValue(Promise.reject());

      const update = { id: wishList.id, showReservedWishes: false, name:  'My updated wish list' };
      service.updateWishList(update).pipe(
        first()
      ).subscribe({
        next: updatedWishList => {
          // check caching
          expect(cacheSpy.saveItem).toHaveBeenCalledTimes(2);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishList1', updatedWishList, 'wishList', 60 * 60);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishLists', [updatedWishList], 'wishList', 60 * 60);
          // check result
          expect(updatedWishList).toBe(wishListUpdate);
        },
      })
    }));
  });

  describe('deleteWishList', () => {

    beforeEach(() => {
      wishListApiServiceSpy.delete.calls.reset();
    })

    it('rejects if there are any backend errors', waitForAsync(() => {
      const wishList = WishListTestData.wishListBirthday;
      wishListApiServiceSpy.delete.and.returnValue(throwError(''));
      service.deleteWishList(wishList).subscribe({
        error: _ => {

          expect(cacheSpy.removeItem).not.toHaveBeenCalled();

          expect(wishListApiServiceSpy.delete).toHaveBeenCalledTimes(1);
        },
      })
    }));

    it('removes wish list from cache', waitForAsync(() => {
      const wishList = WishListTestData.wishListBirthday;
      wishListApiServiceSpy.delete.and.returnValue(of(true));

      cacheSpy.saveItem.and.returnValue(Promise.resolve());
      cacheSpy.removeItem.and.returnValue(Promise.resolve());

      service.deleteWishList(wishList).subscribe({
        next: _ => {
          expect(wishListApiServiceSpy.delete).toHaveBeenCalledTimes(1);

          expect(cacheSpy.removeItem).toHaveBeenCalledTimes(1);
          expect(cacheSpy.removeItem).toHaveBeenCalledWith('getWishList1');

          expect(cacheSpy.saveItem).toHaveBeenCalledTimes(1);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishLists', [], 'wishList', 60 * 60);
        }
      })
    }));

  });

  describe('loadWish', () => {
    beforeEach(() => {
      wishApiServiceSpy.getWishById.calls.reset();
    });

    it('returns a wish from cache', waitForAsync(() => {
      const wish = WishListTestData.dogBowl;

      wishApiServiceSpy.getWishById.and.returnValue(of(wish));
      cacheSpy.loadFromObservable.and.returnValue(of(wish));

      service.loadWish('9919f188-b355-4db7-a5d8-84d46208f721').pipe(
        first()
      ).subscribe({
        next: createdWish => {
          // check backend call
          expect(wishApiServiceSpy.getWishById).toHaveBeenCalledTimes(1);
          // check caching
          expect(cacheSpy.removeItem).not.toHaveBeenCalled();
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(createdWish).toBe(wish);
        },
      })
    }));

    it('returns a wish form backend', waitForAsync(() => {
      const wish = WishListTestData.dogBowl;

      wishApiServiceSpy.getWishById.and.returnValue(of(wish));
      cacheSpy.loadFromObservable.and.returnValue(of(wish));
      cacheSpy.removeItem.and.returnValue(Promise.reject());

      service.loadWish('9919f188-b355-4db7-a5d8-84d46208f721', true).pipe(
        first()
      ).subscribe({
        next: createdWish => {
          // check backend call
          expect(wishApiServiceSpy.getWishById).toHaveBeenCalledTimes(1);
          // check caching
          expect(cacheSpy.removeItem).toHaveBeenCalledTimes(1);
          expect(cacheSpy.removeItem).toHaveBeenCalledWith('getWish9919f188-b355-4db7-a5d8-84d46208f721')
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(createdWish).toBe(wish);
        },
      })
    }));

    it('returns null if no wish was found', waitForAsync(() => {
      wishApiServiceSpy.getWishById.and.returnValue(throwError('Not found'));
      cacheSpy.loadFromObservable.and.returnValue(throwError('Not found'));
      cacheSpy.removeItem.and.returnValue(Promise.reject());

      service.loadWish('9919f188-b355-4db7-a5d8-84d46208f721', true).pipe(
        first()
      ).subscribe({
        next: createdWish => {
          // check backend call
          expect(wishApiServiceSpy.getWishById).toHaveBeenCalledTimes(1);
          // check caching
          expect(cacheSpy.removeItem).toHaveBeenCalledTimes(1);
          expect(cacheSpy.removeItem).toHaveBeenCalledWith('getWish9919f188-b355-4db7-a5d8-84d46208f721')
          expect(cacheSpy.loadFromObservable).toHaveBeenCalledTimes(1);
          // check result
          expect(createdWish).toBeNull();
        },
      })
    }));
  });

  describe('createWish', () => {

    const wishList = WishListTestData.wishListBirthday;
    const newWish: WishDto = {
      wishListId: wishList.id,
      name: 'My new wish',
      price: {
        amount: 10,
        currency: '€',
        displayString: '10,99 €'
      },
      productUrl: 'https://www.wantic.io',
      imageUrl: 'https://www.wantic.io/favicon',
      isFavorite: false
    }

    beforeEach(() => {
      wishApiServiceSpy.createWish.calls.reset();
    });

    it('returns the created wish from backend and saves it to cache', waitForAsync(() => {
      const createdWish = {...newWish, id: '72480cca-f38e-4427-a18d-1f9247c050ee'};

      wishLists$.next([wishList]);

      wishApiServiceSpy.createWish.and.returnValue(of(createdWish));
      cacheSpy.saveItem.and.returnValue(Promise.resolve(createdWish));
      cacheSpy.removeItem.and.returnValue(Promise.resolve());

      service.createWish(newWish).pipe(first()).subscribe({
        next: result => {
          // check result
          expect(result).toBe(createdWish);
          expect(wishList.wishes).toContain(createdWish);
          // check caching
          expect(cacheSpy.saveItem).toHaveBeenCalledTimes(3);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWish72480cca-f38e-4427-a18d-1f9247c050ee', createdWish, 'wishList', 60 * 60);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishList1', wishList, 'wishList', 60 * 60);
          expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishLists', [wishList], 'wishList', 60 * 60);
        }
      });
    }));

    it('returns created wish if wish can\'t be save to cache', waitForAsync(() => {
      const createdWish = {...newWish};
      createdWish.id = '72480cca-f38e-4427-a18d-1f9247c050ee';

      wishLists$.next([wishList])

      wishApiServiceSpy.createWish.and.returnValue(of(createdWish));

      cacheSpy.getItem.and.returnValue(Promise.resolve());
      cacheSpy.saveItem.and.returnValue(Promise.reject());

      service.createWish(newWish).pipe(first()).subscribe({
        next: result => {
          expect(result).toBe(createdWish)
        }
      })
    }))


    it('rejects if data can\'t be save to backend', waitForAsync(() => {
      wishApiServiceSpy.createWish.and.returnValue(throwError('Not Found'));
      service.createWish(newWish).pipe(first()).subscribe({
        error: error => {
          expect(error).toBe('Not Found');
          expect(wishApiServiceSpy.createWish).toHaveBeenCalled();
        }
      })
    }));
  });

  describe('updateWish', () => {

    beforeEach(() => {
      wishApiServiceSpy.update.calls.reset();
    });

    it('returns the updated wish from cache', waitForAsync(() => {
      const wishList = WishListTestData.wishListBirthday;
      const washer = WishListTestData.wishBoschWasher;

      const updatedWasher = {...washer};
      updatedWasher.name = 'Washer Bosch 2022';

      wishLists$.next([wishList]);

      wishApiServiceSpy.update.and.returnValue(of(updatedWasher));

      cacheSpy.saveItem.and.returnValue(Promise.resolve());
      cacheSpy.getItem.and.returnValue(Promise.resolve(wishList));
      cacheSpy.removeItem.and.returnValue(Promise.resolve());

      service.updateWish(updatedWasher).pipe(first()).subscribe(result => {

        expect(result).toBe(updatedWasher);
        expect(wishList.wishes).toContain(updatedWasher);

        expect(cacheSpy.saveItem).toHaveBeenCalledTimes(3);
        expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWish1', updatedWasher, 'wishList', 60 * 60);
        expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishList1', wishList, 'wishList', 60 * 60);
        expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishLists', [wishList], 'wishList', 60 * 60);
      })
    }));

    it('rejects if there are backend issues', waitForAsync(() => {
      const washer = WishListTestData.wishBoschWasher;
      const updatedWasher = {...washer};
      updatedWasher.name = 'Washer Bosch 2022';

      wishApiServiceSpy.update.and.returnValue(throwError(''));

      service.updateWish(updatedWasher).pipe(first()).subscribe({
        error: _ => {
          expect(wishApiServiceSpy.update).toHaveBeenCalledWith(updatedWasher);
        }
      });
    }));
  });

  describe('removeWish', () => {

    beforeEach(() => {
      wishListApiServiceSpy.removeWish.calls.reset();
    });

    it('rejects if there are backend issues', waitForAsync(() => {
      const washer = WishListTestData.wishBoschWasher;
      wishListApiServiceSpy.removeWish.and.returnValue(throwError(''));
      service.removeWish(washer).pipe(first()).subscribe({
        error: _ => {
          expect(wishListApiServiceSpy.removeWish).toHaveBeenCalledWith(washer);
        }
      })
    }));

    it('removes wish from cache', waitForAsync(() => {
      const washer = WishListTestData.wishBoschWasher;
      const wishList = WishListTestData.wishListBirthday;

      wishLists$.next([wishList]);

      wishListApiServiceSpy.removeWish.and.returnValue(of(true));

      cacheSpy.removeItem.and.returnValue(Promise.resolve());
      cacheSpy.saveItem.and.returnValue(Promise.resolve());
      cacheSpy.getItem.and.returnValue(Promise.resolve(wishList));

      service.removeWish(washer).pipe(first()).subscribe(_ => {

        expect(wishList.wishes).not.toContain(washer);

        expect(cacheSpy.removeItem).toHaveBeenCalledTimes(1);
        expect(cacheSpy.removeItem).toHaveBeenCalledWith('getWish1');

        expect(cacheSpy.saveItem).toHaveBeenCalledTimes(2);
        expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishList1', wishList, 'wishList', 60 * 60);
        expect(cacheSpy.saveItem).toHaveBeenCalledWith('getWishLists', [wishList],  'wishList', 60 * 60);

      })
    }));
  });

  describe('updateWishListForWish', () => {

    it('moves wish from wish list birthday to wedding', waitForAsync(() => {
      const washer = WishListTestData.wishBoschWasher;
      const wishListBirthday = WishListTestData.wishListBirthday;
      const wishListWedding = WishListTestData.wishListWedding;
      const wishLists = [wishListBirthday, wishListWedding];

      wishLists$.next(wishLists)

      cacheSpy.saveItem.and.returnValue(Promise.resolve());

      spyOn<any>(service, 'getWishListById')
        .withArgs(wishListBirthday.id).and.returnValue(Promise.resolve(wishListBirthday))
        .withArgs(wishListWedding.id).and.returnValue(Promise.resolve(wishListWedding));

      // update wish list for wish
      washer.wishListId = wishListWedding.id;

      combineLatest([
        service.updateWishListForWish(washer, wishListBirthday.id),
        service.wishLists
      ]).pipe(
        first()
      ).subscribe(([[currentWishList, prevWishList], allWishLists]) => {
        expect(currentWishList.name).toBe(wishListWedding.name);
        expect(prevWishList.name).toBe(wishListBirthday.name);

        expect(currentWishList.wishes).toContain(washer);
        expect(prevWishList.wishes).not.toContain(washer);

        expect(allWishLists).toContain(currentWishList);
        expect(allWishLists).toContain(prevWishList);
      })
    }));

    xit('moves wish list also if wish lists not cached', waitForAsync(() => {
      const washer = WishListTestData.wishBoschWasher;
      const wishListBirthday = WishListTestData.wishListBirthday;
      const wishListWedding = WishListTestData.wishListWedding;

      wishLists$.next([]);

      cacheSpy.loadFromObservable
        .withArgs('getWishList1', wishListApiServiceSpy.getWishList('1'), 'wishList', 60 * 60).and.returnValue(of(wishListBirthday))
        .withArgs('getWishList2', wishListApiServiceSpy.getWishList('2'), 'wishList', 60 * 60).and.returnValue(of(wishListWedding))

      wishListApiServiceSpy.getWishList
        .withArgs('1').and.returnValue(of(wishListBirthday))
        .withArgs('2').and.returnValue(of(wishListWedding));


      // update wish list for wish
      washer.wishListId = wishListWedding.id;

      combineLatest([
        service.updateWishListForWish(washer, wishListBirthday.id),
        service.wishLists
      ]).pipe(
        first()
      ).subscribe(([[currentWishList, prevWishList], allWishLists]) => {
        expect(currentWishList.name).toBe(wishListWedding.name);
        expect(prevWishList.name).toBe(wishListBirthday.name);

        expect(currentWishList.wishes).toContain(washer);
        expect(prevWishList.wishes).not.toContain(washer);

        expect(allWishLists).toContain(currentWishList);
        expect(allWishLists).toContain(prevWishList);
      })
    }));
  })
});
