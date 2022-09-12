import { ElementRef, QueryList } from "@angular/core";

export class Masonry {

    isResizing = false;

    private readonly ROW_GAP = 10;
    private readonly ROW_HEIGHT = 1;

    constructor(
        private instance: ElementRef<HTMLDivElement>,
        private bricks: QueryList<ElementRef<HTMLDivElement>>
    ) {}

    resizeBricks() {
        this.isResizing = true;

        this.instance.nativeElement.style.gridAutoRows = 'auto';
        this.instance.nativeElement.style.alignItems = 'self-start';

        this.bricks.forEach((brick, idx) => {
            brick.nativeElement.style.gridRowEnd = `span ${Math.ceil(
                (brick.nativeElement.offsetHeight + this.ROW_GAP) / (this.ROW_HEIGHT + this.ROW_GAP)
            )}`;
            if (idx === this.bricks.length - 1) {
                this.isResizing = false;
            }
        });

        this.instance.nativeElement.removeAttribute('style');
    }

}