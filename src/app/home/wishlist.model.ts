export class Wish {
    id: Number;
    wishListId: Number;
    name: String;
    price: String;
    productUrl: String;
    imageUrl: String;
}

export class WishList {
    id: Number;
    name: String;
    date: String;
    wishes: Array<Wish>;
}

export class WishListSelectOption {
    id: Number;
    name: String;
}