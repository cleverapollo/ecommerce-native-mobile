package io.wantic.app.share.models

import kotlinx.serialization.Serializable

@Serializable
data class WebCrawlerResult(
    var url: String,
    var title: String,
    var price: Float = 0.00f,
    var images: List<WebImage> = emptyList()
) : java.io.Serializable
