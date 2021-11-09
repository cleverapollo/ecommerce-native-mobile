import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { IonTabs, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.page.html',
  styleUrls: ['./tab-bar.page.scss'],
})
export class TabBarPage implements OnInit, OnDestroy {

  @ViewChild(IonTabs)
  public tabs: IonTabs;

  constructor(
    private navController: NavController, 
    private searchResultDataService: SearchResultDataService,
    private router: Router,
    private logger: LogService
  ) { }

  ngOnInit() {}

  ngOnDestroy() {}

  onTabButtonClicked() {
    const selectedTab = this.tabs.getSelected();
    this.navController.navigateRoot(`secure/${selectedTab}`);
    this.searchResultDataService.clear();
  }

}
