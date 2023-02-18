package io.wantic.app.share.core.web

import android.os.Handler
import android.util.Log
import android.view.View
import android.webkit.JavascriptInterface
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.core.extensions.isInForeground
import io.wantic.app.share.models.WebImage
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

class AndroidJSInterface(var activity: SelectProductImageActivity) {

    companion object {
        const val LOG_TAG = "AndroidJSInterface"
    }

    private var retryAllowed = true

    @JavascriptInterface
    fun onProductInfosLoaded(webCrawlerResultJsonString: String) {
        Log.d(LOG_TAG, "onProductInfosLoaded $webCrawlerResultJsonString")
        val activity = getContext() ?: return

        // Avoid side effects
        if (activity.webCrawlerResult != null && activity.webCrawlerResult!!.images.isNotEmpty()) {
            Log.w(LOG_TAG, "Images already loaded, skip further processing")
            return
        }

        try {
            activity.webCrawlerResult = Json.decodeFromString(webCrawlerResultJsonString)
        } catch (ex: Exception) {
            val localizedMessage = ex.localizedMessage
            if (localizedMessage != null) {
                Log.e(LOG_TAG, localizedMessage)
            }
            hideLoadingSpinner()
            return
        }

        // Best case scenario
        if (activity.webCrawlerResult!!.images.isNotEmpty()) {
            hideLoadingSpinner()
            displayLoadedImages()
            return
        }

        // Retry crawling with a delay
        if (retryAllowed) {
            retryAllowed = false
            activity.retryCrawling()
            return
        }

        // In the worst case proceed with fallback
        hideLoadingSpinner()
        navigateForwardWithFallback()
        return
    }

    @JavascriptInterface
    fun onError(errorMessage: String) {
        Log.e(LOG_TAG, "onError $errorMessage")
    }

    @JavascriptInterface
    fun onProductInfoLoaded(webImageJsonString: String) {
        Log.d(LOG_TAG, "onProductInfoLoaded $webImageJsonString")
        val activity = getContext() ?: return
        val webImage: WebImage = Json.decodeFromString(webImageJsonString)
        val itemExists = activity.webCrawlerResult!!.images.any { image -> image.id == webImage.id }
        if (!itemExists) {
            val mainHandler = Handler(activity.mainLooper)
            val runnable = Runnable {
                activity.addNewProductInfoItem(webImage)
            }
            mainHandler.post(runnable)
        }
    }

    @JavascriptInterface
    fun log(debugMessage: String) {
        Log.d(LOG_TAG, debugMessage);
    }

    private fun displayLoadedImages() {
        val activity = getContext() ?: return
        val mainHandler = Handler(activity.mainLooper)
        val runnable = Runnable {
            Log.d(LOG_TAG, "initGridLayout from displayLoadedImages")
            activity.initGridLayout(activity.webCrawlerResult!!.images)
        }
        mainHandler.post(runnable)
    }

    private fun navigateForwardWithFallback() {
        val activity = getContext() ?: return
        activity.navigateForward(null)
    }

    private fun hideLoadingSpinner() {
        val activity = getContext() ?: return
        val mainHandler = Handler(activity.mainLooper)
        val runnable = Runnable {
            activity.loadingSpinner.visibility = View.GONE
        }
        mainHandler.post(runnable)
    }

    private fun getContext(): SelectProductImageActivity? {
        val activity = this@AndroidJSInterface.activity
        if (!activity.isInForeground()) {
            Log.d(LOG_TAG, "Activity ${activity.localClassName} is not in foreground")
            return null
        }
        return activity
    }
}