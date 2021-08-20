package io.wantic.app.share.activities

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Message
import android.util.DisplayMetrics
import android.util.Log
import android.util.Patterns
import android.view.Gravity.CENTER_HORIZONTAL
import android.view.View
import android.webkit.*
import android.widget.*
import android.widget.LinearLayout.VERTICAL
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.app.ActivityCompat.finishAffinity
import androidx.core.view.setPadding
import androidx.gridlayout.widget.GridLayout
import androidx.gridlayout.widget.GridLayout.CENTER
import com.google.firebase.analytics.FirebaseAnalytics
import com.squareup.picasso.Picasso
import io.wantic.app.R
import io.wantic.app.share.models.ProductInfo
import io.wantic.app.share.models.SelectedProductImageView
import io.wantic.app.share.utils.AndroidJSInterface
import io.wantic.app.share.utils.AuthService
import io.wantic.app.share.utils.FeedbackService
import kotlinx.serialization.*
import java.util.regex.Matcher


class SelectProductImageActivity : AppCompatActivity() {

    companion object {
        private const val LOG_TAG = "SelectProductImage"
    }

    // public

    lateinit var loadingSpinner: ProgressBar

    var infoLoaded = false
    var productInfoList: List<ProductInfo> = emptyList()

    // private

    private lateinit var webView: WebView
    private lateinit var gridLayout: GridLayout
    private lateinit var actionButton: Button
    private lateinit var incomingHandler: Handler

    private var selectedView: SelectedProductImageView = SelectedProductImageView()

    private var webViewSuccess = true

    // life cycle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_product_image)
        initToolbar()

        Log.d(LOG_TAG, "onCreate intent action = ${intent?.action}, intent type = ${intent?.type}")

        loadingSpinner = findViewById(R.id.loading_spinner)

        if (intent?.action == Intent.ACTION_SEND) {
            loadingSpinner.visibility = View.VISIBLE
            incomingHandler = initIncomingHandler()
            incomingHandler.sendMessageDelayed(Message(), 10000)

            when {
                intent.type?.startsWith("text/") == true -> {
                    handleIntentTypeText()
                }
                intent.type?.startsWith("image/") == true -> {
                    handleIntentTypeImage()
                }
                else -> {
                    stopLoading()
                }
            }
        } else {
            showNoImagesFoundFeedback()
        }
    }

    private fun initIncomingHandler() = object : Handler(mainLooper) {
        override fun handleMessage(msg: Message) {
            val self = this@SelectProductImageActivity
            if (self.loadingSpinner.visibility != View.GONE) {
                self.loadingSpinner.visibility = View.GONE
                if (self.productInfoList.isEmpty()) {
                    self.showNoImagesFoundFeedback()
                }
            }
        }
    }

    private fun handleIntentTypeImage() {
        val extraText = intent?.extras?.getString(Intent.EXTRA_TEXT)
        if (extraText != null) {
            val links = extractLinks(extraText)
            if (links.size == 1) {
                this.initWebView(links.first())
            } else {
                stopLoading()
            }
        }
    }

    private fun handleIntentTypeText() {
        val textContent = intent.getStringExtra(Intent.EXTRA_TEXT)
        if (textContent != null) {
            Log.d(LOG_TAG, textContent)
            if (URLUtil.isValidUrl(textContent)) {
                this.initWebView(textContent)
            } else {
                val links = extractLinks(textContent)
                if (links.size == 1) {
                    this.initWebView(links.first())
                } else {
                    stopLoading()
                }
            }
        } else {
            stopLoading()
        }
    }

    private fun stopLoading() {
        loadingSpinner.visibility = View.GONE
        showNoImagesFoundFeedback()
    }

    fun showNoImagesFoundFeedback() {
        AlertDialog.Builder(this)
            .setTitle(R.string.title_no_product_info_found)
            .setMessage(R.string.message_no_product_info_found)
            .setNegativeButton(R.string.button_label_close) { _, _ ->
                finishAffinity(this)
            }
            .show()
    }

    private fun extractLinks(text: String): Array<String> {
        val links: MutableList<String> = ArrayList()
        val m: Matcher = Patterns.WEB_URL.matcher(text)
        while (m.find()) {
            val url: String = m.group()
            Log.d(LOG_TAG, "URL extracted: $url")
            links.add(url)
        }
        return links.toTypedArray()
    }

    private fun initToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        // create action button
        actionButton = toolbar.findViewById(R.id.toolbarActionButton)
        actionButton.text = resources.getString(R.string.toolbar_button_next)

        disableButton(actionButton)

        actionButton.setOnClickListener {
            val navigationIntent = Intent(this, EditProductDetailsActivity::class.java)
            val productInfo = productInfoList.find { it.id == selectedView.imageView?.tag ?: false }
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

    @SuppressLint("SetJavaScriptEnabled")
    private fun initWebView(productUrlString: String) {
        webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(AndroidJSInterface(this), "Android")
        webView.webViewClient = createWebViewClient()
        webView.loadUrl(productUrlString)
    }

    private fun createWebViewClient() = object : WebViewClient() {

        override fun onPageFinished(view: WebView?, url: String?) {
            Log.d(LOG_TAG, "onPageFinished")
            val self = this@SelectProductImageActivity
            if (self.productInfoList.isEmpty() && webViewSuccess) {
                if (webViewSuccess) {
                    val jsonString = self.loadJsFileContent()
                    Log.d(LOG_TAG, "web page loading finished")
                    view?.evaluateJavascript(jsonString, null)
                } else {
                    showNoImagesFoundFeedback()
                }
            } else {
                loadingSpinner.visibility = View.GONE
            }
        }

        override fun onReceivedError(
            view: WebView?,
            request: WebResourceRequest?,
            error: WebResourceError?
        ) {
            if (error != null) {
                Log.e(LOG_TAG, "web page onReceivedError ${error.errorCode}")
            }
            webViewSuccess = false
            super.onReceivedError(view, request, error)
        }

        override fun shouldOverrideUrlLoading(view: WebView, url: String?): Boolean {
            // avoid following redirects
            Log.d(LOG_TAG, "web page shouldOverrideUrlLoading $url")
            if (url != null) {
                view.loadUrl(url)
            }
            return false // then it is not handled by default action
        }
    }

    private fun loadJsFileContent(): String {
        val fileName = "find-product-info.js"
        return application.assets.open(fileName).bufferedReader().use {
            it.readText()
        }
    }


    override fun onStart() {
        super.onStart()
        AuthService.getIdToken { idToken ->
            if (idToken == null) {
                FeedbackService.showNotAuthorizedAlert(this)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        val eventParams = Bundle()
        eventParams.putString(FirebaseAnalytics.Param.SCREEN_NAME, "share_extension-picture")
        FirebaseAnalytics.getInstance(this).logEvent(FirebaseAnalytics.Event.SCREEN_VIEW, eventParams)
    }

    fun initGridLayout(productInfos: List<ProductInfo>) {
        val columnCount = 2
        val rowCount = productInfos.size / columnCount

        gridLayout = findViewById(R.id.productImagesGridLayout)
        gridLayout.columnCount = columnCount
        gridLayout.rowCount = rowCount

        Log.d(LOG_TAG, "columnCount: $columnCount, rowCount: $rowCount, numberOfImages: ${productInfos.size}")

        var currentColumn = 0
        var currentRow = 0
        for (itemIndex in 0 until productInfos.size-1) {
            if (currentColumn == columnCount) {
                currentColumn = 0
                currentRow++
            }
            val productInfo = productInfos[itemIndex]
            val uri = Uri.parse(productInfo.imageUrl)
            val linearLayout = this.createProductView(uri, productInfo.id)

            val rowSpan = GridLayout.spec(GridLayout.UNDEFINED, 1, CENTER)
            val colSpan = GridLayout.spec(GridLayout.UNDEFINED, 1, CENTER)

            val halfMargin = 8
            val gridLayoutParams = GridLayout.LayoutParams(rowSpan, colSpan)
            if (currentColumn % columnCount == 0) {
                gridLayoutParams.rightMargin = halfMargin
            } else if (currentColumn % columnCount == 1) {
                gridLayoutParams.leftMargin = halfMargin
            }
            gridLayoutParams.bottomMargin = halfMargin
            gridLayoutParams.topMargin = halfMargin
            gridLayout.addView(linearLayout, gridLayoutParams)

            currentColumn++
        }
    }

    private fun createProductView(imageUri: Uri, productInfoId: UInt): LinearLayout {
        // calculate width and height
        val displayMetrics = getDisplayMetrics()
        val margin = 16
        val numberOfImagesInRow = 2
        val imageWidth = (displayMetrics.widthPixels / numberOfImagesInRow) - (margin * 4)

        // linear layout
        val linearLayout = LinearLayout(this)
        val linearLayoutParams = LinearLayout.LayoutParams(imageWidth, imageWidth)
        linearLayout.layoutParams = linearLayoutParams
        linearLayout.orientation = VERTICAL
        linearLayout.setBackgroundResource(R.drawable.rounded_corner_white_border)


        // init image view
        val imageViewLayoutParams = LinearLayout.LayoutParams(imageWidth, imageWidth)
        imageViewLayoutParams.gravity = CENTER_HORIZONTAL
        val imageView = ImageView(this)
        imageView.tag = productInfoId
        imageView.setPadding(8)
        imageView.layoutParams = imageViewLayoutParams
        imageView.setOnClickListener {
            selectedView.linearLayout?.setBackgroundResource(R.drawable.rounded_corner_white_border)
            if (selectedView.imageView == imageView) {
                selectedView = SelectedProductImageView()
                disableButton(actionButton)
            } else {
                selectedView = SelectedProductImageView(linearLayout, imageView)
                linearLayout.setBackgroundResource(R.drawable.rounded_corner_black_border)
                enableButton(actionButton)
            }
        }

        // load image into view
        Picasso.get()
            .load(imageUri)
            .placeholder(R.drawable.rounded_corner)
            .resize(imageWidth, imageWidth)
            .onlyScaleDown()
            .centerInside()
            .into(imageView)

        linearLayout.addView(imageView)
        return linearLayout
    }

    private fun getDisplayMetrics(): DisplayMetrics {
        val outMetrics = DisplayMetrics()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val display = this.display
            display?.getRealMetrics(outMetrics)
        } else {
            @Suppress("DEPRECATION")
            val display = this.windowManager.defaultDisplay
            @Suppress("DEPRECATION")
            display.getMetrics(outMetrics)
        }
        return outMetrics
    }


}