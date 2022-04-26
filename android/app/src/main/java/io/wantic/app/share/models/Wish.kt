package io.wantic.app.share.models

import io.wantic.app.share.utils.UUIDSerializer
import kotlinx.serialization.Serializable
import java.util.*

@Serializable
class Wish constructor(
    var id: @Serializable(with = UUIDSerializer::class) UUID?,
    val wishListId: @Serializable(with = UUIDSerializer::class) UUID,
    val name: String, val price: Price, val note: String?,
    val productUrl: String,
    val imageUrl: String?,
    val isFavorite: Boolean
    ) {

    companion object {
        fun create(productInfo: ProductInfo, wishListId: UUID): Wish {
            val price = Price(productInfo.price)
            return Wish(
                null,
                wishListId,
                productInfo.name,
                price,
                productInfo.note,
                productInfo.productUrl,
                productInfo.imageUrl,
                productInfo.isFavorite
            )
        }
    }

}