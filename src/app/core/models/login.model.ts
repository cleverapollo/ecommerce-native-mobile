import { UserState } from '@core/models/user.model';

export class LoginResponse {
    token: string;
}

export interface WanticJwtToken {
    sub: string;
    userState: UserState;
    emailVerificationStatus: string;
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