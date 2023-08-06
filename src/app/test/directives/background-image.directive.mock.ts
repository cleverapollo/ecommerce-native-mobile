import { Directive, Input } from "@angular/core";

@Directive({
    selector: '[appBackgroundImage]'
})
export class BackgroundImageDirectiveFake {

    @Input() src: string | URL;
}