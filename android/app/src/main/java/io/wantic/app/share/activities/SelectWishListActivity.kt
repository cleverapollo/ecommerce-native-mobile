package io.wantic.app.share.activities

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import android.widget.AbsListView.CHOICE_MODE_SINGLE
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.android.volley.RequestQueue
import com.android.volley.toolbox.Volley
import com.squareup.picasso.Picasso
import io.wantic.app.AppConfig
import io.wantic.app.R
import io.wantic.app.share.adapters.WishListArrayAdapter
import io.wantic.app.share.models.ProductInfo
import io.wantic.app.share.models.Wish
import io.wantic.app.share.models.WishList
import io.wantic.app.share.network.WishApiService
import io.wantic.app.share.network.WishListApiService
import io.wantic.app.share.utils.AuthService
import io.wantic.app.share.utils.CircleTransform
import io.wantic.app.share.utils.FeedbackService


class SelectWishListActivity : AppCompatActivity() {

    companion object {
        private const val LOG_TAG = "SelectWishListActivity"
    }

    private lateinit var requestQueue: RequestQueue
    private lateinit var wishListApiService: WishListApiService
    private lateinit var wishApiService: WishApiService

    private lateinit var productInfo: ProductInfo
    private lateinit var productImageView: ImageView
    private lateinit var wishListListView: ListView
    private lateinit var wishListArrayAdapter: WishListArrayAdapter
    private lateinit var loadingSpinner: ProgressBar
    private lateinit var actionButton: Button

    private var wish: Wish? = null
        set(value) {
            if (value == null) {
                disableButton(this.actionButton)
            } else {
                enableButton(this.actionButton)
            }
            field = value
        }

    private var idToken: String? = null
    private var wishLists: ArrayList<WishList> = ArrayList()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_wish_list)
        loadingSpinner = findViewById(R.id.loading_spinner)
        initToolbar()

        productInfo = intent.getSerializableExtra("productInfo") as ProductInfo
        Log.d(LOG_TAG, "productInfo: $productInfo")

        initProductImageView()
        initWishListListView()

        initNetworkServices()
    }

    private fun initNetworkServices() {
        requestQueue = Volley.newRequestQueue(this)
        this.wishListApiService = WishListApiService(requestQueue)
        this.wishApiService = WishApiService(requestQueue)
    }

    private fun initWishListListView() {
        wishListListView = findViewById(R.id.wish_list_list_view)
        wishListListView.choiceMode = CHOICE_MODE_SINGLE
        wishListListView.onItemClickListener =
            AdapterView.OnItemClickListener { _, view, position, _ ->
                val wishList: WishList = this.wishLists[position]
                Log.d(LOG_TAG, "UUID: ${wishList.id}")
                wish = Wish.create(productInfo, wishList.id)
                wishListArrayAdapter.selectWishListItem(view)
            }
    }

    private fun initProductImageView() {
        productImageView = findViewById(R.id.product_image_thumbnail)
        val imageUri = Uri.parse(productInfo.imageUrl)
        if (imageUri != null) {
            Picasso.get()
                .load(imageUri)
                .fit()
                .centerInside()
                .transform(CircleTransform())
                .into(productImageView)
        }
    }

    private fun initToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        // create action button
        actionButton = toolbar.findViewById(R.id.toolbarActionButton)
        actionButton.setOnClickListener {
            if (idToken != null && wish != null) {
                saveWish(idToken!!, wish!!)
            }
        }
        disableButton(this.actionButton)

        // create close button
        val closeButton: ImageButton = toolbar.findViewById(R.id.toolbarCloseButton)
        closeButton.setOnClickListener {
            finishAffinity()
        }
    }

    private fun disableButton(button: Button) {
        button.isEnabled = false
        actionButton.background.alpha = 128
    }

    private fun enableButton(button: Button) {
        button.isEnabled = true
        actionButton.background.alpha = 255
    }

    override fun onStart() {
        super.onStart()
        AuthService.getIdToken { idToken ->
            if (idToken != null) {
                this.idToken = idToken
                loadWishLists(idToken)
            } else {
                FeedbackService.showNotAuthorizedAlert(this)
            }
        }
    }

    private fun loadWishLists(idToken: String) {
        loadingSpinner.visibility = View.VISIBLE
        this.wishListApiService.getWishLists(idToken) { wishLists, error ->
            loadingSpinner.visibility = View.GONE
            when {
                wishLists != null -> {
                    this.wishLists = wishLists
                    if (this.wishLists.isNotEmpty()) {
                        wishListArrayAdapter = WishListArrayAdapter(applicationContext, wishLists)
                        wishListListView.adapter = wishListArrayAdapter
                        wishListListView.setItemChecked(0, true)
                        wish = Wish.create(this.productInfo, wishLists[0].id)
                    } else {
                       showNoWishListsFoundDialog()
                    }
                }
                error != null -> {
                    Log.e(LOG_TAG, "Response error: $error")
                }
                else -> {
                    Log.e(LOG_TAG, "Undefined case: Error and wishLists are null")
                }
            }
        }
    }

    private fun showNoWishListsFoundDialog() {
        AlertDialog.Builder(this)
            .setTitle(R.string.title_no_wish_lists)
            .setMessage(R.string.message_no_wish_lists)
            .setNeutralButton(R.string.button_label_create_wish_list_now) { _, _ ->
                openDeepLink("${AppConfig.appUrl}/secure/home/wish-list-new")
            }
            .setNegativeButton(R.string.button_label_close) { _, _ ->
                finishAffinity()
            }
            .show()
    }

    private fun openDeepLink(url: String) {
        val webpage: Uri = Uri.parse(url)
        val intent = Intent(Intent.ACTION_VIEW, webpage)
        if (intent.resolveActivity(packageManager) != null) {
            startActivity(intent)
        }
    }

    private fun saveWish(idToken: String, wish: Wish) {
        if (this.wish == null) { return }
        loadingSpinner.visibility = View.VISIBLE
        this.wishApiService.saveWish(idToken, wish) { successfullySaved, error ->
            loadingSpinner.visibility = View.GONE
            when {
                successfullySaved -> {
                    showSuccessAlert(wish)
                }
                !successfullySaved && error != null -> {
                    showErrorAlert(idToken, wish)
                }
                else -> {
                    Log.e(LOG_TAG, "Undefined case: successfullySaved: $successfullySaved, error: $error")
                }
            }
        }
    }

    private fun showErrorAlert(idToken: String, wish: Wish) {
        AlertDialog.Builder(this)
            .setMessage(R.string.message_failed_to_save_wish)
            .setNeutralButton(R.string.button_label_retry) { _, _ ->
                saveWish(idToken, wish)
            }
            .setNegativeButton(R.string.button_label_done) { _, _ ->
                finishAffinity()
            }
            .show()
    }

    private fun showSuccessAlert(wish: Wish) {
        AlertDialog.Builder(this)
            .setMessage(R.string.message_wish_successfully_saved)
            .setPositiveButton(R.string.button_label_show_wish) { _, _ ->
                openDeepLink("${AppConfig.appUrl}/secure/home/wish-list/${wish.wishListId}?forceRefresh=true")
            }
            .setNeutralButton(R.string.button_label_done) { _, _ ->
                finishAffinity()
            }
            .show()
    }


}