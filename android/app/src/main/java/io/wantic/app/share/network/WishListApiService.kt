package io.wantic.app.share.network

import android.util.Log
import com.android.volley.RequestQueue
import com.android.volley.VolleyError
import com.android.volley.toolbox.JsonArrayRequest
import io.wantic.app.AppConfig
import io.wantic.app.share.models.WishList
import org.json.JSONException
import java.util.*
import kotlin.collections.ArrayList

class WishListApiService(private val requestQueue: RequestQueue) {

    companion object {
        private const val LOG_TAG = "WishListApiService"
        private const val RESOURCE_URI = "v1/wish-lists"
    }

    private val url: String = "${AppConfig.backendUrl}/$RESOURCE_URI"

    fun getWishLists(idToken: String, completionHandler: (wishLists: ArrayList<WishList>?, error: VolleyError?) -> Unit) {
        val request =  object : JsonArrayRequest(
            Method.GET, url, null,
            { response ->
                Log.d(LOG_TAG, "Response: %s".format(response.toString()))
                val wishLists = ArrayList<WishList>()
                for (index in 0..response.length()) {
                    try {
                        val jsonObject = response.getJSONObject(index)
                        val uuid = UUID.fromString(jsonObject.getString("id"))
                        val name = jsonObject.getString("name")
                        val wishList = WishList(uuid, name)
                        wishLists.add(wishList)
                    } catch (exception: JSONException) {
                        exception.printStackTrace();
                    }
                }
                completionHandler(wishLists, null)
            },
            { error ->
                completionHandler(null, error)
            }
        ) {
            override fun getHeaders(): MutableMap<String, String> {
                return AppConfig.createRequestHeaders(idToken)
            }
        }
        requestQueue.add(request)

    }

}