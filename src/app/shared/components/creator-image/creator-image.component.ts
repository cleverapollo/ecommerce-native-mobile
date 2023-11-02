import { Component, Input, OnInit } from '@angular/core';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { ContentCreatorAccount } from '@core/models/content-creator.model';

const defaultImage = {
  alt: `Silhouette des Kopfes einer Person`,
  src: 'https://ionicframework.com/docs/img/demos/avatar.svg'
}

@Component({
  selector: 'app-creator-image',
  templateUrl: './creator-image.component.html',
  styleUrls: ['./creator-image.component.scss'],
})
export class CreatorImageComponent implements OnInit {

  @Input() creator: ContentCreatorAccount;
  @Input() avatarClass?: string;

  alt: string = defaultImage.alt;
  src: string = defaultImage.src;
  isLoading = false;
  imgClass: string = 'hide';

  constructor(private readonly creatorApiService: ContentCreatorApiService) { }

  ngOnInit() {
    if (this.creator.hasImage) {
      this.src = this.creatorApiService.getPublicImageUrl(this.creator.userName);
      this.alt = `Profilbild von ${this.creator.userName}`;
    }
  }

  onError(event: { target: EventTarget }) {
    this.onComplete();
    (event.target as HTMLImageElement).src = defaultImage.src;
    (event.target as HTMLImageElement).alt = defaultImage.alt;
  }

  onLoad(event: { target: EventTarget }) {
    this.onComplete();
  }

  private onComplete() {
    this.isLoading = false;
    this.imgClass = this.imgClass.replace('hide', 'show');
  }

}
