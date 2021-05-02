import { LoginResponse } from "./login.model";
import { Gender, UserProfile } from "./user.model";

export enum AuthProvider {
    apple = 'APPLE',
    facebook = 'FACEBOOK',
    google = 'GOOGLE',
    wantic = 'WANTIC'
}
export class SignupRequest {
    firstName: string;
    email: string;
    password: string;
    agreedToPrivacyPolicyAt: Date;
}

export class SignupRequestSocialLogin {
    uid: string;
    firstName: string;
    email: string;
    agreedToPrivacyPolicyAt: Date;
    authProvider: AuthProvider;
}

export class SignupResponse {
    user: UserProfile;
    jwToken: LoginResponse;
}