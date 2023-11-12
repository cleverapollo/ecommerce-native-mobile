import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

export type alertCompletionHandler = (value: any) => boolean | void | {[key: string]: any;}
export interface AppAlertService {
  createDeleteAlert(header: string, message: string, confirmDeletionHandler: alertCompletionHandler) : Promise<HTMLIonAlertElement>;
  createActionAlert(header: string, message: string, actionBtnText: string, actionHandler: alertCompletionHandler): Promise<HTMLIonAlertElement>;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  createDeleteAlert(header: string, message: string, confirmDeletionHandler: alertCompletionHandler): Promise<HTMLIonAlertElement> {
    return this.alertController.create({
      header,
      message,
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

  createActionAlert(header: string, message: string, actionBtnText: string, actionHandler: alertCompletionHandler): Promise<HTMLIonAlertElement> {
    return this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: actionBtnText,
          role: 'confirm',
          handler: actionHandler
        }
      ]
    })
  }

}
