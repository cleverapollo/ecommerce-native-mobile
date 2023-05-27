import { Component, Input } from "@angular/core";
import { ContentCreatorAccount } from "@core/models/content-creator.model";

@Component({ selector: 'app-creator', template: '' })
export class CreatorComponentFake {
    @Input() account: ContentCreatorAccount;
}