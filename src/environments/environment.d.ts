export interface EnvironmentConfig {
    production: boolean,
    debugMessage: string,
    serverConfig: {
        networkProtocol: string,
        thirdLevelDomain?: string,
        secondLevelDomain: string,
        port?: number
    }
}