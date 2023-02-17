package io.wantic.app.share.utils

import android.util.Log
import android.util.Patterns
import android.webkit.URLUtil
import io.wantic.app.share.models.ShareResult
import java.util.regex.Matcher

object ShareResultParser : ShareResultParsing {

    private const val LOG_TAG = "ShareResultParser"

    /**
     * Tries to extract product name and url from the shared text content.
     * @param shareResultTextContent shared content from web page or app
     * @return object which contains the extracted uri and name or the product or null
     */
    override fun parseTextToShareResult(shareResultTextContent: String): ShareResult? {
        return run {
            Log.d(LOG_TAG, shareResultTextContent)
            if (URLUtil.isValidUrl(shareResultTextContent)) {
                ShareResult(shareResultTextContent)
            } else {
                val links = extractURLsFromString(shareResultTextContent)
                if (links.isNotEmpty()) {
                    // Assume that the first link is always the product link
                    // e.g. About you app contains product url and deep link to the app
                    val productURI = links.first()
                    val productName = extractProductName(shareResultTextContent, productURI)
                    ShareResult(productURI, productName)
                } else {
                    null
                }
            }
        }
    }

    /**
     * Extracts the product name from the shared content in the best case.
     * In some cases this method returns some explanations to the product instead of the name.
     * This name can be overwritten by the js result.
     * @param text string to extract from
     * @param uri extracted product url
     * @return product name or description
     */
    private fun extractProductName(
        text: String,
        uri: String
    ): String {
        return text
            .replaceAfter(uri, "")
            .replace(uri, "")
            .trim()
    }

    /**
     * Parses all urls from a string matching WEB_URL pattern.
     * @param text String to parse from
     * @return an array of web urls
     */
    private fun extractURLsFromString(text: String): Array<String> {
        val links: MutableList<String> = ArrayList()
        val m: Matcher = Patterns.WEB_URL.matcher(text)
        while (m.find()) {
            val url: String = m.group()
            Log.d(LOG_TAG, "URL extracted: $url")
            if (url.startsWith("http")) {
                links.add(url)
            }
        }
        return links.toTypedArray()
    }
}