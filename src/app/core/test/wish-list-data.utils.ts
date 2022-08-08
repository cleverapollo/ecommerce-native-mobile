import { FriendWish } from "@core/models/wish-list.model";

export class WishListTestDataUtils {

    static fakeReserveStateChange(wish: FriendWish, isPublic: boolean) : FriendWish {
        const copiedWish = { ...wish };
        copiedWish.bought = isPublic ? false : true;
        copiedWish.reservedByFriend = true;
        return copiedWish;
    }

    static fakeCancelReservationStateChange(wish: FriendWish) : FriendWish {
        const copiedWish = { ...wish };
        copiedWish.bought = false;
        copiedWish.reservedByFriend = false;
        return copiedWish;
    }

}