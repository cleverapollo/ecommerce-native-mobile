import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ContentCreatorAccount } from "@core/models/content-creator.model";

@Component({ selector: 'app-creator', template: '' })
export class CreatorComponentFake {
    @Input() account: ContentCreatorAccount;
    @Input() image: Blob | null = null;
    @Input() showShareButton: boolean = false;
    @Input() isLoading = false;

    @Output() isLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}