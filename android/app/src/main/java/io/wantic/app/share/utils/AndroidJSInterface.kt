package io.wantic.app.share.utils

import android.os.Handler
import android.util.Log
import android.view.View
import android.webkit.JavascriptInterface
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.models.ProductInfo
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

class AndroidJSInterface(var context: SelectProductImageActivity) {

    companion object {
        const val LOG_TAG = "AndroidJSInterface"
    }

    @JavascriptInterface
    fun onProductInfosLoaded(productInfoListString: String) {
        Log.d(LOG_TAG, "onProductInfosLoaded $productInfoListString")
        if (this.context.productInfoList.isNotEmpty()) {
            hideLoadingSpinner()
            return
        }
        try {
            context.productInfoList = Json.decodeFromString(productInfoListString)
            context.infoLoaded = true
            hideLoadingSpinner()
            if (this.context.productInfoList.isEmpty()) {
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
    fun onProductInfoLoaded(productInfoJsonString: String) {
        Log.d(LOG_TAG, "onProductInfoLoaded $productInfoJsonString")
        val productInfo: ProductInfo = Json.decodeFromString(productInfoJsonString)
        val itemExists = context.productInfoList.any { info -> info.id == productInfo.id }
        if (!itemExists) {
            val mainHandler = Handler(this.context.mainLooper)
            val runnable = Runnable {
                this@AndroidJSInterface.context.addNewProductInfoItem(productInfo)
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
            this@AndroidJSInterface.context.initGridLayout(this.context.productInfoList)
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