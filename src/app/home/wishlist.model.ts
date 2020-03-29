import { WishListMemberDto } from '../shared/models/wish-list.model';

export class Wish {
    id: Number;
    wishListId: Number;
    name: String;
    price: String;
    productUrl: string;
    imageUrl: String;
}

export class WishListSelectOption {
    id: Number;
    name: String;
}