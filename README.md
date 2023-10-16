# wantic ios, web and android app

Welcome to our Git repository for the ultimate wishlist and wish list management app! Whether you're dreaming of the perfect gift or compiling a list of your most coveted items, our app has got you covered.

## Environments

- **DEV**: Develop / Local environment
- **BETA**: Testing / Staging environment 
- **PROD**: Production

## Setup

- **iOS**: XCode 14, Swift 5
- **Android**: Android Studio Flamingo, Java 17 / Kotlin 1.8
- **Web / Hybrid**: Visual Studio Code, Angular 15, Iconic 7, Capacitor 5, Typescript, Node 18

## Development

Make sure you have node and npm installed on your local maschine. 

```cmd
npm install           // install dependencies 
npm run mock:server   // starts a simple mock server on your local maschine
npm start             // starts the web app on local dev env
```

See scripts in package.json for other commands, like for building an android or ios app. 

### Branching Concept

XXX = JIRA Ticket number

```cmd
master                // current release version
develop               // current develop state 
feature/WANTIC-XXX    // specific feature branch (merged to develop)
bugfix/WANTIC-XXX     // branch for a bugfix which is not urgent (merged to develop)
hotfix/WANTIC-XXX     // branch for bugfix that need to be deployed asap (merged to release branch)
release/X_X_x         // branch to save state for specific app versions, e.g. 1_5_x for v1.5.1, v1.5.2, ...
```

### Android
#### Get Signing Key

The following commands lists all keys inside the keystores (SH1, SH256, ...) in form of hex values.   
Some tools like the Facebook Developer Console needs this keys in form of Base64.    
For that it is necessary to decode the hex value to base64.

- **Debug**: keytool -exportcert -alias androiddebugkey -keystore .android/debug.keystore -list -v
- **Release**: keytool -exportcert -alias <your-alias> -keystore <path-to-keystore> -list -v

#### Test your deep links

Open a shared wish list of an friend.
```
adb.exe -s emulator-5554 shell am start -W -a android.intent.action.VIEW -d wanticbeta://meine-wunschliste/33de35b0-3305-423c-9654-36a92efdf33f io.wantic.app.beta
```

#### Debugging

For older Android studio versions: Use "io.wantic.app.beta E/Capacitor/Console" as regex in LogCat to see the console output from the app.

## Deployment


### Web

Hosted via Firebase Hosting

```
npm run deploy web:beta
npm run deploy web:prod
```

⚠️ Currently there is no CICD pipeline for the deployment. 

## iOS

Hosted via AppStore Connect

⚠️ Currently there is no CICD pipeline for the deployment. 

Deployment is done directly via XCode Organizer. 

## Android

Hosted via Google Play Console

⚠️ Currently there is no CICD pipeline for the deployment. 

1. Build app bundle from Android Studio
2. Upload app bundle to Google Play Console


## Documentation

- [Ionic - Official docs](https://ionicframework.com/docs/)
- [Capacitor - Official docs](https://capacitorjs.com/docs)
- [Capawesome - Capacitor plugins](https://capawesome.io/)
- [Step-By-Step Guide for good git commit messages](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)
- [AASA Validator - ios applink tester](https://branch.io/resources/aasa-validator/)
- [Universal Link (config) validator](https://yurl.chayev.com/)
- [Amazon - Product Advertising API 5.0 Scratchpad](https://webservices.amazon.com/paapi5/scratchpad/index.html)
