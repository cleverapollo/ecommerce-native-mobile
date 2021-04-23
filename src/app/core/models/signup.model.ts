import { Gender } from "./user.model";

export class SignupRequest {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    birthday?: Date;
    gender?: Gender;
    agreedToPrivacyPolicyAt: Date;
}