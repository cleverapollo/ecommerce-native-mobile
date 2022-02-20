import Foundation
import FirebaseAnalytics

protocol ScreenTracking {
    
    static func logScreenEvent(_ screenName: String)
}

struct FirebaseAnalytics: ScreenTracking {
    
    static func logScreenEvent(_ screenName: String) {
        
        Analytics.logEvent(AnalyticsEventScreenView, parameters: [
            AnalyticsParameterScreenName: screenName
        ])
    }
}
