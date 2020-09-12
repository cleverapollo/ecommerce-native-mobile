export class UserProfile {
    firstName: String;
    lastName: String;
    birthday: Date;
    email: String;
    profileImageUrl: String = null;
    profileImageFileName: String = null;
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

export class UploadFileResponse {
    fileName: String;
    fileDownloadUri: String;
    fileType: String;
    size: Number;
}