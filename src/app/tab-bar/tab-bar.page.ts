import { Component, ViewChild } from '@angular/core';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { IonTabs, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.page.html',
  styleUrls: ['./tab-bar.page.scss'],
})
export class TabBarPage {

  @ViewChild(IonTabs)
  public tabs: IonTabs;

  constructor(
    private navController: NavController,
    private searchResultDataService: SearchResultDataService
  ) { }

  onTabButtonClicked() {
    const selectedTab = this.tabs.getSelected();
    this.navController.navigateRoot(`secure/${selectedTab}`);
    this.searchResultDataService.clear();
  }

}
