import { WishDto } from '../shared/models/wish-list.model';

export class RegistrationDto {
    userFirstName: String
    userEmail: String
    userPassword: String
    
    wishListName: String
    wishListDate: Date
    wishListWish: WishDto

    wishListPartnerName: String = null
    wishListPartnerEmail: String = null
}