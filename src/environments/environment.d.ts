export interface EnvironmentConfig {
    production: boolean,
    debugMessage: string,
    serverConfig: {
        networkProtocol: string,
        thirdLevelDomain?: string,
        secondLevelDomain: string,
        port?: number
    },
    analyticsConfigured: boolean,
    firebaseConfig?: {
        apiKey: string,
        authDomain: string,
        databaseURL: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string,
        appId: string,
        measurementId: string
      }
}