export class VerifyEmailResponse {
    kind: string;
    localId: string;
    email: string;
    displayName: string;
    photoUrl: string;
    passwordHash: string;
    providerUserInfo: Array<FirebaseAuthProviderUserInfo>;
    emailVerified: boolean;
}

export class FirebaseAuthProviderUserInfo {
    providerId: string;
    federatedId: string;
}
export enum VerifyEmailErrorCode {
    EXPIRED_OOB_CODE,
    INVALID_OOB_CODE, // code is malformed, expired, or has already been used
    USER_DISABLED,
    EMAIL_NOT_FOUND
}

export enum UserManagementActionMode {
    resetPassword = 'resetPassword',
    recoverEmail = 'recoverEmail',
    verifyEmail = 'verifyEmail'
}

export class VerifyPasswordResetCodeResponse {
    email: string;
    requestType: string; // PASSWORD_RESET
}

export enum VerifyPasswordResetCodeErrorCode {
    OPERATION_NOT_ALLOWED,
    EXPIRED_OOB_CODE,
    INVALID_OOB_CODE, // code is malformed, expired, or has already been used
}

export class ConfirmPasswordResetResponse {
    email: string;
    requestType: string; // PASSWORD_RESET
}

export enum ConfirmPasswordResetErrorCode {
    OPERATION_NOT_ALLOWED,
    EXPIRED_OOB_CODE,
    INVALID_OOB_CODE, // code is malformed, expired, or has already been used
    USER_DISABLED
}