package io.wantic.app.share.core.web

import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit4.MockKRule
import io.mockk.just
import io.mockk.runs
import io.mockk.verify
import io.wantic.app.share.activities.SelectProductImageActivity
import io.wantic.app.share.core.extensions.isInForeground
import io.wantic.app.share.models.WebCrawlerResult
import io.wantic.app.share.models.WebImage
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.junit.Assert
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import java.io.File
import java.nio.charset.Charset

class AndroidJSInterfaceTest {

    @get:Rule
    val mockkRule = MockKRule(this)

    @MockK
    private lateinit var activityMock: SelectProductImageActivity
    private lateinit var androidJSInterface: AndroidJSInterface

    @Before
    fun setup() {
        every { activityMock.stopLoadingThreadSafe() } just runs
        every { activityMock.retryCrawling() } just runs
        every { activityMock.initGridLayoutThreadSafe() } just runs
        every { activityMock.navigateForwardThreadSafe(any()) } just runs
        every { activityMock.addNewProductInfoItemThreadSafe(any()) } just runs

        every { activityMock.webCrawlerResult = any() } answers { callOriginal() }
        every { activityMock.webCrawlerResult } answers { callOriginal() }
        every { activityMock.isInForeground() } returns true
        every { activityMock.localClassName } returns "SelectProductImageActivityMock"

        androidJSInterface = AndroidJSInterface(activityMock)
    }

    @Test
    fun onProductInfosLoaded_returnsWhenImagesAlreadyLoaded() {
        val images: List<WebImage> = listOf(WebImage(1, "", ""))
        every { activityMock.webCrawlerResult } returns WebCrawlerResult("", "", images = images)

        androidJSInterface.onProductInfosLoaded("")

        verify(exactly = 0) { activityMock.stopLoadingThreadSafe() }
        verify(exactly = 0) { activityMock.retryCrawling() }
        verify(exactly = 0) { activityMock.initGridLayoutThreadSafe() }
        verify(exactly = 0) { activityMock.navigateForwardThreadSafe(any()) }
        // verify(exactly = 0) { activityMock.addNewProductInfoItemThreadSafe(any()) }
    }

    @Test
    fun onProductInfosLoaded_returnsWhenCrawlingResultContainsUnexpectedData() {
        androidJSInterface.onProductInfosLoaded("{ \"unknown\": true }")

        verify(exactly = 1) { activityMock.stopLoadingThreadSafe() }
        verify(exactly = 0) { activityMock.retryCrawling() }
        verify(exactly = 0) { activityMock.initGridLayoutThreadSafe() }
        verify(exactly = 0) { activityMock.navigateForwardThreadSafe(any()) }
    }

    @Test
    fun onProductInfosLoaded_decodeCrawledContentCorrectly() {
        val jsonString = loadFileAsText("amazon-product.json")
        androidJSInterface.onProductInfosLoaded(jsonString)

        verify(exactly = 1) { activityMock.stopLoadingThreadSafe() }
        verify(exactly = 0) { activityMock.retryCrawling() }
        verify(exactly = 1) { activityMock.initGridLayoutThreadSafe() }
        verify(exactly = 0) { activityMock.navigateForwardThreadSafe(any()) }
    }

    @Test
    fun onProductInfosLoaded_triggersReloadWhenThereAreNoImages() {
        val jsonString = loadFileAsText("any-product-no-images.json")
        androidJSInterface.onProductInfosLoaded(jsonString)

        verify(exactly = 0) { activityMock.stopLoadingThreadSafe() }
        verify(exactly = 1) { activityMock.retryCrawling() }
        verify(exactly = 0) { activityMock.initGridLayoutThreadSafe() }
        verify(exactly = 0) { activityMock.navigateForwardThreadSafe(any()) }
    }

    @Test
    fun onProductInfosLoaded_navigatesForwardWithFallback() {
        val jsonString = loadFileAsText("any-product-no-images.json")
        androidJSInterface.onProductInfosLoaded(jsonString) // simulate retry
        androidJSInterface.onProductInfosLoaded(jsonString)

        verify(exactly = 1) { activityMock.stopLoadingThreadSafe() }
        verify(exactly = 1) { activityMock.retryCrawling() }
        verify(exactly = 0) { activityMock.initGridLayoutThreadSafe() }
        verify(exactly = 1) { activityMock.navigateForwardThreadSafe(null) }
    }

    @Test
    fun onProductInfosLoaded_returnsIfActivityIsNotResumed() {
        every { activityMock.isInForeground() } returns false

        val jsonString = loadFileAsText("amazon-product.json")
        androidJSInterface.onProductInfosLoaded(jsonString)

        verify(exactly = 0) { activityMock.stopLoadingThreadSafe() }
        verify(exactly = 0) { activityMock.retryCrawling() }
        verify(exactly = 0) { activityMock.initGridLayoutThreadSafe() }
        verify(exactly = 0) { activityMock.navigateForwardThreadSafe(any()) }
    }

    @Test
    fun onProductInfoLoaded_returnsIfActivityIsNotResumed() {
        every { activityMock.isInForeground() } returns false

        val jsonString = "{ \"any\": true }"
        androidJSInterface.onProductInfoLoaded(jsonString)

        verify(exactly = 0) { activityMock.addNewProductInfoItemThreadSafe(any()) }
    }

    @Test
    fun onProductInfoLoaded_returnsOnDecodingIssue() {
        val jsonString = "{ \"any\": \"Not an image\" }"
        androidJSInterface.onProductInfoLoaded(jsonString)

        verify(exactly = 0) { activityMock.addNewProductInfoItemThreadSafe(any()) }
    }

    @Test
    fun onProductInfoLoaded_returnsIfItemsAlreadyExist() {
        val webCrawlerResult: WebCrawlerResult = Json.decodeFromString(loadFileAsText("amazon-product.json"))
        val webImage = loadFileAsText("amazon-product-image-20.json")

        every { activityMock.webCrawlerResult } returns webCrawlerResult

        androidJSInterface.onProductInfoLoaded(webImage)

        verify(exactly = 0) { activityMock.addNewProductInfoItemThreadSafe(any()) }
    }

    @Test
    fun onProductInfoLoaded_callsAddNewProductInfoItemThreadSafe() {
        val webCrawlerResult: WebCrawlerResult = Json.decodeFromString(loadFileAsText("amazon-product.json"))
        val webImage = loadFileAsText("amazon-product-image-new.json")

        every { activityMock.webCrawlerResult } returns webCrawlerResult

        androidJSInterface.onProductInfoLoaded(webImage)

        verify(exactly = 1) { activityMock.addNewProductInfoItemThreadSafe(any()) }
    }

    private fun loadFileAsText(fileName: String): String {
        val resource = javaClass.classLoader?.getResource(fileName)
        Assert.assertNotNull(resource)
        val file = File(resource!!.path)
        Assert.assertNotNull(file)
        return file.readText(Charset.forName("UTF-8"))
    }

}