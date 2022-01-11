package io.wantic.app.share.adapters

import android.content.Context
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

    var selectedItemPosition: Int = 0

    private companion object {
        private const val LOG_TAG = "WishListArrayAdapter"
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // Get the data item for this position
        val wishList = getItem(position)

        // Check if an existing view is being reused, otherwise inflate the view
        var listItem = convertView
        if (convertView == null) listItem = LayoutInflater.from(context).inflate(R.layout.wish_list_item, parent, false)
        listItem = listItem!!

        // wish list name
        val textViewWishListName: TextView = listItem.findViewById(R.id.textViewListItem)
        if (wishList != null) {
            textViewWishListName.text = wishList.name
        }
        textViewWishListName.typeface = ResourcesCompat.getFont(context, R.font.roboto_medium)

        // background
        if (position != wishLists.lastIndex) {
            listItem.setBackgroundResource(R.drawable.wish_list_item_background)
        } else {
            listItem.setBackgroundResource(R.drawable.rounded_corner_bottom)
        }

        // border bottom
        val imageViewBottomBorder: ImageView = listItem.findViewById(R.id.imageViewBottomBorder)
        if (position != wishLists.lastIndex) {
            imageViewBottomBorder.visibility = VISIBLE
        } else {
            imageViewBottomBorder.visibility = INVISIBLE
        }

        // check mark
        val imageViewCheckMark: ImageView = listItem.findViewById(R.id.imageViewCheckMark)
        if (selectedItemPosition != position) {
            imageViewCheckMark.setBackgroundResource(R.drawable.icon_list_item_unchecked)
        } else {
            imageViewCheckMark.setBackgroundResource(R.drawable.icon_list_item_checked)
        }

        return listItem
    }

    fun selectItem(position: Int) {
        selectedItemPosition = position
        notifyDataSetChanged()
    }

    fun addWishList(wishList: WishList) {
        wishLists.add(0, wishList)
        notifyDataSetChanged()
    }


}