import { UserDto } from '@core/models/user.model';
import { PriceDto } from '@core/models/wish-list.model';

export class FriendWishList {
    id: string;
    name: String;
    date: String;
    wishes: Array<FriendWish>;
    owners: Array<UserDto>;
}

export class FriendWish {
    id: string;
    asin?: string;
    wishListId: string;
    name: string;
    note?: string;
    price: PriceDto;
    productUrl: string;
    imageUrl: String;
    reservedByFriend: boolean;
    bought: boolean;
    isFavorite: boolean;
}
