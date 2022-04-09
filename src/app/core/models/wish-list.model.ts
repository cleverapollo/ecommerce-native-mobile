import { UserWishListDto } from './user.model';

export class PriceDto {
    amount: number;
    currency: string;
    displayString: string;

    static fromAmount(amount: number) {
        let price = new PriceDto();
        price.amount = amount;
        price.currency = '€'
        return price;
    }
}
export class WishDto {
    id?: string;
    asin?: string;
    wishListId: string;
    name: string;
    note?: string;
    price: PriceDto;
    productUrl: string;
    imageUrl: String;
    isReserved?: boolean;
    isFavorite: boolean = false;
}

export class WishListSelectOptionDto {
    id: string;
    name: String;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    static forWishList(wishList: WishListDto): WishListSelectOptionDto {
        return new WishListSelectOptionDto(wishList.id, wishList.name);
    }
}

export class WishListDto {
    id: string;
    name: string;
    date: Date;
    wishes: WishDto[];
    creatorEmail: string;
    owners: UserWishListDto[];
    showReservedWishes: boolean;
}

export class WishListRegistration {
    name: string;
    date?: Date;
    wish: WishDto;
}

export class SharedWishListLink {
    value: string;
}