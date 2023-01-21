package io.wantic.app.share.core.data

interface FileHandling {
    fun loadFileAsText(fileName: String): String
}