package io.wantic.app.share.core.web

import android.graphics.Bitmap
import android.util.Log
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.models.ProductInfo

class WebViewClient(
    private val activity: SelectProductImageActivity,
    private val script: String,
    private val sharedUrl: String
    ) : WebViewClient() {

    companion object {
        private const val LOG_TAG = "WebViewClient"
    }

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

        if (loadingCompleted()) {
            view?.evaluateJavascript(script, null)
        } else {
            Log.d(LOG_TAG, "Skipped JS evaluation. Waiting for redirect url.")
        }
    }

    private fun handleLoadingError() {
        if (activity.isDestroyed) {
            redirectUrl = null
            return
        }
        val fetchedImages = activity.webCrawlerResult?.images ?: listOf()
        if (fetchedImages.isEmpty()) {
            Log.d(LOG_TAG, "Skipped JS evaluation due to error")
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

    private fun isRedirecting(): Boolean {
        return redirectUrl != null;
    }

    private fun loadingCompleted(): Boolean {
        return !isRedirecting();
    }

}