import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  createDeleteAlert(header: string, message: string, confirmDeletionHandler: (value: any) => boolean | void | {[key: string]: any;}) {
    return this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Ja',
          role: 'ok',
          handler: confirmDeletionHandler
        },
        {
          text: 'Nein',
          role: 'cancel'
        }
      ]
    });
  }

}
