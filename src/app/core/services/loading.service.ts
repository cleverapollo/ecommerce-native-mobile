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
      await loading.present();
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
      await loading.dismiss()
    } else {
      const topLoadingElement = await this.loadingController.getTop();
      if (topLoadingElement) {
        await topLoadingElement.dismiss();
      } else {
        await this.loadingController.dismiss();
      }
    }
  }

}
