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
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmed: string;
}

export interface ChangePasswordRequest {
    password: string;
    passwordConfirmed: string;
    token: string;
}