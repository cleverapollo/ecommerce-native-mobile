import { EnvironmentConfig } from './environment.d';

export const environment : EnvironmentConfig = {
  production: true,
  debugMessage: 'running on prod environment',
  serverConfig: {
    networkProtocol: 'https', 
    secondLevelDomain: 'wantic-rest-api-fddlidpl2q-ew.a.run.app', // ToDo: change to prod url
  }
};

export const SERVER_URL = '';
export const WHITELISTED_DOMAINS = [`${environment.serverConfig.secondLevelDomain}`];