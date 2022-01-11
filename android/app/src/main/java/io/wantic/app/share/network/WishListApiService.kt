package io.wantic.app.share.network

import android.util.Log
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.VolleyError
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.google.gson.Gson
import io.wantic.app.AppConfig
import io.wantic.app.share.models.WishList
import org.json.JSONException
import org.json.JSONObject
import java.util.*
import kotlin.collections.ArrayList

class WishListApiService(private val requestQueue: RequestQueue): WishListApi {

    companion object {
        private const val LOG_TAG = "WishListApiService"
        private const val RESOURCE_URI = "v1/wish-lists"
    }

    private val url: String = "${AppConfig.backendUrl}/$RESOURCE_URI"

    override fun getWishLists(idToken: String, completionHandler: (wishLists: ArrayList<WishList>?, error: VolleyError?) -> Unit) {
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
                        exception.printStackTrace()
                    }
                }
                val sortedWishLists = wishLists.sortedBy { it.name }
                completionHandler(ArrayList(sortedWishLists), null)
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

    override fun createNewWishList(idToken: String, wishListName: String, completionHandler: (wishList: WishList?, error: VolleyError?) -> Unit) {
        val requestBody = JSONObject()
        requestBody.put("name", wishListName);
        requestBody.put("showReservedWishes", false);
        val request = object : JsonObjectRequest(Method.POST, url, requestBody,
            Response.Listener { response ->
                val gson = Gson()
                val jsonString = String.format(response.toString())
                val wishList = gson.fromJson(jsonString, WishList::class.java)
                completionHandler(wishList, null);
            },
            Response.ErrorListener { error ->
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