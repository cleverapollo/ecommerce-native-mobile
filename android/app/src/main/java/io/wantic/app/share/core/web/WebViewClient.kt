package io.wantic.app.share.core.web

import android.graphics.Bitmap
import android.os.Handler
import android.util.Log
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.core.extensions.isInForeground
import io.wantic.app.share.models.ProductInfo

class WebViewClient(
    private val activity: SelectProductImageActivity,
    private val script: String,
    private val sharedUrl: String
) : WebViewClient() {

    companion object {
        private const val LOG_TAG = "WebViewClient"
    }

    var scrapeWithDelay = false

    private var loadingError = false
    private var redirectUrl: String? = null

    init {
        Log.d(LOG_TAG, "onInit, url = $sharedUrl")
    }

    // android.webkit.WebViewClient

    override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
        Log.d(LOG_TAG, "onPageStarted, url = $url")
        super.onPageStarted(view, url, favicon)
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        Log.d(LOG_TAG, "onPageFinished, url = $url")

        if (url == redirectUrl) {
            redirectUrl = null
        }

        if (loadingError) {
            handleLoadingError()
            return
        }

        scrapeContentFromWebPage(view)
    }

    private fun handleLoadingError() {
        if (!canContinue()) {
            redirectUrl = null
            return
        }
        val fetchedImages = activity.webCrawlerResult?.images ?: listOf()
        if (fetchedImages.isEmpty()) {
            Log.d(LOG_TAG, "Skipped Javascript evaluation due to error")
            val productInfo = ProductInfo(-1, "", null, sharedUrl)
            activity.navigateForward(productInfo)
        }
        redirectUrl = null
    }

    override fun onReceivedError(
        view: WebView?,
        request: WebResourceRequest?,
        error: WebResourceError?
    ) {
        loadingError = true

        if (error != null) {
            Log.e(LOG_TAG, "onReceivedError ${error.errorCode}: ${error.description}")
        }

        super.onReceivedError(view, request, error)
    }

    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
        Log.d(LOG_TAG, "shouldOverrideUrlLoading ${request.url}")
        val url = request.url.toString()
        redirectUrl = url
        view.loadUrl(url)
        return false // avoid redirecting
    }

    private fun scrapeContentFromWebPage(view: WebView?) {
        if (!loadingCompleted()) {
            Log.d(LOG_TAG, "Skipped Javascript evaluation. Waiting for redirect url ...")
            return
        }
        if (view == null) {
            Log.e(LOG_TAG, "Can't evaluate Javascript on unavailable WebView")
            return
        }
        if (!canContinue()) {
            return
        }

        if (scrapeWithDelay) {
            Log.d(LOG_TAG, "Evaluating Javascript after 3 seconds")
            // Wait until web page has loaded the content.
            Handler(activity.mainLooper).postDelayed(
                {
                    Log.d(LOG_TAG, "Evaluating Javascript ...")
                    view.evaluateJavascript(script, null)
                },
                3000
            )
        } else {
            Log.d(LOG_TAG, "Evaluating Javascript ...")
            view.evaluateJavascript(script, null)
        }
    }

    /**
     * Consider whether it makes sense to continue processing.
     */
    private fun canContinue(): Boolean {
        if (activity.isDestroyed) {
            Log.d(LOG_TAG, "Can't continue due to destroyed activity")
            return false
        }
        if (activity.isFinishing) {
            Log.d(LOG_TAG, "Can't continue due to finishing activity")
            return false
        }
        if (!activity.isInForeground()) {
            Log.d(LOG_TAG, "Can't continue, activity is not in the foreground.")
            return false
        }
        return true
    }

    private fun isRedirecting(): Boolean {
        return redirectUrl != null;
    }

    private fun loadingCompleted(): Boolean {
        return !isRedirecting();
    }

}