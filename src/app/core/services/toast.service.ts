import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private static TOAST_DURATION = 3000

  constructor(private toastController: ToastController) { }

  async presentSuccessToast(message: string) {
    this.presentToast(message, 'success');
  }

  async presentErrorToast(message: string) {
    this.presentToast(message, 'danger');
  }

  async presentInfoToast(message: string) {
    this.presentToast(message, 'primary');
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: ToastService.TOAST_DURATION,
      position: 'top',
      cssClass: 'center-text'
    });
    toast.present();
  }
}
