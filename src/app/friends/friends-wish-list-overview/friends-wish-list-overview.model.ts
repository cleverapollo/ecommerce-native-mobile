import { ProfileImageDto } from '@core/models/user.model';

export class FriendWishList {
    id: Number;
    name: String;
    date: String;
    wishes: Array<FriendWish>;
    owners: Array<FriendWishListOwner>;

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

export class FriendWishListOwner {
    firstName: String;
    profileImageInfo: ProfileImageDto;
}

export class SharedWishListDto {
    name: String;
    date: Date;
    wishes: Array<FriendWish>;
    inviterName: String;
}

export interface RegisterAndSatisfyWishRequest {
    identifier: String;
    email: String;
    wishId: Number;
}