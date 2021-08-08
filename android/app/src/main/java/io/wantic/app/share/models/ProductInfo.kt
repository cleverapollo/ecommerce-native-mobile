package io.wantic.app.share.models

import kotlinx.serialization.Serializable
import java.io.Serializable as JavaSerializable

@Serializable
data class ProductInfo(
    val id: UInt,
    var name: String,
    val imageUrl: String,
    val productUrl: String,
    var price: Float = 0.00f
) : JavaSerializable
