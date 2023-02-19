package io.wantic.app.share.core.web

import android.util.Log
import android.webkit.JavascriptInterface
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.core.extensions.isInForeground
import io.wantic.app.share.models.WebCrawlerResult
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

        val webCrawlerResult: WebCrawlerResult

        try {
            webCrawlerResult = Json.decodeFromString(webCrawlerResultJsonString)
            activity.webCrawlerResult = webCrawlerResult
        } catch (ex: Exception) {
            logExceptionMessage(ex)
            hideLoadingSpinner()
            return
        }

        // Best case scenario
        if (webCrawlerResult.images.isNotEmpty()) {
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
        val webImage: WebImage

        try {
            webImage = Json.decodeFromString(webImageJsonString)
        } catch (ex: Exception) {
            logExceptionMessage(ex)
            return
        }

        val webCrawlerResult = activity.webCrawlerResult ?: return
        val itemExists = webCrawlerResult.images.any { image -> image.id == webImage.id }
        if (!itemExists) {
            activity.addNewProductInfoItemThreadSafe(webImage)
        } else {
            Log.d(LOG_TAG, "Web image with id ${webImage.id} already exists.")
        }
    }

    @JavascriptInterface
    fun log(debugMessage: String) {
        Log.d(LOG_TAG, debugMessage)
    }

    private fun displayLoadedImages() {
        val activity = getContext() ?: return
        activity.initGridLayoutThreadSafe()
    }

    private fun navigateForwardWithFallback() {
        val activity = getContext() ?: return
        activity.navigateForwardThreadSafe(null)
    }

    private fun hideLoadingSpinner() {
        val activity = getContext() ?: return
        activity.stopLoadingThreadSafe()
    }

    private fun getContext(): SelectProductImageActivity? {
        val activity = this@AndroidJSInterface.activity
        if (!activity.isInForeground()) {
            Log.d(LOG_TAG, "Activity ${activity.localClassName} is not in foreground")
            return null
        }
        return activity
    }

    private fun logExceptionMessage(ex: Exception) {
        val localizedMessage = ex.localizedMessage
        if (localizedMessage != null) {
            Log.e(LOG_TAG, localizedMessage)
        }
    }
}