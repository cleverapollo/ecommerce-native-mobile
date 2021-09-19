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
    firebaseConfig?: {
        apiKey: string,
        authDomain: string,
        databaseURL: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string,
        appId: string,
        measurementId?: string // only configured if analytics is enabled
    },
    googleSignInAndroidClientId?: string,
    appsflyerConfig?: {
        devKey: string,
        appId: string
    }
}
