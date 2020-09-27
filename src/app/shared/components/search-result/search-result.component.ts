import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { ModalController } from '@ionic/angular';
import { SearchResultDetailModalComponent } from '@shared/components/search-result-detail-modal/search-result-detail-modal.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  @Input() wish: SearchResultItem
  @Output() onSelectWish = new EventEmitter<SearchResultItem>();

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  selectWish() {
    this.onSelectWish.emit(this.wish);
  }

  showDetails() {
    console.log('show details');
    this.modalController.create({
      component: SearchResultDetailModalComponent,
      componentProps: {
        searchResultItem: this.wish
      },
      cssClass: 'wantic-modal'
    }).then( (modal) => {
      modal.present();
    })
  }

}
