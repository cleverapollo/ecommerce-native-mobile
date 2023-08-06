import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-photo',
    template: ''
})
export class PhotoComponentFake {
    @Input() src = null;
    @Input() size: 's' | 'm' | 'l' = 'l';
    @Input() readOnly = false;
    @Input() fileName?: string;

    @Output() fileChanged = new EventEmitter<ArrayBuffer>();
    @Output() fileDeleted = new EventEmitter<void>();
}