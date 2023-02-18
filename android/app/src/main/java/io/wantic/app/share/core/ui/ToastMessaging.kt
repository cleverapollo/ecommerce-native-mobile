package io.wantic.app.share.core.ui

import android.app.Activity

interface ToastMessaging {
    fun showToast(context: Activity, message: String)
}