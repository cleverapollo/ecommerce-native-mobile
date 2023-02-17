package io.wantic.app.share.core.web

import android.os.Handler
import android.util.Log
import android.view.View
import android.webkit.JavascriptInterface
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.models.WebImage
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

class AndroidJSInterface(var activity: SelectProductImageActivity) {

    companion object {
        const val LOG_TAG = "AndroidJSInterface"
    }

    @JavascriptInterface
    fun onProductInfosLoaded(webCrawlerResultJsonString: String) {
        Log.d(LOG_TAG, "onProductInfosLoaded $webCrawlerResultJsonString")
        val activity = getContext() ?: return
        if (activity.webCrawlerResult != null) {
            Log.d(LOG_TAG, "webCrawlerResult already set $webCrawlerResultJsonString")
            return
        }
        try {
            activity.webCrawlerResult = Json.decodeFromString(webCrawlerResultJsonString)
            activity.infoLoaded = true
            hideLoadingSpinner()
            if (activity.webCrawlerResult!!.images.isEmpty()) {
                onImagesNotFound()
            } else {
                displayLoadedImages()
            }
        } catch (ex: Exception) {
            val localizedMessage = ex.localizedMessage
            if (localizedMessage != null) {
                Log.e(LOG_TAG, localizedMessage)
            }
        }
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

    private fun onImagesNotFound() {
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
        if (activity.isDestroyed) {
            Log.d(LOG_TAG, "Activity ${activity.localClassName} is destroyed")
            return null
        }
        return activity
    }
}