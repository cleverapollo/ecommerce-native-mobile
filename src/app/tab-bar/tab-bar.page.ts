import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from '@core/services/navigation.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { IonTabs } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.page.html',
  styleUrls: ['./tab-bar.page.scss'],
})
export class TabBarPage implements OnInit, OnDestroy {

  @ViewChild(IonTabs)
  public tabs: IonTabs;

  isCreatorAccountActive: boolean = false;

  private subscription: Subscription;

  constructor(
    private readonly navService: NavigationService,
    private readonly searchResultDataService: SearchResultDataService,
    private readonly userStore: UserProfileStore
  ) { }

  ngOnInit(): void {
    this.subscription = this.userStore.isCreatorAccountActive$.subscribe(isCreatorAccountActive => {
      this.isCreatorAccountActive = isCreatorAccountActive;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onTabButtonClicked(selectedTab: string) {
    this.navService.root(`secure/${selectedTab}`);
    this.searchResultDataService.clear();
  }

}
