package io.wantic.app.share.core.web

import io.wantic.app.share.models.ShareResult
import org.junit.Assert
import org.junit.Before
import org.junit.Test
import java.io.File

class ShareResultParserTest {

    private lateinit var shareResultParser: ShareResultParser

    @Before
    fun setup() {
        shareResultParser = ShareResultParser
    }

    @Test
    fun parseTextToShareResult_onlyURL_returnsInitializedModelWithURLString() {
        val content = "https://www.douglas.de/de/p/3001030751"
        val result = shareResultParser.parseTextToShareResult(content)
        val expectedResult = ShareResult("https://www.douglas.de/de/p/3001030751", "")
        Assert.assertEquals(expectedResult, result)
    }

    @Test
    fun parseTextToShareResult_onlyName_returnsNull() {
        val content = "Hoola Bronzer Mini"
        val result = shareResultParser.parseTextToShareResult(content)
        Assert.assertNull(result)
    }

    @Test
    fun parseTextToShareResult_URLandName_returnsInitializedModelWithURLStringAndName() {
        val content = "Hoola Bronzer Mini https://www.douglas.de/de/p/3001030751"
        val result = shareResultParser.parseTextToShareResult(content)
        val expectedResult =
            ShareResult("https://www.douglas.de/de/p/3001030751", "Hoola Bronzer Mini")
        Assert.assertEquals(expectedResult, result)
    }

    @Test
    fun parseTextToShareResult_emptyString_returnsNull() {
        val content = ""
        val result = shareResultParser.parseTextToShareResult(content)
        Assert.assertNull(result)
    }

    @Test
    fun parseTextToShareResult_multipleUrls_returnsFirstOne() {
        val content = loadTxt("about-you.txt")
        val result = shareResultParser.parseTextToShareResult(content)
        val expectedResult = ShareResult(
            "https://m.aboutyou.de/p/nike-sportswear/sneaker-air-max-270-5840320?utm_medium=referral&utm_source=onsite_sharing&utm_campaign=product",
            "Schau Dir dieses Produkt bei ABOUT YOU an:"
        )
        Assert.assertEquals(expectedResult, result)
    }

    @Test
    fun parseTextToShareResult_textWithSpecialChars_returnsLink() {
        val content = loadTxt("mobile-shared.txt")
        val result = shareResultParser.parseTextToShareResult(content)
        val expectedResult = ShareResult(
            "https://link.mobile.de/v66Cw8ByBP4wzpM87",
            loadTxt("mobile-expected.txt")
        )
        Assert.assertEquals(expectedResult, result)
    }

    private fun loadTxt(fileName: String): String {
        val resource = javaClass.classLoader?.getResource(fileName);
        Assert.assertNotNull(resource)
        val file = File(resource!!.path)
        Assert.assertNotNull(file)
        return file.readText()
    }
}