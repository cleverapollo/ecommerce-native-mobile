package io.wantic.app.share.activities

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.View.GONE
import android.view.View.VISIBLE
import android.widget.*
import android.widget.AbsListView.CHOICE_MODE_SINGLE
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.android.volley.RequestQueue
import com.android.volley.TimeoutError
import com.android.volley.toolbox.Volley
import io.wantic.app.R
import io.wantic.app.share.adapters.WishListArrayAdapter
import io.wantic.app.share.core.analytics.AnalyticsTracking
import io.wantic.app.share.core.analytics.GoogleAnalytics
import io.wantic.app.share.core.extensions.hideKeyboard
import io.wantic.app.share.core.ui.UIConstants.IMAGE_FALLBACK
import io.wantic.app.share.core.ui.media.*
import io.wantic.app.share.models.ProductInfo
import io.wantic.app.share.models.Wish
import io.wantic.app.share.models.WishList
import io.wantic.app.share.network.WishApi
import io.wantic.app.share.network.WishApiService
import io.wantic.app.share.network.WishListApi
import io.wantic.app.share.network.WishListApiService
import io.wantic.app.share.utils.AlertService
import io.wantic.app.share.utils.AuthService
import io.wantic.app.share.utils.CircleTransform
import io.wantic.app.share.utils.ToastService


class SelectWishListActivity : AppCompatActivity() {

    companion object {
        private const val LOG_TAG = "SelectWishListActivity"
    }

    // network
    private lateinit var requestQueue: RequestQueue
    private lateinit var wishListApiService: WishListApi
    private lateinit var wishApiService: WishApi
    private lateinit var analytics: AnalyticsTracking

    // auth
    private var idToken: String? = null

    // wish list list
    private lateinit var wishListListView: ListView
    private lateinit var wishListArrayAdapter: WishListArrayAdapter
    private lateinit var textViewNoWishListsHint: TextView

    private var wishLists: ArrayList<WishList> = ArrayList()
        set(value) {
            if (value.isEmpty()) {
                textViewNoWishListsHint.visibility = VISIBLE
            } else if (textViewNoWishListsHint.visibility == VISIBLE) {
                textViewNoWishListsHint.visibility = GONE
            }
            field = value
        }

    // wish
    private lateinit var productInfo: ProductInfo
    private lateinit var productImageView: ImageView

    private var wish: Wish? = null
        set(value) {
            if (value == null) {
                disableButton(this.actionButton)
            } else {
                enableButton(this.actionButton)
            }
            field = value
        }

    // generic
    private lateinit var loadingSpinner: ProgressBar
    private lateinit var actionButton: Button

    // Create new wish list ui items
    private lateinit var editTextNewWishListName: EditText
    private lateinit var buttonSaveNewWishList: Button
    private lateinit var buttonAddNewWishList: Button

    private var newWishListName: String
        get() {
            return editTextNewWishListName.text.toString()
        }
        set(value) {
            editTextNewWishListName.setText(value)
        }

    // UI
    private var graphicsHandler: GraphicsHandling = GraphicsHandler(
        BitmapGraphicsHandler(), VectorGraphicsHandler(this)
    )

    // life cycle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_wish_list)

        setupBusyIndicator()
        setupToolbar()
        setupNetworkServices()

        setupData()

        setupProductImageView()
        setupNewWishListUIItems()
        setupWishListListView()

        clearKeyboardFocusOnClickOutsideForm(findViewById(R.id.activity_select_wish_list_parent))
    }

    private fun setupData() {
        productInfo = intent.getSerializableExtra("productInfo") as ProductInfo
        Log.d(LOG_TAG, "productInfo: $productInfo")
    }

    private fun setupBusyIndicator() {
        loadingSpinner = findViewById(R.id.loading_spinner)
    }

    private fun clearKeyboardFocusOnClickOutsideForm(view: View) {
        view.setOnClickListener {
            clearFocusOnEditTextAndKeyboard()
        }
    }

    private fun setupNetworkServices() {
        requestQueue = Volley.newRequestQueue(this)
        this.analytics = GoogleAnalytics.init()
        this.wishListApiService = WishListApiService(requestQueue)
        this.wishApiService = WishApiService(requestQueue)
    }

    private fun setupWishListListView() {
        textViewNoWishListsHint = findViewById(R.id.hint_no_wish_lists)
        wishListArrayAdapter = WishListArrayAdapter(applicationContext, this.wishLists)

        wishListListView = findViewById(R.id.wish_list_list_view)
        wishListListView.adapter = wishListArrayAdapter
        wishListListView.choiceMode = CHOICE_MODE_SINGLE
        wishListListView.onItemClickListener =
            AdapterView.OnItemClickListener { _, _, position, _ ->
                clearFocusOnEditTextAndKeyboard()
                val wishList: WishList = this.wishLists[position]
                wish = Wish.create(productInfo, wishList.id)
                wishListArrayAdapter.selectItem(position)
            }
    }

    private fun clearFocusOnEditTextAndKeyboard() {
        if (editTextNewWishListName.hasFocus()) {
            hideKeyboard()
            editTextNewWishListName.clearFocus()
        }
    }

    private fun setupProductImageView() {
        productImageView = findViewById(R.id.product_image_thumbnail)

        var imageUri: Uri? = null
        if (productInfo.imageUrl != null) {
            imageUri = Uri.parse(productInfo.imageUrl)
        }

        val options = GraphicOptions(transformation = CircleTransform())
        if (imageUri != null) {
            graphicsHandler.loadImageUrlIntoView(imageUri, productImageView, options)
        } else {
            graphicsHandler.loadGraphicResourceIntoView(IMAGE_FALLBACK, productImageView, options)
        }
    }

    private fun setupNewWishListUIItems() {
        buttonAddNewWishList = findViewById(R.id.button_add_new_wish_list)
        buttonAddNewWishList.setOnClickListener {
            toggleNewWishListUIElements()
        }

        editTextNewWishListName = findViewById(R.id.new_wish_list_name)
        buttonSaveNewWishList = findViewById(R.id.button_save_new_wish_list)
        buttonSaveNewWishList.setOnClickListener {
            val formIsValid = validateForm()
            if (idToken != null && formIsValid) {
                saveWishList(idToken!!, newWishListName)
            }
        }
    }

    private fun toggleNewWishListUIElements() {
        if (buttonAddNewWishList.visibility == VISIBLE) {
            buttonAddNewWishList.visibility = GONE
            editTextNewWishListName.visibility = VISIBLE
            buttonSaveNewWishList.visibility = VISIBLE
        } else {
            buttonAddNewWishList.visibility = VISIBLE
            editTextNewWishListName.visibility = GONE
            buttonSaveNewWishList.visibility = GONE
        }
    }

    private fun validateForm(): Boolean {
        if (newWishListName.isBlank()) {
            editTextNewWishListName.error = resources.getString(R.string.wish_list_required_name)
            return false
        }
        return true
    }

    private fun setupToolbar() {
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
                AlertService.showNotAuthorizedAlert(this)
            }
        }
    }

    private fun loadWishLists(idToken: String) {
        loadingSpinner.visibility = VISIBLE
        this.wishListApiService.getWishLists(idToken) { items, error ->
            loadingSpinner.visibility = GONE
            when {
                items != null -> {
                    this.wishLists = items
                    updateWishLists(this.wishLists)
                    checkFirstWishListItem()
                }
                error != null -> {
                    Log.e(LOG_TAG, "Response error: $error")
                    if (error is TimeoutError) {
                        // ToDo: retry reloading
                    }
                }
                else -> {
                    Log.e(LOG_TAG, "Undefined case: Error and wishLists are null")
                }
            }
        }
    }

    private fun updateWishLists(wishLists: ArrayList<WishList>) {
        wishListArrayAdapter.clear()
        for (wishList in wishLists) {
            wishListArrayAdapter.insert(wishList, wishListArrayAdapter.count)
        }
        wishListArrayAdapter.notifyDataSetChanged()
    }

    private fun openDeepLink(url: String) {
        val webpage: Uri = Uri.parse(url)
        val intent = Intent(Intent.ACTION_VIEW, webpage)
        if (intent.resolveActivity(packageManager) != null) {
            startActivity(intent)
            finishAffinity()
        }
    }

    private fun saveWishList(idToken: String, wishListName: String) {
        loadingSpinner.visibility = VISIBLE
        this.wishListApiService.createNewWishList(idToken, wishListName) { wishList, error ->
            loadingSpinner.visibility = GONE
            toggleNewWishListUIElements()
            when {
                wishList != null -> {
                    wishListArrayAdapter.addWishList(wishList)
                    checkFirstWishListItem()
                    newWishListName = ""
                    val toastMessage = resources.getString(R.string.message_wish_list_successfully_saved)
                    ToastService.showToast(this, toastMessage)
                    hideKeyboard()
                }
                error != null -> {
                    Log.e(LOG_TAG, "Response error: $error")
                    showErrorAlert(idToken, wishListName)
                }
                else -> {
                    Log.e(LOG_TAG, "Undefined case: wishList: $wishList, error: $error")
                }
            }
        }
    }

    private fun showErrorAlert(idToken: String, wishListName: String) {
        AlertDialog.Builder(this)
            .setMessage(R.string.message_failed_to_save_new_wish_list)
            .setNeutralButton(R.string.button_label_retry) { _, _ ->
                saveWishList(idToken, wishListName)
            }
            .show()
    }

    private fun checkFirstWishListItem() {
        if (this.wishLists.isEmpty()) { return }
        wishListListView.setItemChecked(0, true)
        wish = Wish.create(this.productInfo, wishLists[0].id)
    }

    private fun saveWish(idToken: String, wish: Wish) {
        if (this.wish == null) { return }
        loadingSpinner.visibility = VISIBLE
        this.wishApiService.saveWish(idToken, wish) { successfullySaved, error ->
            loadingSpinner.visibility = GONE
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
        val appLinkScheme = resources.getString(R.string.app_link_scheme)
        AlertDialog.Builder(this)
            .setMessage(R.string.message_wish_successfully_saved)
            .setPositiveButton(R.string.button_label_show_wish) { _, _ ->
                openDeepLink("${appLinkScheme}://secure/home/wish-list/${wish.wishListId}?forceRefresh=true")
            }
            .setNeutralButton(R.string.button_label_done) { _, _ ->
                finishAffinity()
            }
            .show()
    }

    override fun onResume() {
        super.onResume()
        analytics.logScreenEvent("share_extension-wishlist")
    }

}