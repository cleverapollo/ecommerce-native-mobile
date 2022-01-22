package io.wantic.app.share.core.analytics

import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.analytics.ktx.logEvent
import com.google.firebase.ktx.Firebase

object GoogleAnalytics : AnalyticsTracking {

    private lateinit var firebaseAnalytics: FirebaseAnalytics

    /**
     * Call this method in onCreate method of your activity.
     */
    fun init(): GoogleAnalytics {
        firebaseAnalytics = Firebase.analytics
        return this
    }

    override fun logScreenEvent(screenName: String) {
        firebaseAnalytics.logEvent(FirebaseAnalytics.Event.SCREEN_VIEW) {
            param(FirebaseAnalytics.Param.SCREEN_NAME, screenName)
        }
    }
}