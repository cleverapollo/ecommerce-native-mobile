import { AppLoadingService } from './loading.service';

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
export class MockLoadingService implements AppLoadingService {

    private loadingController = new MockLoadingController();
    private loading?: MockLoading | null;

    async showLoadingSpinner(): Promise<void> {
        this.loading = await this.loadingController.create(null);
        return Promise.resolve();
    }
    async stopLoadingSpinner(): Promise<void> {
        if (this.loading) {
            await this.loading?.dismiss();
        }
        return Promise.resolve();
    }
}