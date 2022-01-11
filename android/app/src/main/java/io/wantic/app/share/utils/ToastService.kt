package io.wantic.app.share.utils

import android.app.Activity
import android.widget.Toast

object ToastService : ToastMessaging {
    override fun showToast(context: Activity, message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
}