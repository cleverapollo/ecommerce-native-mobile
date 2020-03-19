export class FriendWishList {
    id: Number;
    name: String;
    date: String;
    wishes: Array<FriendWish>;
    friendName: String;
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