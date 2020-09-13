import { EnvironmentConfig } from './environment.d';

export const environment: EnvironmentConfig = {
    production: false,
    debugMessage: 'running on dev environment',
    serverConfig: {
        networkProtocol: 'http',
        thirdLevelDomain: '',
        secondLevelDomain: '10.0.2.2',
        port: 8080
    }
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}:${serverConfig.port}`;
export const WHITELISTED_DOMAINS = [`${serverConfig.secondLevelDomain}:${serverConfig.port}`];