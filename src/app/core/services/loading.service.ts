import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingController: LoadingController) { }

  showLoadingSpinner() {
    this.loadingController.getTop().then(hasLoading => {
      if (!hasLoading) {
        this.loadingController.create({
          spinner: 'circles',
          translucent: true
        }).then(loading => loading.present());
      }
    })
  }

  dismissLoadingSpinner() {
    this.loadingController.getTop().then(hasLoading => {
      if (hasLoading) {
        this.loadingController.dismiss();
      }
    })
  }
}
