import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { IonTabs, NavController } from '@ionic/angular';
import { getTaBarPath, TabBarRoute } from './tab-bar-routes';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.page.html',
  styleUrls: ['./tab-bar.page.scss'],
})
export class TabBarPage implements OnInit {

  @ViewChild(IonTabs)
  public tabs: IonTabs;

  constructor(
    private navController: NavController, 
    private searchResultDataService: SearchResultDataService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onTabButtonClicked() {
    const selectedTab = this.tabs.getSelected();
    if (this.router.url.includes(`secure/${selectedTab}/`)) {
      this.navController.navigateBack(`secure/${selectedTab}`);
    } else {
      this.navController.navigateRoot(`secure/${selectedTab}`);
    }
    if (selectedTab !== getTaBarPath(TabBarRoute.WISH_SEARCH, false)) {
      this.searchResultDataService.clear();
    }
  }

}
