import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Share } from '@capacitor/share';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { FirebaseService } from '@core/services/firebase.service';
import { Logger } from '@core/services/log.service';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class CreatorComponent {

  @Input() account: ContentCreatorAccount;
  @Input() image: Blob | null = null;
  @Input() showShareButton: boolean = false;
  @Input() isLoading = false;

  @Output() isLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private firebaseService: FirebaseService,
    private logger: Logger
  ) { }

  async shareAccount() {
    try {
      const link = await this.firebaseService.createShortLinkForCreatorAccount(this.account);
      await Share.share({
        url: link
      })
    } catch (error) {
      this.logger.error(error);
    }
  }

}
