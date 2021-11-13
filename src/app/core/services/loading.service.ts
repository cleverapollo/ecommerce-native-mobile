import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingController: LoadingController) { }

  async showLoadingSpinner() {
    let loading = await this.loadingController.getTop();
    if (!loading) {
      loading = await this.createLoadingSpinner();
      return await loading.present();
    }
  }

  async createLoadingSpinner() {
    return this.loadingController.create({
      spinner: 'circles',
      translucent: true
    })
  }

  async dismissLoadingSpinner(loading?: HTMLIonLoadingElement) {
    if (loading) {
      return await loading.dismiss()
    } else {
      const topLoadingElement = await this.loadingController.getTop();
      if (topLoadingElement) {
        return await topLoadingElement.dismiss();
      } else {
        return Promise.resolve(true);
      }
    }
  }

}
