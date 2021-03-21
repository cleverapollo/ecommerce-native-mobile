import { EnvironmentConfig } from './environment.d';

export const environment : EnvironmentConfig = {
  production: true,
  debugMessage: 'running on prod environment',
  serverConfig: {
    networkProtocol: 'https', 
    secondLevelDomain: 'wantic-rest-api-nl4f7l4v3q-ew.a.run.app',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyBokQ5eUvMeNum-0XN06RxxE8eypufVDjg',
    authDomain: 'wantic-prd.firebaseapp.com',
    databaseURL: 'https://wantic-prd.firebaseio.com',
    projectId: 'wantic-prd',
    storageBucket: 'wantic-prd.appspot.com',
    messagingSenderId: '553198243306',
    appId: '1:553198243306:web:63be133f670f95908c3693',
    measurementId: 'G-DZ99Y0YVF0'
  },
  analyticsConfigured: true
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}`;
export const APP_URL = 'https://www.app.wantic.io';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}`];