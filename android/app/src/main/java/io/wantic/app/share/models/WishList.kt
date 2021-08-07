package io.wantic.app.share.models

import io.wantic.app.share.utils.UUIDSerializer
import kotlinx.serialization.Serializable
import java.util.*

@Serializable
class WishList constructor(val id: @Serializable(with = UUIDSerializer::class) UUID, val name: String) {
    override fun toString(): String {
        return this.name
    }
}