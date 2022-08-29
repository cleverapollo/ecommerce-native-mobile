import { WishListDto, WishDto, WishListCreateRequest, WishListUpdateRequest } from '@core/models/wish-list.model';
import { Observable } from 'rxjs';
import { WishListApi } from './wish-list-api.service';

export class WishListApiMockService implements WishListApi {

    acceptInvitationResponse: Promise<void> = Promise.resolve();
    createResponse: Observable<WishListDto>;
    getWishListsResponse: Observable<WishListDto[]>;
    getWishListResponse: Observable<WishListDto>;
    updateResponse: Observable<WishListDto>;
    deleteResponse: Observable<object>;
    removeResponse: Observable<object>;

    acceptInvitation(id: string): Promise<void> {
        return this.acceptInvitationResponse;
    }

    create(wishList: WishListCreateRequest): Observable<WishListDto> {
        return this.createResponse;
    }

    getWishLists(): Observable<WishListDto[]> {
        return this.getWishListsResponse;
    }

    getWishList(id: string): Observable<WishListDto> {
        return this.getWishListResponse;
    }

    update(wishList: WishListUpdateRequest): Observable<WishListDto> {
        return this.updateResponse;
    }

    delete(id: string): Observable<object> {
        return this.deleteResponse;
    }

    removeWish(wish: WishDto): Observable<object> {
        return this.removeResponse;
    }

}