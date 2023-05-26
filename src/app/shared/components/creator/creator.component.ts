import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Share } from '@capacitor/share';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { FirebaseService } from '@core/services/firebase.service';
import { Logger } from '@core/services/log.service';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class CreatorComponent implements OnInit {

  @Input() account: ContentCreatorAccount;
  @Input() showShareButton: boolean = false;
  @Input() isLoading = false;

  @Output() isLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: Logger,
  ) { }

  ngOnInit() { }

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
