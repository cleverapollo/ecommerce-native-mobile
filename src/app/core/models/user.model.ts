export class UserProfile {
    firstName: String;
    lastName: String;
    birthday: Date;
    email: string;
    profileImageInfo: ProfileImageDto;
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