import { WishDto } from '../shared/models/wish-list.model';

export class RegistrationRequest {
    userFirstName: String
    userEmail: String
    userPassword: String
}

export class RegistrationDto extends RegistrationRequest {
    wishListName: String
    wishListDate: Date
    wishListWish: WishDto

    wishListPartnerName: String = null
    wishListPartnerEmail: String = null
}

export class RegistrationPartnerDto extends RegistrationRequest {
    userId: String;
}