package io.wantic.app.share.utils

import android.app.Activity

interface ToastMessaging {
    fun showToast(context: Activity, message: String)
}