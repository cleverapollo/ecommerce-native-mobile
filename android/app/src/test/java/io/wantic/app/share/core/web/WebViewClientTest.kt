package io.wantic.app.share.core.web

import android.os.Handler
import android.webkit.WebView
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit4.MockKRule
import io.mockk.just
import io.mockk.runs
import io.mockk.verify
import io.wantic.app.share.BaseUnitTest
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.core.extensions.isInForeground
import io.wantic.app.share.models.ProductInfo
import io.wantic.app.share.models.WebCrawlerResult
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.junit.Before
import org.junit.Rule
import org.junit.Test

class WebViewClientTest : BaseUnitTest() {

    companion object {
        private const val SCRIPT = "console.log('test');"
        private const val PRODUCT_URL = "https://www.wantic.io/productUrl"
    }

    @get:Rule
    val mockkRule = MockKRule(this)

    @MockK
    private lateinit var activityMock: SelectProductImageActivity

    @MockK
    private lateinit var webView: WebView

    @MockK
    private lateinit var handler: Handler
    private lateinit var webViewClient: WebViewClient

    @Before
    fun setup() {
        every { activityMock.isInForeground() } returns true
        every { activityMock.isDestroyed } returns false
        every { activityMock.isFinishing } returns false
        every { activityMock.navigateForwardThreadSafe(any()) } just runs
        every { activityMock.webCrawlerResult = any() } answers { callOriginal() }
        every { activityMock.webCrawlerResult } answers { callOriginal() }

        every { webView.evaluateJavascript(any(), any()) } just runs
        every { webView.loadUrl(any()) } just runs

        every { handler.postDelayed(any(), any()) } returns true

        webViewClient = WebViewClient(activityMock, SCRIPT, PRODUCT_URL, handler)
    }

    @Test
    fun onPageFinished_evaluatesScript() {
        webViewClient.onPageFinished(webView, PRODUCT_URL)

        verify(exactly = 1) { webView.evaluateJavascript(SCRIPT, null) }
    }

    @Test
    fun onPageFinished_evaluatesScriptWithDelay() {
        webViewClient.scrapeWithDelay = true
        webViewClient.onPageFinished(webView, PRODUCT_URL)

        verify(exactly = 1) { handler.postDelayed(any(), 3000) }
    }

    @Test
    fun onPageFinished_onErrorNavigatesForwardWithFallback() {
        webViewClient.onReceivedError(webView, null, null) // simulate error
        webViewClient.onPageFinished(webView, PRODUCT_URL)

        verify(exactly = 0) { webView.evaluateJavascript(any(), any()) }
        verify(exactly = 1) {
            activityMock.navigateForwardThreadSafe(
                ProductInfo(
                    -1,
                    "",
                    null,
                    PRODUCT_URL
                )
            )
        }
    }

    @Test
    fun onPageFinished_onErrorReturnsIfActivityIsDestroyed() {
        every { activityMock.isDestroyed } returns true

        webViewClient.onReceivedError(webView, null, null) // simulate error
        webViewClient.onPageFinished(webView, PRODUCT_URL)

        verify(exactly = 0) { webView.evaluateJavascript(any(), any()) }
        verify(exactly = 0) {
            activityMock.navigateForwardThreadSafe(
                ProductInfo(
                    -1,
                    "",
                    null,
                    PRODUCT_URL
                )
            )
        }
    }

    @Test
    fun onPageFinished_onErrorReturnsIfActivityIsFinishing() {
        every { activityMock.isFinishing } returns true

        webViewClient.onReceivedError(webView, null, null) // simulate error
        webViewClient.onPageFinished(webView, PRODUCT_URL)

        verify(exactly = 0) { webView.evaluateJavascript(any(), any()) }
        verify(exactly = 0) {
            activityMock.navigateForwardThreadSafe(
                ProductInfo(
                    -1,
                    "",
                    null,
                    PRODUCT_URL
                )
            )
        }
    }

    @Test
    fun onPageFinished_onErrorReturnsIfActivityIsNotResumed() {
        every { activityMock.isInForeground() } returns false

        webViewClient.onReceivedError(webView, null, null) // simulate error
        webViewClient.onPageFinished(webView, PRODUCT_URL)

        verify(exactly = 0) { webView.evaluateJavascript(any(), any()) }
        verify(exactly = 0) {
            activityMock.navigateForwardThreadSafe(
                ProductInfo(
                    -1,
                    "",
                    null,
                    PRODUCT_URL
                )
            )
        }
    }

    @Test
    fun onPageFinished_onErrorDoesNothingIfImagesAlreadyLoaded() {
        val webCrawlerResult: WebCrawlerResult =
            Json.decodeFromString(loadFileAsText("amazon-product.json"))
        every { activityMock.webCrawlerResult } answers { webCrawlerResult }

        webViewClient.onReceivedError(webView, null, null) // simulate error
        webViewClient.onPageFinished(webView, PRODUCT_URL)

        verify(exactly = 0) { webView.evaluateJavascript(any(), any()) }
        verify(exactly = 0) {
            activityMock.navigateForwardThreadSafe(
                ProductInfo(
                    -1,
                    "",
                    null,
                    PRODUCT_URL
                )
            )
        }
    }

    @Test
    fun onPageFinished_returnsIfWebViewIsNull() {
        webViewClient.onPageFinished(null, PRODUCT_URL)

        verify(exactly = 0) { webView.evaluateJavascript(SCRIPT, null) }
        verify(exactly = 0) { activityMock.navigateForwardThreadSafe(any()) }
    }

    // ToDo test shouldOverrideUrlLoading -> issues when mocking Uri class

}