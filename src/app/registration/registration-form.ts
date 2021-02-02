import { WishDto } from '@core/models/wish-list.model';
import { InvitePartnerRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';

export class RegistrationRequest {
    userFirstName: String;
    userEmail: String;
    userPassword: String;
    userBirthday: Date;
    userGender: Gender;
}

export class RegistrationDto extends RegistrationRequest {
    wishListName: String
    wishListDate: Date
    wishListWish: WishDto
    invitePartnerRequest: InvitePartnerRequest = null;
}

export class RegistrationPartnerDto extends RegistrationRequest {
    userId: String;
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE', 
    DIVERSE = 'DIVERSE'
}