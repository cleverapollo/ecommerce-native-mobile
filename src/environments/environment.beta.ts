import { EnvironmentConfig } from './environment.d';

export const environment: EnvironmentConfig = {
    production: false,
    debugMessage: 'running on beta environment',
    serverConfig: {
        networkProtocol: 'https',
        secondLevelDomain: 'wantic-rest-api-fddlidpl2q-ew.a.run.app',
    }
};

const serverConfig = environment.serverConfig;
export const SERVER_URL = `${serverConfig.networkProtocol}://${serverConfig.secondLevelDomain}`;