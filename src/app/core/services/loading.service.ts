import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Logger } from './log.service';

export interface AppLoadingService {
  showLoadingSpinner(): Promise<void>;
  stopLoadingSpinner(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loader: HTMLIonLoadingElement | null = null;
  private isLoading = false;

  constructor(
    private loadingController: LoadingController,
    private logger: Logger
  ) { }

  async showLoadingSpinner(): Promise<void> {
    if (this.isLoading) {
      this.logger.debug('Spinner is already presented!');
      return Promise.resolve();
    }

    try {
      this.loader = await this.loadingController.create({
        spinner: 'circles',
        translucent: true
      });
      await this.loader.present()
      this.isLoading = true;
      return Promise.resolve();
    } catch (error) {
      this.logger.error(error);
      this.loader = null;
      this.isLoading = false;
      return Promise.resolve();
    }
  }

  async stopLoadingSpinner(): Promise<void> {
    if (!this.isLoading) {
      this.logger.debug('Spinner isn\'t presented!');
      return Promise.resolve();
    }
    await this.loader?.dismiss();
    this.loader = null;
    this.isLoading = false;
    return Promise.resolve();
  }

}
