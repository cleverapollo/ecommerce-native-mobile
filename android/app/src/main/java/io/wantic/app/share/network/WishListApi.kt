package io.wantic.app.share.network

import com.android.volley.VolleyError
import io.wantic.app.share.models.WishList

interface WishListApi {
    fun getWishLists(idToken: String, completionHandler: (wishLists: ArrayList<WishList>?, error: VolleyError?) -> Unit)
    fun createNewWishList(idToken: String, wishListName: String, completionHandler: (wishList: WishList?, error: VolleyError?) -> Unit)
}