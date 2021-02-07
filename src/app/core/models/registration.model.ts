import { UserRegistration } from "./user.model";
import { WishListRegistration } from "./wish-list.model";

export class RegistrationRequest {
    wishList: WishListRegistration;
    user: UserRegistration;

    constructor() {
        this.wishList = new WishListRegistration();
        this.user = new UserRegistration();
    }
}
export class RegistrationPartnerDto extends RegistrationRequest {
    userId: String;
}
