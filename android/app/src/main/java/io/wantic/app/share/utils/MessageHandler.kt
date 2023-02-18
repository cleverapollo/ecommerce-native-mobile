package io.wantic.app.share.utils

import android.os.Handler
import android.os.Looper
import android.os.Message
import android.util.Log
import android.view.View
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.core.extensions.isInForeground

class MessageHandler(private val activity: SelectProductImageActivity) :
    Handler(Looper.getMainLooper()) {

    companion object {
        private const val LOG_TAG: String = "MessageHandler"
    }

    override fun handleMessage(msg: Message) {
        Log.d(LOG_TAG, "Handle message $msg")

        if (!activity.isInForeground()) {
            Log.d(LOG_TAG, "Stopped further processing, Activity is not in the foreground ")
            return
        }

        if (activity.loadingSpinner.visibility == View.GONE) {
            Log.d(LOG_TAG, "Loading already completed, skipped message handling")
            return
        }

        activity.stopLoading()

        if (activity.webCrawlerResult == null) {
            Log.d(LOG_TAG, "No content was scraped, continue with fallback")
            activity.navigateForward(null)
            return
        }

        if (activity.webCrawlerResult!!.images.isEmpty()) {
            Log.d(LOG_TAG, "No images were scraped, continue with fallback")
            activity.navigateForward(null)
            return
        }

    }
}