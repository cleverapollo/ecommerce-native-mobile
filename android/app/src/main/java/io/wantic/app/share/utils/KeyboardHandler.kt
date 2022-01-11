package io.wantic.app.share.utils

import android.app.Activity
import android.view.inputmethod.InputMethodManager
import androidx.core.content.ContextCompat

object KeyboardHandler : KeyboardHandling {

    override fun hideSoftKeyboard(context: Activity) {
        context.currentFocus?.let {
            val inputMethodManager = ContextCompat.getSystemService(context, InputMethodManager::class.java)!!
            inputMethodManager.hideSoftInputFromWindow(it.windowToken, 0)
        }
    }

}