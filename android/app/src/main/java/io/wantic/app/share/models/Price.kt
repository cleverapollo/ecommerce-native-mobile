package io.wantic.app.share.models

import kotlinx.serialization.Serializable

@Serializable
class Price constructor(var amount: Float, var currency: String = "€") {
}