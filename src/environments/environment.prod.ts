import { EnvironmentConfig } from './environment.d';

export const environment : EnvironmentConfig = {
  production: true,
  debugMessage: 'running on prod environment',
  serverConfig: {
    networkProtocol: 'TBD',
    secondLevelDomain: 'TBD',
}
};

export const SERVER_URL = '';
export const WHITELISTED_DOMAINS = [`${environment.serverConfig.secondLevelDomain}`];