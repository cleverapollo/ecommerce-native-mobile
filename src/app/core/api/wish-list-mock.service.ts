import { WishListDto, WishDto } from "@core/models/wish-list.model";
import { WishListCreateRequest, WishListUpdateRequest } from "@wishLists/wish-list-create-update/wish-list-create-update.model";
import { Observable } from "rxjs";
import { WishListApi } from "./wish-list-api.service";

export class WishListApiMockService implements WishListApi {

    acceptInvitationResponse: Promise<void> = Promise.resolve();
    acceptInvitation(id: string): Promise<void> {
        return this.acceptInvitationResponse;
    }

    createResponse: Observable<WishListDto>;
    create(wishList: WishListCreateRequest): Observable<WishListDto> {
        return this.createResponse;
    }

    getWishListsResponse: Observable<WishListDto[]>;
    getWishLists(): Observable<WishListDto[]> {
        return this.getWishListsResponse;
    }

    getWishListResponse: Observable<WishListDto>;
    getWishList(id: string): Observable<WishListDto> {
        return this.getWishListResponse;
    }

    updateResponse: Observable<WishListDto>;
    update(wishList: WishListUpdateRequest): Observable<WishListDto> {
        return this.updateResponse;
    }

    deleteResponse: Observable<Object>
    delete(id: string): Observable<Object> {
        return this.deleteResponse;
    }

    removeResponse: Observable<Object>;
    removeWish(wish: WishDto): Observable<Object> {
        return this.removeResponse;
    }

}