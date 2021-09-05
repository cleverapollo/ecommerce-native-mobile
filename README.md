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
## Get Signing Key

The following commands lists all keys inside the keystores (SH1, SH256, ...) in form of hex values.   
Some tools like the Facebook Developer Console needs this keys in form of Base64.    
For that it is necessary to decode the hex value to base64.

- Debug: keytool -exportcert -alias androiddebugkey -keystore .android/debug.keystore -list -v
- Release: keytool -exportcert -alias <your-alias> -keystore <path-to-keystore> -list -v

## Test your deep links


Open a shared wish list of an friend.
```
adb.exe -s emulator-5554 shell am start -W -a android.intent.action.VIEW -d wanticbeta://meine-wunschliste/33de35b0-3305-423c-9654-36a92efdf33f io.wantic.app.beta
```

# Hosting

- Web: Firebase Hosting
- iOS: AppStore Connect
- Android: Google Play Console

# Cordova/Capacitor Plugins

## Authentication

- [Cordova plugin for Firebase Authentication](https://github.com/chemerisuk/cordova-plugin-firebase-authentication)
- [Google Sign-In Cordova/PhoneGap Plugin](https://github.com/EddyVerbruggen/cordova-plugin-googleplus)
- [cordova-plugin-facebook-connect](https://github.com/cordova-plugin-facebook-connect/cordova-plugin-facebook-connect)
- [cordova-plugin-sign-in-with-apple](https://github.com/cordova-plugin-facebook-connect/cordova-plugin-facebook-connect)

## Analytics

- [Cordova AppsFlyer plugin for Android and iOS](https://github.com/AppsFlyerSDK/appsflyer-cordova-plugin)
- [Cordova plugin for Firebase Analytics](https://github.com/chemerisuk/cordova-plugin-firebase-analytics)

## Network

- [Cordova Advanced HTTP](https://github.com/silkimen/cordova-plugin-advanced-http)
- [angular-jwt](https://github.com/auth0/angular2-jwt)

## Storage

- [capacitor-secure-storage-plugin](https://github.com/martinkasa/capacitor-secure-storage-plugin)
- [Ionic cache service](https://github.com/Nodonisko/ionic-cache)

# Sources and references

- [How to Build an Ionic HTTP Loading Interceptor & Retry Logic](https://www.youtube.com/watch?v=IJWCpa_-MeU)
- [Ionic Development Tips](https://ionicframework.com/docs/developing/tips)
- [Android: Create Deep Links to App Content](https://developer.android.com/training/app-links/deep-linking)

