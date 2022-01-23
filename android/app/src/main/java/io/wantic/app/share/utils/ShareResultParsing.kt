package io.wantic.app.share.utils

import io.wantic.app.share.models.ShareResult

interface ShareResultParsing {
    fun parseTextToShareResult(shareResultTextContent: String): ShareResult?
}