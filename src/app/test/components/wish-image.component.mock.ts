import { Component, Input } from "@angular/core";
import { WishImageComponentStyles } from "@shared/components/wish-image/wish-image.component";

@Component({
    selector: 'app-wish-image',
    template: ''
})
export class WishImageComponentFake {
    @Input() src?: string;
    @Input() alt = 'Produktbild';
    @Input() imgClass?: string;
    @Input() styles: WishImageComponentStyles = {};
}