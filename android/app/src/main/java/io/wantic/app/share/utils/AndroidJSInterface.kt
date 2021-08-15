package io.wantic.app.share.utils

import android.os.Handler
import android.util.Log
import android.view.View
import android.webkit.JavascriptInterface
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import io.wantic.app.R
import io.wantic.app.share.activities.SelectProductImageActivity
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
                hideLoadingSpinner()
                showNoImagesFoundFeedback()
            } else {
                displayLoadedImages()
                hideLoadingSpinner()
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

    private fun displayLoadedImages() {
        val mainHandler = Handler(this.context.mainLooper)
        val runnable = Runnable {
            this@AndroidJSInterface.context.initGridLayout(this.context.productInfoList)
        }
        mainHandler.post(runnable)
    }

    private fun showNoImagesFoundFeedback() {
        AlertDialog.Builder(this@AndroidJSInterface.context)
            .setTitle(R.string.title_no_product_info_found)
            .setMessage(R.string.message_no_product_info_found)
            .setNegativeButton(R.string.button_label_close) { _, _ ->
                ActivityCompat.finishAffinity(this@AndroidJSInterface.context)
            }
    }

    private fun hideLoadingSpinner() {
        val mainHandler = Handler(this.context.mainLooper)
        val runnable = Runnable {
            this@AndroidJSInterface.context.loadingSpinner.visibility = View.GONE
        }
        mainHandler.post(runnable)
    }
}