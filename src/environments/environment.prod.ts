import { EnvironmentConfig } from './environment.d';

export const environment : EnvironmentConfig = {
  production: true,
  debugMessage: 'running on prod environment',
  serverConfig: {
    networkProtocol: 'https', 
    secondLevelDomain: 'wantic-rest-api-fddlidpl2q-ew.a.run.app', // ToDo: change to prod url
  }
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}`;
export const APP_URL = 'https://www.app.wantic.io';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}`];