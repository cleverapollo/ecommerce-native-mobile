import packageJson from '../../package.json';
import { BackendConfigType } from './backend-config-type';
import { EnvironmentConfig } from './environment.d';

export const appVersion = packageJson.version;

export const environment: EnvironmentConfig = {
    backendType: BackendConfigType.beta,
    production: false,
    debugMessage: 'running on beta environment',
    imageDomain: 'https://rest-dev.wantic.io',
    serverConfig: {
        networkProtocol: 'https',
        secondLevelDomain: 'rest-dev.wantic.io',
    },
    firebaseConfig: {
        apiKey: 'AIzaSyDIpjCfUOk-BAs6D7P1UgwMxAUjAzjsHcc',
        authDomain: 'wantic-dev.firebaseapp.com',
        databaseURL: 'https://wantic-dev.firebaseio.com',
        projectId: 'wantic-dev',
        storageBucket: 'wantic-dev.appspot.com',
        messagingSenderId: '165303834787',
        appId: '1:165303834787:web:6e136abc3e6200aa330716',
        measurementId: 'G-33SQBGEXZM'
    },
    appsflyerConfig: {
        devKey: 's8xKbYNUpxszQP8CWguA5L',
        appID: '1560563821',
        isDebug: true
    }
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}`;
export const APP_URL = 'https://app.beta.wantic.io';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}`];