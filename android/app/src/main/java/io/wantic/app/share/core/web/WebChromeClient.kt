package io.wantic.app.share.core.web

import android.util.Log
import android.webkit.WebChromeClient
import android.webkit.WebView

object WebChromeClient: WebChromeClient() {

    private const val LOG_TAG = "WebChromeClient"

    override fun onProgressChanged(view: WebView?, newProgress: Int) {
        Log.d(LOG_TAG, "onProgressChanged = progress: $newProgress")
        super.onProgressChanged(view, newProgress)
    }
}