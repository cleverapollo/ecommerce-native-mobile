import { EnvironmentConfig } from './environment.d';
import { version } from './../../package.json'
import { BackendConfigType } from './backend-config-type';

export const appVersion = version;

export const environment: EnvironmentConfig = {
    backendType: BackendConfigType.dev,
    production: false,
    debugMessage: 'running on dev environment',
    serverConfig: {
        networkProtocol: 'http',
        thirdLevelDomain: '',
        secondLevelDomain: 'localhost', // for android and iOS simulators = 10.0.2.2
        port: 8080
    },
    firebaseConfig: {
        apiKey: "AIzaSyDIpjCfUOk-BAs6D7P1UgwMxAUjAzjsHcc",
        authDomain: "wantic-dev.firebaseapp.com",
        databaseURL: "https://wantic-dev.firebaseio.com",
        projectId: "wantic-dev",
        storageBucket: "wantic-dev.appspot.com",
        messagingSenderId: "165303834787",
        appId: "1:165303834787:web:6e136abc3e6200aa330716",
        measurementId: "G-33SQBGEXZM"
    },
    angularFire: {
        APP_NAME: 'wantic beta',
        APP_VERSION: appVersion,
        DEBUG_MODE: true
    },
    googleSignInAndroidClientId: '165303834787-52s37du1t3jvojlfm0tscgopttu27p03.apps.googleusercontent.com',
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}:${serverConfig.port}`;
export const APP_URL = 'http://localhost:8100';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}:${serverConfig.port}`];