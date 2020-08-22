export class UserSearchResult {
    public firstName: String;
    public email: String;
    public imageUrl: String = null;
    public userExists: boolean;
}

export interface WanticJwtToken {
    sub: string;
    role: string;
    exp: Number;
    iat: Number;
}

export interface UpdatePasswordRequest {
    currentPassword: String;
    newPassword: String;
    newPasswordConfirmed: String;
}