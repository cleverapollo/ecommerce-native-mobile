import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

export interface AppLoadingService {
  showLoadingSpinner(): Promise<void>;
  createLoadingSpinner(): Promise<HTMLIonLoadingElement>;
  dismissLoadingSpinner(loading?: HTMLIonLoadingElement): Promise<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingController: LoadingController) { }

  async showLoadingSpinner(): Promise<void> {
    let loading = await this.loadingController.getTop();
    if (!loading) {
      loading = await this.createLoadingSpinner();
      return await loading.present();
    }
  }

  async createLoadingSpinner(): Promise<HTMLIonLoadingElement> {
    return this.loadingController.create({
      spinner: 'circles',
      translucent: true
    })
  }

  async dismissLoadingSpinner(loading?: HTMLIonLoadingElement): Promise<boolean> {
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
