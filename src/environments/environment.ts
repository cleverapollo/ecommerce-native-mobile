// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { EnvironmentConfig } from './environment.d';
import packageJson from '../../package.json';
import { BackendConfigType } from './backend-config-type';

export const appVersion = packageJson.version;
export const environment: EnvironmentConfig = {
  backendType: BackendConfigType.unknown,
  production: false,
  debugMessage: '',
  serverConfig: {
    networkProtocol: '',
    secondLevelDomain: '',
  },
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  angularFire: {
    APP_NAME: 'wantic',
    APP_VERSION: appVersion,
    DEBUG_MODE: false
  },
  googleSignInAndroidClientId: ''
};

export const SERVER_URL = '';
export const APP_URL = '';
export const WHITELISTED_DOMAINS = [];

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
