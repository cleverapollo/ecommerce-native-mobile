import { WishDto } from '../shared/models/wish-list.model';

export interface RegistrationRequest {
    userFirstName: String
    userEmail: String
    userPassword: String
}

export class RegistrationDto implements RegistrationRequest {
    userFirstName: String
    userEmail: String
    userPassword: String
    
    wishListName: String
    wishListDate: Date
    wishListWish: WishDto

    wishListPartnerName: String = null
    wishListPartnerEmail: String = null
}

export class RegistrationPartnerDto implements RegistrationRequest {
    userId: String;
    userFirstName: String
    userEmail: String
    userPassword: String
}