import { AbstractControl } from "@angular/forms";

export class UserProfile {
    firstName: String;
    lastName: String;
    birthday: Date;
    email: EmailDto;
}

export class EmailDto {
    value: string;
    status: EmailVerificationStatus;
}

export enum InvitationStatus {
    ACCEPTED,
    INVITED
}

export class UserDto {
    firstName: String;
    lastName: String;
    emailVerificationStatus: EmailVerificationStatus;
}

export class UserWishListDto {
    firstName: string;
    lastName?: string;
    email: string;
    emailVerificationStatus: EmailVerificationStatus;
    invitationStatus: InvitationStatus;
}

export class UserSearchResult {
    public firstName: String;
    public email: String;
    public imageUrl: String = null;
    public userExists: boolean;
}

export enum EmailVerificationStatus {
    UNVERIFIED, VERIFICATION_EMAIL_SENT, VERIFIED
}
export class EmailVerificationDto {
    status: EmailVerificationStatus;
}

export enum PublicEmailVerificationStatus {
    ERROR, TOKEN_EXPIRED, VERIFIED
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE', 
    DIVERSE = 'DIVERSE'
}
export class UserRegistration {
    firstName: string;
    email: string;
    password: string;
    birthday?: Date;
    gender?: Gender;
}
export class UpdateEmailChangeRequest {
    email: string;
    password: string;

    constructor(controls: { [key: string]: AbstractControl }) {
        this.email = controls.email.value;
        this.password = controls.password.value;
    }
}

export class DeleteAccountRequest {
    password: string;

    constructor(controls: { [key: string]: AbstractControl }) {
        this.password = controls.password.value;
    }
}
export class AccountDto {
    isEnabled: boolean;
}