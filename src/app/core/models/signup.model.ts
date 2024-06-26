import { LoginResponse } from './login.model';
import { Gender, UserProfile } from './user.model';

export enum AuthProvider {
    APPLE = 'APPLE',
    FACEBOOK = 'FACEBOOK',
    GOOGLE = 'GOOGLE',
    WANTIC = 'WANTIC'
}
export class SignupRequest {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    agreedToPrivacyPolicyAt: Date;
}

export class SignupRequestSocialLogin {
    uid: string;
    firstName: string;
    lastName?: string;
    email: string;
    agreedToPrivacyPolicyAt: Date;
    authProvider: AuthProvider;
}

export class SignupResponse {
    user: UserProfile;
    jwToken: LoginResponse;
}

export class SignInRequest {
    uid: string;
    email: string;
}

export class SignInRequestEmailPassword {
    username: string;
    password: string;
}

export class SignInResponse {
    user: UserProfile;
}

export class ConfirmPasswordResetRequest {
    email: string;
    oobCode: string;
    newPassword: string;
}
export class ConfirmPasswordResetResponse {
    email: string;
    requestType: string;
}
