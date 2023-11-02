import packageJson from '../../package.json';
import { BackendConfigType } from './backend-config-type';
import { EnvironmentConfig } from './environment.d';

export const appVersion = packageJson.version;

export const environment: EnvironmentConfig = {
  backendType: BackendConfigType.prod,
  production: true,
  debugMessage: 'running on prod environment',
  imageDomain: 'https://rest-prd.wantic.io',
  serverConfig: {
    networkProtocol: 'https',
    secondLevelDomain: 'rest-prd.wantic.io',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyBokQ5eUvMeNum-0XN06RxxE8eypufVDjg',
    authDomain: 'wantic-prd.firebaseapp.com',
    databaseURL: 'https://wantic-prd.firebaseio.com',
    projectId: 'wantic-prd',
    storageBucket: 'wantic-prd.appspot.com',
    messagingSenderId: '553198243306',
    appId: '1:553198243306:web:5b9f05bbb60fb8528c3693',
    measurementId: 'G-KW4T4N2DQE'
  },
  appsflyerConfig: {
    devKey: 's8xKbYNUpxszQP8CWguA5L',
    appID: '1536006626',
    isDebug: false
  }
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}`;
export const APP_URL = 'https://app.wantic.io';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}`];