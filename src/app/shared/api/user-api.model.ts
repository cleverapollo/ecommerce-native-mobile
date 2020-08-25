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

export interface WanticJwtToken {
    sub: string;
    userState: UserState;
    exp: Number;
    iat: Number;
}

export interface UpdatePasswordRequest {
    currentPassword: String;
    newPassword: String;
    newPasswordConfirmed: String;
}

export interface ChangePasswordRequest {
    password: string;
    passwordConfirmed: string;
    token: string;
}