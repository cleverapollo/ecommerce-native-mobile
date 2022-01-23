package io.wantic.app.share.utils

import android.util.Log
import android.util.Patterns
import android.webkit.URLUtil
import io.wantic.app.share.models.ShareResult
import java.util.regex.Matcher

object ShareResultParser : ShareResultParsing {

    private const val LOG_TAG = "ShareResultParser"

    override fun parseTextToShareResult(shareResultTextContent: String): ShareResult? {
        return run {
            Log.d(LOG_TAG, shareResultTextContent)
            if (URLUtil.isValidUrl(shareResultTextContent)) {
                ShareResult(shareResultTextContent)
            } else {
                val links = getURLsFromString(shareResultTextContent)
                if (links.size == 1) {
                    val productURI = links.first()
                    val productName = shareResultTextContent
                        .replace(productURI, "")
                        .trim()
                    ShareResult(productURI, productName)
                } else {
                    null
                }
            }
        }
    }

    private fun getURLsFromString(text: String): Array<String> {
        val links: MutableList<String> = ArrayList()
        val m: Matcher = Patterns.WEB_URL.matcher(text)
        while (m.find()) {
            val url: String = m.group()
            Log.d(LOG_TAG, "URL extracted: $url")
            links.add(url)
        }
        return links.toTypedArray()
    }
}