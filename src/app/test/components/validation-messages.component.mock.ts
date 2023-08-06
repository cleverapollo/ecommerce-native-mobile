import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { ValidationMessage } from "@shared/components/validation-messages/validation-message";

@Component({
    selector: 'app-validation-messages',
    template: ''
})
export class ValidationMessagesComponentFake {
    @Input() control: AbstractControl | null = null;
    @Input() validationMessages: ValidationMessage[] = [];
}