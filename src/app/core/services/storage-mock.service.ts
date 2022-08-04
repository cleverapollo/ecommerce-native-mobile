import { Storage } from './storage.service';

export class MockStorageService implements Storage {

    getResult: any = null;
    setResult: any = null;
    removeResult: any = null;
    clearResult: any = null;

    get<T>(storageKey: string, secure: boolean): Promise<T> {
        if (this.getResult == null) {
            return Promise.reject();
        }
        return Promise.resolve(this.getResult);
    }
    set(storageKey: string, value: any, secure: boolean): Promise<void> {
        if (this.setResult == null) {
            return Promise.reject();
        }
        return Promise.resolve(this.setResult);
    }
    remove(storageKey: string, secure: boolean): Promise<void> {
        if (this.removeResult == null) {
            return Promise.reject();
        }
        return Promise.resolve(this.removeResult);
    }
    clear(): Promise<void> {
        if (this.clearResult == null) {
            return Promise.reject();
        }
        return Promise.resolve(this.clearResult);
    }
}