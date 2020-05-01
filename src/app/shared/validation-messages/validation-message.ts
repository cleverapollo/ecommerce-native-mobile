export class ValidationMessage {
    type: string
    message: string

    constructor(type: string, message: string) {
        this.type = type;
        this.message = message;
    }
}

export interface ValidationMessages {
    [key: string]: ValidationMessage[]
}