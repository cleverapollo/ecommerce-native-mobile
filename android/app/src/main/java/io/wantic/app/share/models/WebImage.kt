package io.wantic.app.share.models

import kotlinx.serialization.Serializable

@Serializable
data class WebImage(
    val id: Int,
    val name: String,
    val url: String
) : java.io.Serializable