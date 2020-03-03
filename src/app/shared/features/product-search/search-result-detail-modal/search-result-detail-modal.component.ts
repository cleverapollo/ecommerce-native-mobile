import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SearchResultItem } from '../search-result-item';

@Component({
  selector: 'app-search-result-detail-modal',
  templateUrl: './search-result-detail-modal.component.html',
  styleUrls: ['./search-result-detail-modal.component.scss'],
})
export class SearchResultDetailModalComponent {

  @Input() searchResultItem: SearchResultItem

  constructor(private modalController: ModalController) { }
  
}
