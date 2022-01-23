package io.wantic.app.share.utils

import io.wantic.app.share.models.ShareResult
import junit.framework.TestCase
import org.junit.Before
import org.junit.Test

class ShareResultParserTest : TestCase() {

    private lateinit var shareResultParser: ShareResultParser

    @Before
    fun setup() {
        shareResultParser = ShareResultParser
    }

    @Test
    fun parseTextToShareResult_onlyURL_returnsInitializedModelWithURLString() {
        val content = "https://www.douglas.de/de/p/3001030751"
        val result = shareResultParser.parseTextToShareResult(content)
        val expectedResult = ShareResult("https://www.douglas.de/de/p/3001030751")
        assertEquals(expectedResult, result)
    }

    @Test
    fun parseTextToShareResult_onlyName_returnsNull() {
        val content = "Hoola Bronzer Mini"
        val result = shareResultParser.parseTextToShareResult(content)
        assertNull(result)
    }

    @Test
    fun parseTextToShareResult_URLandName_returnsInitializedModelWithURLStringAndName() {
        val content = "Hoola Bronzer Mini https://www.douglas.de/de/p/3001030751"
        val result = shareResultParser.parseTextToShareResult(content)
        val expectedResult = ShareResult("https://www.douglas.de/de/p/3001030751", "Hoola Bronzer Mini")
        assertEquals(expectedResult, result)
    }

    @Test
    fun parseTextToShareResult_emptyString_returnsNull() {
        val content = ""
        val result = shareResultParser.parseTextToShareResult(content)
        assertNull(result)
    }
}