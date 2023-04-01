import { AbstractControl } from '@angular/forms';
import { ContentCreatorAccount } from './content-creator.model';
import { AuthProvider } from './signup.model';

export class UserProfile {
    firstName: string;
    lastName: string;
    birthday: Date;
    email: EmailDto;
    authProvider: AuthProvider;
    userSettings: UserSettingsDto;
    creatorAccount?: ContentCreatorAccount | null = null;
}
export class UserSettingsDto {
    constructor(
        public showOnboardingSlidesiOS: boolean,
        public showOnboardingSlidesAndroid: boolean
    ) { }
}

export class EmailDto {
    constructor(
        public value: string,
        public status: EmailVerificationStatus
    ) { }
}

export enum InvitationStatus {
    ACCEPTED,
    INVITED
}

export class UserDto {
    firstName: string;
    lastName: string;
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
    public firstName: string;
    public email: string;
    public imageUrl: string = null;
    public userExists: boolean;
}

export enum EmailVerificationStatus {
    UNVERIFIED, VERIFICATION_EMAIL_SENT, VERIFIED
}
export class EmailVerificationDto {
    status: EmailVerificationStatus;
}

export enum PublicEmailVerificationStatus {
    ERROR, TOKEN_EXPIRED, VERIFIED, EMAIL_ALREADY_CONFIRMED
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