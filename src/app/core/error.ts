export enum CustomErrorType {
    SignInError,
    NotSupportedWebFeature
}
export class CustomError extends Error {

    constructor(type: CustomErrorType, message: string) {
        super(message);

        this.message = message;
        this.name = `CustomError:${CustomErrorType[type]}`;
    }

}