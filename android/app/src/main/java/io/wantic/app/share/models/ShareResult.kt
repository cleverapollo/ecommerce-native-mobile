package io.wantic.app.share.models

import kotlinx.serialization.Serializable

@Serializable
data class ShareResult (
    var productURLString: String,
    var productName: String? = null
) : java.io.Serializable