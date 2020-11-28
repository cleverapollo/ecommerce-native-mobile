export enum EmailVerificationTokenStatus {
    VALID,
    TOKEN_EXPIRED,
    TOKEN_NOT_FOUND,
    TECHNICAL_ERROR
}

export interface EmailVerificationResponse {
    status: EmailVerificationTokenStatus;
    jwToken: string;
    email: String;
}
