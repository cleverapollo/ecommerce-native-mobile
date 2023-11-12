import { AppAlertService, alertCompletionHandler } from './alert.service';
export class MockAlert {
    public visible: boolean;
    public header: string;
    public message: string;

    constructor(props: any) {
        Object.assign(this, props);
        this.visible = false;
    }

    present() {
        this.visible = true;
        return Promise.resolve();
    }

    dismiss() {
        this.visible = false;
        return Promise.resolve();
    }

}

export class MockAlertController {

    public created: MockAlert[];

    constructor() {
        this.created = [];
    }

    create(props: any): Promise<any> {
        const toRet = new MockAlert(props);
        this.created.push(toRet);
        return Promise.resolve(toRet);
    }

    getLast() {
        if (!this.created.length) {
            return null;
        }
        return this.created[this.created.length - 1];
    }
}

export class MockAlertService implements AppAlertService {

    private alertController = new MockAlertController();

    createDeleteAlert(header: string, message: string, confirmDeletionHandler: alertCompletionHandler): Promise<HTMLIonAlertElement> {
        const alert = this.alertController.create({ header, message });
        alert.then(() => {
            confirmDeletionHandler(true);
        });
        return alert;
    }

    createActionAlert(header: string, message: string, actionBtnText: string, actionHandler: alertCompletionHandler): Promise<HTMLIonAlertElement> {
        const alert = this.alertController.create({ header, message });
        alert.then(() => {
            actionHandler(true);
        });
        return alert;
    }

}