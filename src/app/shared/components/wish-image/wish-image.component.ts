import { Component, Input, OnInit } from '@angular/core';
import { LogService } from '@core/services/log.service';
import { WISH_ERROR_IMAGE_ASSET_URL, WISH_PLACEHOLDER_IMAGE_ASSET_URL } from '@core/ui.constants';

export interface WishImageComponentStyles {
  img?: CSSStyle;
  placeholderImg?: CSSStyle;
  errorImg?: CSSStyle;
}

enum ImageType {
  NONE,
  WISH_IMAGE,
  PLACEHOLDER,
  ERROR
}

@Component({
  selector: 'app-wish-image',
  templateUrl: './wish-image.component.html',
  styleUrls: ['./wish-image.component.scss'],
})
export class WishImageComponent implements OnInit {

  @Input() src?: string;
  @Input() alt = 'Produktbild';
  @Input() imgClass?: string;
  @Input() styles: WishImageComponentStyles = {};

  private imgType: ImageType = ImageType.NONE;

  isLoading = true;

  get imgStyles(): CSSStyle {
    const fallback = {};
    switch (this.imgType) {
      case ImageType.NONE:
        return fallback;
      case ImageType.WISH_IMAGE:
        return this.styles.img || fallback;
      case ImageType.PLACEHOLDER:
        return this.styles.placeholderImg || fallback;
      case ImageType.ERROR:
        return this.styles.errorImg || fallback;
    }
  }

  constructor(private logger: LogService) {}

  ngOnInit() {
    this.logger.debug('onStart', this.src);
    if (this.src) {
      this.imgType = ImageType.WISH_IMAGE
    } else {
      this.src = WISH_PLACEHOLDER_IMAGE_ASSET_URL;
      this.imgType = ImageType.PLACEHOLDER;
    }
    this.styles = this.styles ? this.styles : { };
    this.imgClass = this.imgClass ? this.imgClass + ' hide' : 'hide';
  }

  onError(event: { target: HTMLImageElement }) {
    this.logger.debug('onError', event);
    this.onComplete();
    this.imgType = ImageType.ERROR;
    event.target.src = WISH_ERROR_IMAGE_ASSET_URL;
    event.target.alt = ''; // ToDo
  }

  onLoad(event: { target: HTMLImageElement }) {
    this.logger.debug('onLoad', event);
    this.onComplete();
  }

  private onComplete() {
    this.isLoading = false;
    this.imgClass = this.imgClass.replace('hide', 'show');
  }

}
