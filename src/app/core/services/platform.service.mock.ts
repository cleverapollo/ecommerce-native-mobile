import { OperatingSystem } from "./platform.service";

export class PlatformMockService implements OperatingSystem {

    private _isIOS: boolean;
    private _isAndroid: boolean;
    private _isWeb: boolean;

    get isIOS(): boolean {
        return this._isIOS;
    }
    get isAndroid(): boolean {
        return this._isAndroid;
    }
    get isWeb(): boolean {
        return this._isWeb;
    }
    get isNativePlatform(): boolean {
        return this.isIOS || this.isAndroid;
    }

    isReady(): Promise<string> {
        return Promise.resolve('Platform is ready');
    }

    hideKeyBoard(): void { }

    setupAndroid() {
        this._isIOS = false;
        this._isAndroid = true;
        this._isWeb = false;
    }

    setupIOS() {
        this._isIOS = true;
        this._isAndroid = false;
        this._isWeb = false;
    }

    setupWeb() {
        this._isIOS = false;
        this._isAndroid = false;
        this._isWeb = true;
    }

}