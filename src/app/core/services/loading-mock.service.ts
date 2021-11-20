import { AppLoadingService } from "./loading.service";

export class MockLoadingService implements AppLoadingService {

    private loadingController = new MockLoadingController();
    private loading: MockLoading = null;

    async showLoadingSpinner(): Promise<void> {
        return Promise.resolve();
    }
    async createLoadingSpinner(): Promise<any> {
        return await this.loadingController.create(null);
    }
    async dismissLoadingSpinner(loading?: any): Promise<boolean> {
        if (loading && loading instanceof MockLoading) {
            await loading?.dismiss();
            return Promise.resolve(true);
        } else if (this.loading) {
            this.loading.dismiss();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}

export class MockLoading {
    public visible: boolean;

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

export class MockLoadingController {

    public created: MockLoading[];

    constructor() {
        this.created = [];
    }

    create(props: any): Promise<MockLoading> {
        const toRet = new MockLoading(props);
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