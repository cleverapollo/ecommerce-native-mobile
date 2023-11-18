import { EmailVerificationStatus, InvitationStatus } from '@core/models/user.model';
import { WishDto, WishListCreateRequest, WishListDto, WishListUpdateRequest } from '@core/models/wish-list.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as uuid from 'uuid';
import { WishListStore } from './wish-list-store.service';

export class MockWishListStoreService implements WishListStore {

    wishLists: BehaviorSubject<WishListDto[]>;
    wishlist: WishListDto = new WishListDto();
    wish: WishDto = new WishDto();

    constructor(wishLists: WishListDto[] = []) {
        this.wishLists = new BehaviorSubject<WishListDto[]>(wishLists);
    }

    loadWishLists(forceRefresh: boolean): Observable<WishListDto[]> {
        return this.wishLists;
    }
    loadWishList(id: string, forceRefresh: boolean): Observable<WishListDto> {
        return of(this.wishlist);
    }
    loadWish(id: string, forceRefresh: boolean): Observable<WishDto> {
        return of(this.wish);
    }
    clearWishLists(): Promise<void> {
        return Promise.resolve();
    }
    createWish(wish: WishDto): Observable<WishDto> {
        return of(wish);
    }
    createWishList(data: WishListCreateRequest): Observable<WishListDto> {
        const wishList: WishListDto = {
            id: uuid.v4(),
            name: data.name,
            date: data.date,
            showReservedWishes: data.showReservedWishes,
            wishes: [],
            creatorEmail: 'max@mustermann.de',
            owners: [
                {
                    firstName: 'Max',
                    lastName: 'Mustermann',
                    email: 'max@mustermann.de',
                    emailVerificationStatus: EmailVerificationStatus.VERIFIED,
                    invitationStatus: InvitationStatus.ACCEPTED,
                    hasImage: false
                }
            ]
        }
        const wishLists = this.wishLists.getValue();
        wishLists.push(wishList);
        this.wishLists.next(wishLists);
        return of(wishList);
    }
    removeWish(wish: WishDto): Observable<void> {
        return of();
    }
    cacheWishList(wishList: WishListDto): Promise<void> {
        return Promise.resolve();
    }
    updateWish(wish: WishDto): Observable<WishDto> {
        return of(wish);
    }
    updateWishList(wishList: WishListUpdateRequest): Observable<WishListDto> {
        return of(this.wishlist);
    }
    saveWishListToCache(wishList: WishListDto): Promise<void> {
        return Promise.resolve();
    }
    clear(): Promise<any> {
        return Promise.resolve();
    }
}