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
        this.createLoadingSpinner().then(loading => 
          loading.present()
        );
      }
    })
  }

  private createLoadingSpinner() {
    return this.loadingController.create({
      spinner: 'circles',
      translucent: true
    })
  }

  dismissLoadingSpinner() {
    this.loadingController.getTop().then((loading) => {
      loading.dismiss();
    })
  }

}
