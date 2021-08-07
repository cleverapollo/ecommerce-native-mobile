package io.wantic.app.share.activities

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.content.res.ResourcesCompat
import androidx.core.widget.addTextChangedListener
import com.squareup.picasso.Picasso
import io.wantic.app.R
import io.wantic.app.share.models.ProductInfo
import io.wantic.app.share.utils.DecimalDigitsInputFilter
import io.wantic.app.share.utils.onRightDrawableClicked
import java.text.DecimalFormatSymbols


class EditProductDetailsActivity : AppCompatActivity() {

    companion object {
        private const val LOG_TAG = "EditProductDetails"
    }

    private lateinit var productImageView: ImageView
    private lateinit var productNameView: EditText
    private lateinit var productPriceView: EditText
    private lateinit var actionButton: Button

    private var productInfo: ProductInfo? = null
        set(value) {
            if (value != null) {
                enableButton(this.actionButton)
            } else {
                disableButton(this.actionButton)
            }
            field = value
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_product_details)
        initToolbar()

        productInfo = intent.getSerializableExtra("productInfo") as ProductInfo
        assert(productInfo != null)
        initProductImageView()
        initProductNameView()
        initProductPriceView()
    }

    private fun initProductPriceView() {
        productPriceView = findViewById(R.id.productPrice)
        productPriceView.setText(String.format("%.2f", productInfo!!.price))
        productPriceView.setOnFocusChangeListener { view, hasFocus ->
            if (!hasFocus) {
                this.hideKeyboard(view)
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
            this.productInfo!!.price = price
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
        productNameView.setText(productInfo!!.name)
        productNameView.setOnFocusChangeListener { view, hasFocus ->
            if (!hasFocus) {
                this.hideKeyboard(view)
            }
        }
        productNameView.addTextChangedListener(afterTextChanged = { editable ->
            val text = editable.toString()
            validateInput(text, productNameView, R.string.required_name)
            this.productInfo!!.name = text
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
        val imageUri = Uri.parse(productInfo!!.imageUrl)
        if (imageUri != null) {
            Picasso.get()
                .load(imageUri)
                .fit()
                .centerInside()
                .into(productImageView)
        }
    }

    private fun initToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        // create action button
        actionButton = toolbar.findViewById(R.id.toolbarActionButton)
        actionButton.text = resources.getString(R.string.toolbar_button_next)

        actionButton.setOnClickListener {
            val navigationIntent = Intent(this, SelectWishListActivity::class.java)
            if (productInfo != null) {
                navigationIntent.putExtra("productInfo", productInfo)
            }
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

    private fun hideKeyboard(view: View) {
        val inputMethodManager: InputMethodManager =
            getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
    }

}