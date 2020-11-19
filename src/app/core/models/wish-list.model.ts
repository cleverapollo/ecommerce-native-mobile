import { UserDto, UserWishListDto } from './user.model';

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

export class WishListDto {
    id: number;
    name: string;
    date: Date;
    wishes: WishDto[];
    creatorEmail: string;
    owners: UserWishListDto[];
}

export class SharedWishListLink {
    value: string;
}