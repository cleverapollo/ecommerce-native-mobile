import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appBackgroundImage]'
})
export class BackgroundImageDirective implements AfterViewInit, OnChanges {

  @Input() src: string | URL;

  private observer: IntersectionObserver;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadBackgroundImage();
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.src && !changes.src.isFirstChange()) {
      this.loadBackgroundImage();
    }
  }

  private loadBackgroundImage(): void {
    this.elementRef.nativeElement.style.backgroundImage = `url(${this.src})`;
  }
}
