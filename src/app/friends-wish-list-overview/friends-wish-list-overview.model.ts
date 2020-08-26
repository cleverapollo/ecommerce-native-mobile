export class FriendWishList {
    id: Number;
    name: String;
    date: String;
    wishes: Array<FriendWish>;
    owners: Array<FriendWishListOwner>;

    memberProfieImageUrls: Array<String>;
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
    profileImageUrl: String;
}

export class SharedWishListDto {
    name: String;
    date: Date;
    wishes: Array<FriendWish>;
    inviterName: String;
}