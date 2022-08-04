import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export interface ToastService {
  presentSuccessToast(message: string): Promise<void>;
  presentErrorToast(message: string): Promise<void>;
  presentInfoToast(message: string): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class CoreToastService implements ToastService {

  private static TOAST_DURATION = 3000

  constructor(private toastController: ToastController) { }

  async presentSuccessToast(message: string) {
    this.presentToast(message, 'success', 'checkmark-outline');
  }

  async presentErrorToast(message: string) {
    this.presentToast(message, 'danger', 'close-outline');
  }

  async presentInfoToast(message: string) {
    this.presentToast(message, 'primary', 'information-outline');
  }

  private async presentToast(message: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: CoreToastService.TOAST_DURATION,
      position: 'top',
      icon
    });
    toast.present();
  }
}
