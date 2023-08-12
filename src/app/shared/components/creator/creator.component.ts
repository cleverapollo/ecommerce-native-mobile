import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Share } from '@capacitor/share';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { Logger } from '@core/services/log.service';
import { APP_URL } from '@env/environment';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class CreatorComponent {

  @Input() account!: ContentCreatorAccount;
  @Input() image: Blob | null = null;
  @Input() showShareButton: boolean = false;
  @Input() isLoading = false;

  @Output() isLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private logger: Logger) { }

  async shareAccount(): Promise<void> {
    try {
      await Share.share({
        title: `👉 Folge ${this.account.userName} jetzt auf Wantic`,
        url: `${APP_URL}/creator/${this.account.userName}`,
        text: `🌟 Entdecke fesselnden Wunschlisten auf Wantic! 📝 Folge @${this.account.userName} und entdecke inspirierende Ideen und Empfehlungen, die deine Neugier wecken werden! 📚✈️📱!`
      })
    } catch (error) {
      this.logger.error(error);
    }
  }

}
