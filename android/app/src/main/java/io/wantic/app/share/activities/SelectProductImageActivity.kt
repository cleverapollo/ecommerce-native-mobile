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
import android.view.Gravity.CENTER_HORIZONTAL
import android.view.View
import android.webkit.WebView
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
import io.wantic.app.share.core.data.FileHandler
import io.wantic.app.share.core.data.FileHandling
import io.wantic.app.share.core.extensions.isInForeground
import io.wantic.app.share.core.ui.AlertService
import io.wantic.app.share.core.ui.media.*
import io.wantic.app.share.core.web.*
import io.wantic.app.share.models.*
import io.wantic.app.share.utils.*
import kotlin.math.ceil


class SelectProductImageActivity : AppCompatActivity() {

    companion object {
        private const val LOG_TAG = "SelectProductImage"
        private const val COLUMN_COUNT = 2
    }

    // public

    lateinit var loadingSpinner: ProgressBar

    var webCrawlerResult: WebCrawlerResult? = null

    // private

    private lateinit var webView: WebView
    private lateinit var webViewClient: WebViewClient
    private lateinit var gridLayout: GridLayout
    private lateinit var actionButton: Button
    private lateinit var messageHandler: Handler
    private lateinit var analytics: AnalyticsTracking
    private lateinit var fileHandler: FileHandling

    private var graphicsHandler: GraphicsHandling = GraphicsHandler(
        BitmapGraphicsHandler(), VectorGraphicsHandler(this)
    )

    private var selectedView: SelectedProductImageView = SelectedProductImageView()
    private var shareResultParser: ShareResultParsing = ShareResultParser
    private var shareResult: ShareResult? = null

    // life cycle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_select_product_image)
        initToolbar()

        Log.d(LOG_TAG, "onCreate intent action = ${intent?.action}, intent type = ${intent?.type}")

        loadingSpinner = findViewById(R.id.loading_spinner)
        analytics = GoogleAnalytics.init()
        fileHandler = FileHandler(this);

        if (intent?.action == Intent.ACTION_SEND) {
            startLoading()
            messageHandler = MessageHandler(this)
            messageHandler.sendMessageDelayed(Message(), 30000)

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

    private fun handleExtraTextFromIntent(textContent: String?) {
        if (textContent != null) {
            shareResult = shareResultParser.parseTextToShareResult(textContent)
            if (shareResult != null) {
                val url = shareResult!!.productURLString
                this.initWebView(url)
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

    fun stopLoading() {
        loadingSpinner.visibility = View.GONE
    }

    private fun showNoImagesFoundFeedback() {
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
        actionButton.setOnClickListener(onNextButtonTapped())

        disableButton(actionButton)

        // create close button
        val closeButton: ImageButton = toolbar.findViewById(R.id.toolbarCloseButton)
        closeButton.setOnClickListener {
            finishAffinity()
        }
    }

    private fun onNextButtonTapped(): (View) -> Unit = {
        var productInfo: ProductInfo? = null
        if (webCrawlerResult != null) {
            val webImage = webCrawlerResult!!.images.find {
                it.id == (selectedView.imageView?.tag ?: false)
            }
            productInfo = webImage?.let { it1 ->
                ProductInfo(
                    it1.id,
                    it1.name.ifEmpty { webCrawlerResult!!.title },
                    webImage.url,
                    webCrawlerResult!!.url,
                    webCrawlerResult!!.price,
                    false,
                    null
                )
            }
        }
        navigateForward(productInfo)
    }

    fun navigateForward(productInfo: ProductInfo?) {
        val fallback: ProductInfo? = createFallBack()
        var productInfoExtra: ProductInfo? = null
        if (productInfo != null) {
            productInfoExtra = productInfo
        } else if (fallback != null) {
            productInfoExtra = fallback
        }

        if (productInfoExtra != null) {
            val navigationIntent = Intent(this, EditProductDetailsActivity::class.java).apply {
                putExtra("productInfo", productInfoExtra)
                putExtra("shareResult", shareResult)
            }
            startActivity(navigationIntent)
        } else {
            showNoImagesFoundFeedback()
        }
    }

    private fun createFallBack(): ProductInfo? {
        val id = -1
        var name = ""
        var fallback: ProductInfo? = null
        if (shareResult != null) {
            if (shareResult!!.productName != null) {
                name = shareResult!!.productName!!
            }
            val url = shareResult!!.productURLString
            fallback = ProductInfo(id, name, null, url)
        }
        Log.d(LOG_TAG, "Fallback created $fallback")
        return fallback
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
    private fun initWebView(url: String) {
        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.loadsImagesAutomatically = true
        WebView.setWebContentsDebuggingEnabled(true)

        val code = fileHandler.loadFileAsText("web-crawler.js")
        assert(code.isNotEmpty())
        webViewClient = WebViewClient(this, code, url)

        webView.addJavascriptInterface(AndroidJSInterface(this), "Android")
        webView.webViewClient = webViewClient
        webView.webChromeClient = WebChromeClient
        webView.loadUrl(url)
    }

    /**
     * Reloads the web page and delays content scraping by 3 seconds.
     */
    fun retryCrawling() {
        Log.d(LOG_TAG, "Retry crawling")
        if (!this::webViewClient.isInitialized || !this::webView.isInitialized) {
            Log.d(LOG_TAG, "Retry stopped, web view or client is not initialized")
            return
        }
        if (!this.isInForeground()) {
            Log.d(LOG_TAG, "Activity is not in foreground, skip processing.")
            return
        }
        webViewClient.scrapeWithDelay = true
        webView.post { webView.reload() }
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

    fun addNewProductInfoItem(webImage: WebImage) {
        var currentList: MutableList<WebImage> = mutableListOf()
        if (this.webCrawlerResult != null) {
            currentList = this.webCrawlerResult!!.images.toMutableList()
        }
        if (currentList.add(webImage)) {
            this.webCrawlerResult!!.images = currentList
            if (this::gridLayout.isInitialized) {
                val newRowCount = calculateRowCount(this.webCrawlerResult!!.images.size)
                if (gridLayout.rowCount != newRowCount && newRowCount > gridLayout.rowCount) {
                    gridLayout.rowCount = newRowCount
                }
                var column = 1
                if (gridLayout.size % COLUMN_COUNT == 0) {
                    column = 0
                }
                this.addProductInfoToGridLayout(webImage, column)
            } else {
                Log.d(LOG_TAG, "initGridLayout from addNewProductInfoItem")
                this.initGridLayout(this.webCrawlerResult!!.images)
            }
        }
    }

    fun initGridLayout(webImages: List<WebImage>) {
        val rowCount = calculateRowCount(webImages.size)

        Log.d(
            LOG_TAG,
            "columnCount: $COLUMN_COUNT, rowCount: $rowCount, numberOfImages: ${webImages.size}"
        )

        gridLayout = findViewById(R.id.productImagesGridLayout)
        gridLayout.columnCount = COLUMN_COUNT
        gridLayout.rowCount = rowCount

        var column = 0
        var row = 0
        for (webImage in webImages) {
            if (column == COLUMN_COUNT) {
                column = 0
                row++
            }
            addProductInfoToGridLayout(webImage, column)

            column++
        }
    }

    private fun calculateRowCount(numberOfItems: Int): Int {
        val rowCount: Float = ceil(numberOfItems.toFloat() / COLUMN_COUNT.toFloat())
        return rowCount.toInt()
    }

    private fun addProductInfoToGridLayout(webImage: WebImage, currentColumn: Int) {
        val uri = Uri.parse(webImage.url)
        val linearLayout = this.createProductView(uri, webImage.id)

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

    private fun createProductView(imageUri: Uri, webImageId: Int): LinearLayout {
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
        imageView.tag = webImageId
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