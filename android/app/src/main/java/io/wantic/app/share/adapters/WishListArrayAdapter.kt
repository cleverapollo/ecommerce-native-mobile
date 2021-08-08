package io.wantic.app.share.adapters

import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.View.INVISIBLE
import android.view.View.VISIBLE
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.res.ResourcesCompat
import io.wantic.app.R
import io.wantic.app.share.models.WishList


class WishListArrayAdapter(
    context: Context,
    val wishLists: ArrayList<WishList>
) : ArrayAdapter<WishList>(context, 0, wishLists) {

    private var checkedItem: View? = null

    private companion object {
        private const val LOG_TAG = "WishListArrayAdapter"
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        Log.d(LOG_TAG, "Created item on position $position")

        var listItem = convertView
        if (listItem == null) listItem = LayoutInflater.from(context).inflate(R.layout.wish_list_item, parent, false)
        listItem = listItem!!

        val wishList = wishLists[position]
        Log.d(LOG_TAG, "wish list is $wishList")

        //
        val textViewWishListName: TextView = listItem.findViewById(R.id.textViewListItem)
        textViewWishListName.text = wishList.name
        textViewWishListName.typeface = ResourcesCompat.getFont(context, R.font.roboto_medium)

        //
        val imageViewCheckMark: ImageView = listItem.findViewById(R.id.imageViewCheckMark)
        imageViewCheckMark.visibility = INVISIBLE
        Log.d(LOG_TAG, "imageViewCheckMark $imageViewCheckMark")
        if (position == 0) {
            checkedItem = listItem
            imageViewCheckMark.visibility = VISIBLE
            listItem.setBackgroundResource(R.drawable.rounded_corner_top)
        } else if (position == wishLists.lastIndex) {
            listItem.setBackgroundResource(R.drawable.rounded_corner_bottom)
        }

        //
        val imageViewBottomBorder: ImageView = listItem.findViewById(R.id.imageViewBottomBorder)
        if (position == wishLists.lastIndex) {
            imageViewBottomBorder.visibility = INVISIBLE
        }

        return listItem
    }

    fun selectWishListItem(listItem: View) {
        if (listItem == checkedItem) { return }

        if (this.checkedItem != null) {
            val imageViewVisibleCheckMark: ImageView = this.checkedItem!!.findViewById(R.id.imageViewCheckMark)
            imageViewVisibleCheckMark.visibility = INVISIBLE
        }

        val imageViewCheckMark: ImageView = listItem.findViewById(R.id.imageViewCheckMark)
        imageViewCheckMark.visibility = VISIBLE
        checkedItem = listItem
    }


}