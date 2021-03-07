import { ProfileImageDto, UserDto } from '@core/models/user.model';

export class FriendWishList {
    id: Number;
    name: String;
    date: String;
    wishes: Array<FriendWish>;
    owners: Array<UserDto>;

    memberProfieImageInfos: Array<ProfileImageDto>;
}

export class FriendWish {
    id: Number;
    wishListId: Number;
    name: String;
    price: String;
    productUrl: string;
    imageUrl: String;
    reservedByFriend: Boolean;
    bought: Boolean;
}

export interface RegisterAndSatisfyWishRequest {
    wishListId: Number;
    email: String;
    wishId: Number;
}