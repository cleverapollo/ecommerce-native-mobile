export enum EmailVerificationStatus {
    SUCCESS = 'SUCCESS',
    TOKEN_EXPIRED_RESEND_SUCCESSFUL = 'TOKEN_EXPIRED_RESEND_SUCCESSFUL',
    TOKEN_EXPIRED_RESEND_FAILED = 'TOKEN_EXPIRED_RESEND_FAILED',
    TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
    TECHNICAL_ERROR = 'TECHNICAL_ERROR'
}

export interface EmailVerificationResponse {
    status: EmailVerificationStatus;
    jwToken: String;
    email: String;
}
