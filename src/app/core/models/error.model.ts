import { HttpErrorResponse } from "@angular/common/http";

export class WanticError {

    private static UNKNOWN_ERROR = 999;

    error: any;
    httpStatusCode: number = WanticError.UNKNOWN_ERROR;

    constructor(error: any) {
        this.error = error;

        if (error instanceof HttpErrorResponse) {
            this.httpStatusCode = error.status;
        }
    }

    get isUnknown(): boolean {
        return this.httpStatusCode === WanticError.UNKNOWN_ERROR;
    }

}