package io.wantic.app.share.activities

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.content.res.ResourcesCompat
import androidx.core.widget.addTextChangedListener
import io.wantic.app.R
import io.wantic.app.share.core.analytics.AnalyticsTracking
import io.wantic.app.share.core.analytics.GoogleAnalytics
import io.wantic.app.share.core.extensions.hideKeyboard
import io.wantic.app.share.core.ui.media.BitmapGraphicsHandler
import io.wantic.app.share.core.ui.media.GraphicsHandler
import io.wantic.app.share.core.ui.media.GraphicsHandling
import io.wantic.app.share.core.ui.UIConstants.IMAGE_FALLBACK
import io.wantic.app.share.core.ui.media.VectorGraphicsHandler
import io.wantic.app.share.models.ProductInfo
import io.wantic.app.share.models.ShareResult
import io.wantic.app.share.utils.DecimalDigitsInputFilter
import io.wantic.app.share.utils.onRightDrawableClicked
import java.text.DecimalFormatSymbols


class EditProductDetailsActivity : AppCompatActivity() {

    companion object {
        private const val LOG_TAG = "EditProductDetails"
    }

    // Services
    private lateinit var analytics: AnalyticsTracking
    private var graphicsHandler: GraphicsHandling = GraphicsHandler(
        BitmapGraphicsHandler(), VectorGraphicsHandler(this)
    )

    // UI
    private lateinit var productImageView: ImageView
    private lateinit var productNameView: EditText
    private lateinit var productPriceView: EditText
    private lateinit var actionButton: Button

    // Intent extras
    private lateinit var productInfo: ProductInfo
    private lateinit var shareResult: ShareResult

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics = GoogleAnalytics.init()

        setContentView(R.layout.activity_edit_product_details)
        initToolbar()
        initKeyboardHandling()

        shareResult = intent.getSerializableExtra("shareResult") as ShareResult
        productInfo = intent.getSerializableExtra("productInfo") as ProductInfo
        
        initProductImageView()
        initProductNameView()
        initProductPriceView()
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun initKeyboardHandling() {
        val parentView: View = findViewById(R.id.activity_edit_product_details_parent)
        parentView.setOnTouchListener { _, _ ->
            hideKeyboard()
            false
        }
    }

    private fun initProductPriceView() {
        productPriceView = findViewById(R.id.productPrice)
        productPriceView.setText(String.format("%.2f", productInfo.price))
        productPriceView.setOnFocusChangeListener { _, hasFocus ->
            if (!hasFocus) {
                hideKeyboard()
            }
        }
        productPriceView.filters = arrayOf(DecimalDigitsInputFilter(2))
        productPriceView.addTextChangedListener(afterTextChanged = { editable ->
            var price = 0.00f
            if (editable != null) {
                var stringValue = editable.toString()
                if (stringValue.isNotBlank()) {
                    stringValue = replaceLocalizedSeparatorWithDot(stringValue)
                    price = priceStringToFloat(stringValue)
                }
                validateInput(stringValue, productPriceView, R.string.required_price)
            }
            this.productInfo.price = price
        })
        productPriceView.onRightDrawableClicked {
            it.text.clear()
        }
    }


    private fun priceStringToFloat(stringValue: String): Float {
        var price = 0.00f
        val floatValue = stringValue.toFloatOrNull()
        if (floatValue != null) {
            price = floatValue
        }
        return price
    }

    private fun replaceLocalizedSeparatorWithDot(stringValue: String): String {
        var modifiedValue = stringValue
        val decimalSeparator = DecimalFormatSymbols.getInstance().decimalSeparator
        if (decimalSeparator != '.') {
            modifiedValue = stringValue.replace(decimalSeparator, '.')
        }
        return modifiedValue
    }

    private fun initProductNameView() {
        productNameView = findViewById(R.id.productName)
        productNameView.setText(productInfo.name)
        productNameView.setOnFocusChangeListener { _, hasFocus ->
            if (!hasFocus) {
                hideKeyboard()
            }
        }
        productNameView.addTextChangedListener(afterTextChanged = { editable ->
            val text = editable.toString()
            validateInput(text, productNameView, R.string.required_name)
            this.productInfo.name = text
        })
        productNameView.onRightDrawableClicked {
            it.text.clear()
        }
    }

    private fun validateInput(input: String, editText: EditText, requiredErrorMessageResourceId: Int) {
        if (input.isBlank()) {
            editText.error = resources.getString(requiredErrorMessageResourceId)
            editText.background = ResourcesCompat.getDrawable(
                resources,
                R.drawable.rounded_corner_form_field_error,
                this.theme
            )
            disableButton(this.actionButton)
        } else if (editText.error != null) {
            editText.error = null
            editText.background = ResourcesCompat.getDrawable(
                resources,
                R.drawable.rounded_corner_form_field,
                this.theme
            )
            enableButton(this.actionButton)
        }
    }

    private fun initProductImageView() {
        productImageView = findViewById(R.id.productImageView)

        var imageUri: Uri? = null
        if (productInfo.imageUrl != null) {
            imageUri = Uri.parse(productInfo.imageUrl)
        }

        if (imageUri != null) {
            graphicsHandler.loadImageUrlIntoView(imageUri, productImageView)
        } else {
            graphicsHandler.loadGraphicResourceIntoView(IMAGE_FALLBACK, productImageView)
        }
    }

    private fun initToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        // create action button
        actionButton = toolbar.findViewById(R.id.toolbarActionButton)
        actionButton.text = resources.getString(R.string.toolbar_button_next)
        actionButton.isEnabled = true

        actionButton.setOnClickListener {
            val navigationIntent = Intent(this, SelectWishListActivity::class.java)
            navigationIntent.putExtra("productInfo", productInfo)
            startActivity(navigationIntent)
        }

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

    override fun onResume() {
        super.onResume()
        analytics.logScreenEvent("share_extension-name-price")
    }

}