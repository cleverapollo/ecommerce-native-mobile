import { EnvironmentConfig } from './environment.d';

export const environment: EnvironmentConfig = {
    production: true,
    debugMessage: 'running on beta environment',
    serverConfig: {
        networkProtocol: 'https',
        secondLevelDomain: 'rest-dev.wantic.io',
    },
    firebaseConfig: {
        apiKey: "AIzaSyDIpjCfUOk-BAs6D7P1UgwMxAUjAzjsHcc",
        authDomain: "wantic-dev.firebaseapp.com",
        databaseURL: "https://wantic-dev.firebaseio.com",
        projectId: "wantic-dev",
        storageBucket: "wantic-dev.appspot.com",
        messagingSenderId: "165303834787",
        appId: "1:165303834787:web:6e136abc3e6200aa330716"
    },
    analyticsConfigured: false
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}`;
export const APP_URL = 'https://app.beta.wantic.io';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}`];
export const appVersion = require('../../package.json').version;