import { FriendSelectOption } from './friend.model';
import { ProfileImageDto, UserDto, UserSearchResult } from './user.model';

export class WishDto {
    id: Number;
    wishListId: Number;
    name: String;
    price: String;
    productUrl: string;
    imageUrl: String;
}

export class WishListSelectOptionDto {
    id: Number;
    name: String;

    static forWishList(wishList: WishListDto): WishListSelectOptionDto {
        const model = new WishListSelectOptionDto();
        model.id = wishList.id;
        model.name = wishList.name;
        return model;
    }
}

export class WishListPartnerDto {
    name: String;
    failedToSendEmail: boolean;
    email: String = null;
    profileImageInfo: ProfileImageDto = null;
}

export class WishListDto {
    id: number;
    name: string;
    date: Date;
    wishes: [WishDto];
    partner: WishListPartnerDto;
    owners: [UserDto];
}