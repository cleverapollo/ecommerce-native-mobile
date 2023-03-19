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

## Debugging

Use "io.wantic.app.beta E/Capacitor/Console" as regex in LogCat to see the console output from the app.

# Hosting

- Web: Firebase Hosting
- iOS: AppStore Connect
- Android: Google Play Console
