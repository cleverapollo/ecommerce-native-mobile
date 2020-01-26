export class Wish {
    wishListId: Number;
    name: String;
    price: String;
    productUrl: String;
    imageUrl: String;
}

export class WishList {
    name: String
    date: String
    wishes: Array<Wish>;
}