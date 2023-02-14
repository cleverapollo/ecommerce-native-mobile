package io.wantic.app.share.network

import com.android.volley.VolleyError
import io.wantic.app.share.models.Wish
import io.wantic.app.share.models.WishList

interface RestApi {
    fun getWishLists(idToken: String, completionHandler: (wishLists: ArrayList<WishList>?, error: VolleyError?) -> Unit)
    fun createNewWishList(idToken: String, wishListName: String, completionHandler: (wishList: WishList?, error: VolleyError?) -> Unit)
    fun saveWish(idToken: String, wish: Wish, completionHandler: (successfullySaved: Boolean, error: VolleyError?) -> Unit)
}