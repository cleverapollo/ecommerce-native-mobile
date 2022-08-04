import { ToastService } from './toast.service';

export class MockToastService implements ToastService {
    presentSuccessToast(message: string): Promise<void> {
        return Promise.resolve();
    }
    presentErrorToast(message: string): Promise<void> {
        return Promise.resolve();
    }
    presentInfoToast(message: string): Promise<void> {
        return Promise.resolve();
    }
}