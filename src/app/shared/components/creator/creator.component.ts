import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentCreatorAccount, SocialMedia } from '@core/models/content-creator.model';
import { BrowserService } from '@core/services/browser.service';
import { Logger } from '@core/services/log.service';
import { APP_URL } from '@env/environment';
import { shareLink } from '@shared/helpers/share.helper';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class CreatorComponent {

  @Input() account!: ContentCreatorAccount;
  @Input() image: Blob | null = null;
  @Input() isLoading = false;

  @Output() isLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private logger: Logger, private browser: BrowserService) { }

  shareAccount(): void {
    shareLink(
      `${APP_URL}/creator/${this.account.userName}`,
      `👉 Folge ${this.account.userName} jetzt auf Wantic`,
      `🌟 Entdecke fesselnden Wunschlisten auf Wantic! 📝 Folge @${this.account.userName} und entdecke inspirierende Ideen und Empfehlungen, die deine Neugier wecken werden! 📚✈️📱!`
    ).catch(error => this.logger.error(error));
  }

  hasAnyLink(): boolean {
    return this.hasLink(SocialMedia.Facebook) ||
      this.hasLink(SocialMedia.TikTok) ||
      this.hasLink(SocialMedia.Instagram) ||
      this.hasLink(SocialMedia.YouTube)
  }

  hasLink(socialMedia: string): boolean {
    switch (socialMedia) {
      case SocialMedia.Facebook:
        return !!this.account.socialMediaLinks?.facebookUrl;
      case SocialMedia.TikTok:
        return !!this.account.socialMediaLinks?.tiktokUrl;
      case SocialMedia.Instagram:
        return !!this.account.socialMediaLinks?.instagramUrl;
      case SocialMedia.YouTube:
        return !!this.account.socialMediaLinks?.youtubeUrl;
      default: return false;
    }
  }

  openLink(socialMedia: string): boolean {
    switch (socialMedia) {
      case SocialMedia.Facebook:
        this.browser.openSystemBrowser(this.account.socialMediaLinks.facebookUrl);
        break;
      case SocialMedia.TikTok:
        this.browser.openSystemBrowser(this.account.socialMediaLinks.tiktokUrl);
        break;
      case SocialMedia.Instagram:
        this.browser.openSystemBrowser(this.account.socialMediaLinks.instagramUrl);
        break;
      case SocialMedia.YouTube:
        this.browser.openSystemBrowser(this.account.socialMediaLinks.youtubeUrl);
        break;
      default: return false;
    }
  }

}
