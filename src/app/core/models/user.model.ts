import { AbstractControl } from "@angular/forms";

export class UserProfile {
    firstName: String;
    lastName: String;
    birthday: Date;
    email: EmailDto;
    profileImageInfo: ProfileImageDto;
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
    profileImageInfo: ProfileImageDto;
    emailVerificationStatus: EmailVerificationStatus;
}

export class UserWishListDto {
    firstName: string;
    lastName?: string;
    email: string;
    profileImageInfo?: ProfileImageDto;
    emailVerificationStatus: EmailVerificationStatus;
    invitationStatus: InvitationStatus;
}

export class UserSearchResult {
    public firstName: String;
    public email: String;
    public imageUrl: String = null;
    public userExists: boolean;
}

export enum UserState {
    UNKNOWN = "UNKNOWN",
    ACTIVE = "ACTIVE",
    UNVERIFIED = "UNVERIFIED",
    PREACTIVE = "PREACTIVE"
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

export class UploadFileResponse {
    fileName: String;
    fileDownloadUri: String;
    fileType: String;
    size: Number;
}

export class ProfileImageDto {
    urlString: string;
    fileName: string;
    isFromLoggedInUser: boolean;
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
export class UpdateEmailRequest {
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