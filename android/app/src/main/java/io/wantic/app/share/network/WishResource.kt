package io.wantic.app.share.network

import android.util.Log
import com.android.volley.VolleyError
import com.android.volley.toolbox.JsonObjectRequest
import io.wantic.app.AppConfig
import io.wantic.app.share.models.Wish
import org.json.JSONException
import org.json.JSONObject

class WishResource {

    companion object {
        private const val LOG_TAG = "WishResource"
        private const val RESOURCE_URI = "v1/wishes"
    }

    private val url: String = "${AppConfig.backendUrl}/$RESOURCE_URI"

    fun saveWish(idToken: String, wish: Wish, completionHandler: (successfullySaved: Boolean, error: VolleyError?) -> Unit): JsonObjectRequest {
        val data = createJsonObject(wish)
        return object : JsonObjectRequest(
            Method.POST, url, data,
            {  response ->
                Log.d(LOG_TAG, "Response: %s".format(response.toString()))
                completionHandler(true, null)
            },
            { error ->
                Log.e(LOG_TAG, "Response error: $error")
                completionHandler(false, error)
            }
        ) {
            override fun getHeaders(): MutableMap<String, String> {
                return AppConfig.createRequestHeaders(idToken)
            }
        }
    }

    private fun createJsonObject(wish: Wish): JSONObject {
        val data = JSONObject()
        try {
            val price = JSONObject()
            price.put("amount", wish.price.amount)
            price.put("currency", wish.price.currency)

            data.put("wishListId", wish.wishListId)
            data.put("name", wish.name)
            data.put("productUrl", wish.productUrl)
            data.put("imageUrl", wish.imageUrl)
            data.put("price", price)
            data.put("isFavorite", wish.isFavorite)
            data.put("note", wish.note)
        } catch (exception: JSONException) {
            exception.printStackTrace()
        }
        return data
    }

}