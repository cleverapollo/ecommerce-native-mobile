package io.wantic.app.share.utils

import android.os.Handler
import android.util.Log
import android.view.View
import android.webkit.JavascriptInterface
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.models.WebImage
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

class AndroidJSInterface(var context: SelectProductImageActivity) {

    companion object {
        const val LOG_TAG = "AndroidJSInterface"
    }

    @JavascriptInterface
    fun onProductInfosLoaded(webCrawlerResultJsonString: String) {
        Log.d(LOG_TAG, "onProductInfosLoaded $webCrawlerResultJsonString")
        if (context.webCrawlerResult != null) {
            Log.d(LOG_TAG, "webCrawlerResult already set $webCrawlerResultJsonString")
            return
        }
        try {
            context.webCrawlerResult = Json.decodeFromString(webCrawlerResultJsonString)
            context.infoLoaded = true
            hideLoadingSpinner()
            if (this.context.webCrawlerResult!!.images.isEmpty()) {
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
        val webImage: WebImage = Json.decodeFromString(webImageJsonString)
        val itemExists = context.webCrawlerResult!!.images.any { image -> image.id == webImage.id }
        if (!itemExists) {
            val mainHandler = Handler(this.context.mainLooper)
            val runnable = Runnable {
                this@AndroidJSInterface.context.addNewProductInfoItem(webImage)
            }
            mainHandler.post(runnable)
        }
    }

    @JavascriptInterface
    fun log(debugMessage: String) {
        Log.d(LOG_TAG, debugMessage);
    }

    private fun displayLoadedImages() {
        val mainHandler = Handler(this.context.mainLooper)
        val runnable = Runnable {
            Log.d(LOG_TAG, "initGridLayout from displayLoadedImages")
            this@AndroidJSInterface.context.initGridLayout(this.context.webCrawlerResult!!.images)
        }
        mainHandler.post(runnable)
    }

    private fun onImagesNotFound() {
        this@AndroidJSInterface.context.navigateForward(null)
    }

    private fun hideLoadingSpinner() {
        val mainHandler = Handler(this.context.mainLooper)
        val runnable = Runnable {
            this@AndroidJSInterface.context.loadingSpinner.visibility = View.GONE
        }
        mainHandler.post(runnable)
    }
}