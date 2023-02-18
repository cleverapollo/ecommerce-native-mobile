package io.wantic.app.share.core.web

import io.wantic.app.share.models.ShareResult

interface ShareResultParsing {
    fun parseTextToShareResult(shareResultTextContent: String): ShareResult?
}