package io.wantic.app.share.network

import android.content.Context
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.VolleyError
import com.android.volley.toolbox.Volley
import io.wantic.app.share.models.Wish
import io.wantic.app.share.models.WishList

class NetworkService constructor(context: Context): RestApi {

    companion object {
        @Volatile
        private var INSTANCE: NetworkService? = null
        fun getInstance(context: Context) =
            INSTANCE ?: synchronized(this) {
                INSTANCE ?: NetworkService(context).also {
                    INSTANCE = it
                }
            }
    }

    private val wishListResource: WishListResource = WishListResource()
    private val wishResource: WishResource = WishResource()
    private val requestQueue: RequestQueue by lazy {
        // applicationContext is key, it keeps you from leaking the
        // Activity or BroadcastReceiver if someone passes one in.
        Volley.newRequestQueue(context.applicationContext)
    }

    override fun getWishLists(idToken: String, completionHandler: (wishLists: ArrayList<WishList>?, error: VolleyError?) -> Unit) {
        val request = wishListResource.getWishLists(idToken, completionHandler)
        addToRequestQueue(request);
    }

    override fun createNewWishList(idToken: String, wishListName: String, completionHandler: (wishList: WishList?, error: VolleyError?) -> Unit) {
        val request = wishListResource.createNewWishList(idToken, wishListName, completionHandler)
        addToRequestQueue(request)
    }

    override fun saveWish(idToken: String, wish: Wish, completionHandler: (successfullySaved: Boolean, error: VolleyError?) -> Unit) {
        val request = wishResource.saveWish(idToken, wish, completionHandler)
        addToRequestQueue(request)
    }

    private fun <T> addToRequestQueue(req: Request<T>) {
        requestQueue.add(req)
    }
}