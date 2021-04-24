import { Gender } from "./user.model";

export enum AuthProvider {
    apple = 'APPLE',
    facebook = 'FACEBOOK',
    google = 'GOOGLE',
    wantic = 'WANTIC'
}
export class SignupRequest {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    birthday?: Date;
    gender?: Gender;
    agreedToPrivacyPolicyAt: Date;
    authProvider: AuthProvider;
}