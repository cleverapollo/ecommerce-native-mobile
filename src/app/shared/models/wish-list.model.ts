import { UserSearchResult } from '../services/user-api.model';

export class WishDto {
    id: Number;
    wishListId: Number;
    name: String;
    price: String;
    productUrl: string;
    imageUrl: String;
}

export class WishListMemberDto {
    name: String;
    failedToSendEmail: boolean;
    email: String = null;
    preactiveUserId: String = null;
    profileImageUrl: String = null;

    static forUserSearchResult(userSearchResult: UserSearchResult) : WishListMemberDto {
        let model = new WishListMemberDto()
        model.name = userSearchResult.firstName;
        model.failedToSendEmail = false;
        model.email = userSearchResult.email;
        return model;
    }
}

export class MemberToInviteDto {
    name: String;
    email: String;

    constructor(name: String, email: String) {
        this.name = name;
        this.email = email;
    }
}

export class WishListDto {
    id: Number;
    name: String;
    date: Date;
    wishes: [WishDto];
    members: [WishListMemberDto];
    membersToInvite: [MemberToInviteDto];
}