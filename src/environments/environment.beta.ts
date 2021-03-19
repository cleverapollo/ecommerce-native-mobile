import { EnvironmentConfig } from './environment.d';

export const environment: EnvironmentConfig = {
    production: true,
    debugMessage: 'running on beta environment',
    serverConfig: {
        networkProtocol: 'https',
        secondLevelDomain: 'wantic-rest-api-fddlidpl2q-ew.a.run.app',
    },
    analyticsConfigured: false
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}`;
export const APP_URL = 'https://app.beta.wantic.io';
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}`];