import { UserWishListDto } from './user.model';

export class PriceDto {
    amount: number;
    currency: string;
    displayString: string;
}
export class WishDto {
    id: string;
    asin?: string;
    wishListId: string;
    name: String;
    price: PriceDto;
    productUrl: string;
    imageUrl: String;
}

export class WishListSelectOptionDto {
    id: string;
    name: String;

    static forWishList(wishList: WishListDto): WishListSelectOptionDto {
        const model = new WishListSelectOptionDto();
        model.id = wishList.id;
        model.name = wishList.name;
        return model;
    }
}

export class WishListDto {
    id: string;
    name: string;
    date: Date;
    wishes: WishDto[];
    creatorEmail: string;
    owners: UserWishListDto[];
}

export class WishListRegistration {
    name: string;
    date?: Date;
    wish: WishDto;
}

export class SharedWishListLink {
    value: string;
}