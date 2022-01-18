import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.wantic.app',
  appName: 'Wantic',
  bundledWebRuntime: false,
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#ff8d61',
      splashImmersive: true
    }
  },
  cordova: {
    preferences: {
      'ScrollEnabled': 'false',
      'android-minSdkVersion': '19',
      'BackupWebStorage': 'none',
      'SplashMaintainAspectRatio': 'true',
      'FadeSplashScreenDuration': '1000',
      'IOS_GOOGLEUTILITIES_VERSION': '7.4',
      'SplashShowOnlyFirstTime': 'false',
      'SplashScreen': 'screen',
      'SplashScreenDelay': '2000'
    }
  }
};

export default config;
