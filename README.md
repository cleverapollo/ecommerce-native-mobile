# Wantic Client

- Angular 
- Ionic
- Capacitor

**Enviroments**

ENV
- dev: development against server on local maschine
- beta: development against beta server
- prod: development against prod server

`ionic serve --configuration=${ENV}`

OS
- android
- ios

`ionic cordova run ${OS} -l --configuration=${ENV}`

# Android

keytool -exportcert -alias androiddebugkey -keystore .android/debug.keystore -list -v

## Hosting

- Web: Firebase Hosting
- iOS: AppStore Connect
- Android: TBD

## Sources and references

- [How to Build an Ionic HTTP Loading Interceptor & Retry Logic](https://www.youtube.com/watch?v=IJWCpa_-MeU)
- [Ionic Development Tips](https://ionicframework.com/docs/developing/tips)

