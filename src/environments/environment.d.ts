
import { AFInit } from "appsflyer-capacitor-plugin";
import { FirebaseOptions } from "firebase/app";
import { BackendConfigType } from "./backend-config-type";
export interface EnvironmentConfig {
    backendType: BackendConfigType,
    production: boolean,
    debugMessage: string,
    serverConfig: {
        networkProtocol: string,
        thirdLevelDomain?: string,
        secondLevelDomain: string,
        port?: number
    },
    firebaseConfig: FirebaseOptions,
    angularFire: {
        APP_NAME: string,
        APP_VERSION: string,
        DEBUG_MODE: boolean
    },
    googleSignInAndroidClientId?: string,
    appsflyerConfig?: AFInit,
    android: {
        packageName: string;
    },
    ios: {
        bundleId: string,
        appStoreId: string
    },
    dynamicLinksDomain: string
}
