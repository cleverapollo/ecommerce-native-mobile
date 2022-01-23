package io.wantic.app.share.activities

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.*
import android.util.DisplayMetrics
import android.util.Log
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
import androidx.core.view.size
import androidx.gridlayout.widget.GridLayout
import androidx.gridlayout.widget.GridLayout.CENTER
import io.wantic.app.R
import io.wantic.app.share.core.analytics.AnalyticsTracking
import io.wantic.app.share.core.analytics.GoogleAnalytics
import io.wantic.app.share.core.ui.*
import io.wantic.app.share.core.ui.media.*
import io.wantic.app.share.models.ProductInfo
import io.wantic.app.share.models.SelectedProductImageView
import io.wantic.app.share.models.ShareResult
import io.wantic.app.share.utils.*
import kotlinx.serialization.*
import java.util.*
import kotlin.math.ceil


class SelectProductImageActivity : AppCompatActivity() {

    companion object {
        private const val LOG_TAG = "SelectProductImage"
        private const val COLUMN_COUNT = 2
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
    private lateinit var analytics: AnalyticsTracking

    private var graphicsHandler: GraphicsHandling = GraphicsHandler(
        BitmapGraphicsHandler(), VectorGraphicsHandler(this)
    )

    private var selectedView: SelectedProductImageView = SelectedProductImageView()
    private var shareResultParser: ShareResultParsing = ShareResultParser

    private var webViewSuccess = true
    private var shareResult: ShareResult? = null

    // life cycle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_product_image)
        initToolbar()

        Log.d(LOG_TAG, "onCreate intent action = ${intent?.action}, intent type = ${intent?.type}")

        loadingSpinner = findViewById(R.id.loading_spinner)
        analytics = GoogleAnalytics.init()

        if (intent?.action == Intent.ACTION_SEND) {
            startLoading()
            incomingHandler = initIncomingHandler()
            incomingHandler.sendMessageDelayed(Message(), 30000)

            when {
                intent.type?.startsWith("text/") == true -> {
                    val textContent = intent.getStringExtra(Intent.EXTRA_TEXT)
                    handleExtraTextFromIntent(textContent)
                }
                intent.type?.startsWith("image/") == true -> {
                    val textContent = intent?.extras?.getString(Intent.EXTRA_TEXT)
                    handleExtraTextFromIntent(textContent)
                }
                else -> {
                    stopLoading()
                    showNoImagesFoundFeedback()
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
                self.stopLoading()
                if (self.productInfoList.isEmpty()) {
                    if (shareResult == null) {
                        self.showNoImagesFoundFeedback()
                    } else {
                        self.navigateForward(null)
                    }
                }
            }
        }
    }

    private fun handleExtraTextFromIntent(textContent: String?) {
        if (textContent != null) {
            shareResult = shareResultParser.parseTextToShareResult(textContent)
            if (shareResult != null) {
                this.initWebView(shareResult!!.productURLString)
            } else {
                stopLoading()
                showNoImagesFoundFeedback()
            }
        } else {
            stopLoading()
            showNoImagesFoundFeedback()
        }
    }

    private fun startLoading() {
        loadingSpinner.visibility = View.VISIBLE
    }

    private fun stopLoading() {
        loadingSpinner.visibility = View.GONE
    }

    fun showNoImagesFoundFeedback() {
        if (!isFinishing) {
            AlertDialog.Builder(this@SelectProductImageActivity)
                .setTitle(R.string.title_no_product_info_found)
                .setMessage(R.string.message_no_product_info_found)
                .setNegativeButton(R.string.button_label_close) { _, _ ->
                    finishAffinity(this)
                }
                .show()
        }
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
            val productInfo = productInfoList.find { it.id == selectedView.imageView?.tag ?: false }
            navigateForward(productInfo)
        }

        // create close button
        val closeButton: ImageButton = toolbar.findViewById(R.id.toolbarCloseButton)
        closeButton.setOnClickListener {
            finishAffinity()
        }
    }

    fun navigateForward(productInfo: ProductInfo?) {
        val fallback = ProductInfo(-1, "", null, shareResult!!.productURLString)
        var productInfoExtra = fallback
        if (productInfo != null) {
            productInfoExtra = productInfo
        }
        val navigationIntent = Intent(this, EditProductDetailsActivity::class.java).apply {
            putExtra("productInfo", productInfoExtra)
            putExtra("shareResult", shareResult)
        }
        startActivity(navigationIntent)
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
        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.loadsImagesAutomatically = true
        WebView.setWebContentsDebuggingEnabled(true)

        webView.addJavascriptInterface(AndroidJSInterface(this), "Android")
        webView.webViewClient = createWebViewClient()
        webView.webChromeClient = createWebChromeClient()
        webView.loadUrl(productUrlString)
    }

    private fun createWebChromeClient() = object : WebChromeClient() {
        override fun onProgressChanged(view: WebView?, newProgress: Int) {
            Log.d(LOG_TAG, "onProgressChanged = progress: $newProgress")
            super.onProgressChanged(view, newProgress)
        }
    }

    private fun createWebViewClient() = object : WebViewClient() {

        override fun onPageFinished(view: WebView?, url: String?) {
            Log.d(LOG_TAG, "onPageFinished")
            val self = this@SelectProductImageActivity
            if (webViewSuccess) {
                val jsonString = self.loadJsFileContent()
                view?.evaluateJavascript(jsonString, null)
            } else {
                assert(shareResult != null)
                val productInfo = ProductInfo(-1, "", null, shareResult!!.productURLString)
                navigateForward(productInfo)
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
                AlertService.showNotAuthorizedAlert(this)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        analytics.logScreenEvent("share_extension-picture")
    }

    fun addNewProductInfoItem(productInfo: ProductInfo) {
        val currentList = this.productInfoList.toMutableList()
        if (currentList.add(productInfo)) {
            this.productInfoList = currentList
            if (this::gridLayout.isInitialized) {
                val newRowCount = productInfoList.size / COLUMN_COUNT
                if (gridLayout.rowCount != newRowCount) {
                    gridLayout.rowCount = newRowCount
                }
                var column = 1
                if (gridLayout.size % COLUMN_COUNT == 0) {
                    column = 0
                }
                this.addProductInfoToGridLayout(productInfo, column)
            } else {
                this.initGridLayout(this.productInfoList)
            }
        }
    }

    fun initGridLayout(productInfoList: List<ProductInfo>) {
        val rowCount = calculateRowCount(productInfoList.size)

        gridLayout = findViewById(R.id.productImagesGridLayout)
        gridLayout.columnCount = COLUMN_COUNT
        gridLayout.rowCount = rowCount

        Log.d(LOG_TAG, "columnCount: $COLUMN_COUNT, rowCount: $rowCount, numberOfImages: ${productInfoList.size}")

        var column = 0
        var row = 0
        for (productInfo in productInfoList) {
            if (column == COLUMN_COUNT) {
                column = 0
                row++
            }
            addProductInfoToGridLayout(productInfo, column)

            column++
        }
    }

    private fun calculateRowCount(numberOfItems: Int): Int{
        val rowCount: Float = ceil(numberOfItems.toFloat() / COLUMN_COUNT.toFloat())
        return rowCount.toInt()
    }

    private fun addProductInfoToGridLayout(productInfo: ProductInfo, currentColumn: Int) {
        val uri = Uri.parse(productInfo.imageUrl)
        val linearLayout = this.createProductView(uri, productInfo.id)

        val rowSpan = GridLayout.spec(GridLayout.UNDEFINED, 1, CENTER)
        val colSpan = GridLayout.spec(GridLayout.UNDEFINED, 1, CENTER)

        val halfMargin = 8
        val gridLayoutParams = GridLayout.LayoutParams(rowSpan, colSpan)
        if (currentColumn % COLUMN_COUNT == 0) {
            gridLayoutParams.rightMargin = halfMargin
        } else if (currentColumn % COLUMN_COUNT == 1) {
            gridLayoutParams.leftMargin = halfMargin
        }
        gridLayoutParams.bottomMargin = halfMargin
        gridLayoutParams.topMargin = halfMargin
        gridLayout.addView(linearLayout, gridLayoutParams)
    }

    private fun createProductView(imageUri: Uri, productInfoId: Int): LinearLayout {
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
        val options = GraphicOptions(imageWidth, imageWidth)
        graphicsHandler.loadImageUrlIntoView(imageUri, imageView, options)

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