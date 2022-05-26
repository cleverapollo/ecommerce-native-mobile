export class CustomError extends Error {

    constructor(type: CustomError.Type, message: string) {
        super(message);

        this.message = message;
        this.name = `CustomError:${CustomError.Type[type]}`;
    }

}

export namespace CustomError {

    export enum Type {
        SignInError,
        NotSupportedWebFeature
    }
}