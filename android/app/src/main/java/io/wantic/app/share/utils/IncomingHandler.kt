package io.wantic.app.share.utils

import android.os.Handler
import android.os.Message
import android.view.View
import io.wantic.app.share.activities.SelectProductImageActivity

class IncomingHandler(private var context: SelectProductImageActivity) : Handler() {
    override fun handleMessage(message: Message?) {
        if (context.loadingSpinner.visibility != View.GONE) {
            this.context.loadingSpinner.visibility = View.GONE
            if (this.context.productInfoList.isEmpty()) {
                this.context.showNoImagesFoundFeedback()
            }
        }
    }
}