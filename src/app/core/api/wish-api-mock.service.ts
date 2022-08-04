import { WishDto } from '@core/models/wish-list.model';
import { Observable } from 'rxjs';
import { WishApi } from './wish-api.service';

export class WishApiMockService implements WishApi {

    createWishResponse: Observable<WishDto> = null;
    getWishByIdResponse: Observable<WishDto> = null;
    reserveWishResponse: Observable<object> = null;
    updateResponse: Observable<WishDto> = null;

    createWish(wish: WishDto): Observable<WishDto> {
        return this.createWishResponse;
    }
    getWishById(wishId: string): Observable<WishDto> {
        return this.getWishByIdResponse;
    }
    reserveWish(wishId: string): Observable<object> {
        return this.reserveWishResponse;
    }
    update(updatedWish: WishDto): Observable<WishDto> {
        return this.updateResponse;
    }

}