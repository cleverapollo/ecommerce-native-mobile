import UIKit
import Capacitor
import Firebase
import FBSDKCoreKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        ApplicationDelegate.shared.application(
              application,
              didFinishLaunchingWithOptions: launchOptions
        )
        return true
    }
    
    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
        enableCrossAppAuthSharingIfNeeded()
    }
    
    private func enableCrossAppAuthSharingIfNeeded() {
        guard let _ = FirebaseApp.app(), let user = Auth.auth().currentUser, let accessGroup = getAccessGroup() else {
            return
        }
        
        var tempUser: User?
        do {
            try tempUser = Auth.auth().getStoredUser(forAccessGroup: accessGroup)
        } catch let error as NSError {
            print("Error getting stored user: %@", error)
        }
        
        if tempUser == nil {
            do {
                try Auth.auth().useUserAccessGroup(accessGroup)
                Auth.auth().updateCurrentUser(user) { error  in
                    print("Error update current user: %@", error?.localizedDescription ?? "")
                }
            } catch let error as NSError {
                print("Error changing user access group: %@", error)
            }
        }
    }
    
    private func getAccessGroup() -> String? {
        guard let bundleIdentifier = Bundle.main.bundleIdentifier else {
            print("Error getting bundleIdentifier")
            return nil
        }
        return "3LDV8B8SZ2.\(bundleIdentifier)"
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        if ApplicationDelegate.shared.application(
          app,
          open: url,
          sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String,
          annotation: options[UIApplication.OpenURLOptionsKey.annotation]
       ) {
          return true
       } else {
          return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
       }
    }
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    
}


