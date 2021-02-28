export class LoginResponse {
    token: string;
}

export interface WanticJwtToken {
    sub: string;
    emailVerificationStatus: string;
    showOnboardingSlidesIos: boolean;
    accountEnabled: boolean;
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