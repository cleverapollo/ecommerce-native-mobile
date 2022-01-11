package io.wantic.app.share.network

import com.android.volley.VolleyError
import io.wantic.app.share.models.Wish

interface WishApi {
    fun saveWish(idToken: String, wish: Wish, completionHandler: (successfullySaved: Boolean, error: VolleyError?) -> Unit)
}