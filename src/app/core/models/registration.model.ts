import { LoginResponse } from "./login.model";
import { UserProfile, UserRegistration } from "./user.model";
import { WishListDto, WishListRegistration } from "./wish-list.model";

export class RegistrationRequest {
    wishList: WishListRegistration;
    user: UserRegistration;
    agreedToPrivacyPolicyAt: Date;

    constructor() {
        this.wishList = new WishListRegistration();
        this.user = new UserRegistration();
    }
}
export class RegistrationPartnerDto extends RegistrationRequest {
    userId: String;
}

export class RegistrationResponse {
    jwToken: LoginResponse;
    wishLists: Array<WishListDto>;
    user: UserProfile;
}
