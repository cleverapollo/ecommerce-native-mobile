import packageJson from '../../package.json';
import { BackendConfigType } from './backend-config-type';
import { EnvironmentConfig } from './environment.d';

export const appVersion = packageJson.version;

export const environment: EnvironmentConfig = {
    backendType: BackendConfigType.dev,
    production: false,
    debugMessage: 'running on dev environment',
    imageDomain: 'http://localhost:3000',
    serverConfig: {
        networkProtocol: 'http',
        thirdLevelDomain: '',
        secondLevelDomain: 'localhost', // for android and iOS simulators = 10.0.2.2
        port: 3000
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
    }
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}:${serverConfig.port}`;
export const APP_URL = 'http://localhost:8100';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}:${serverConfig.port}`];