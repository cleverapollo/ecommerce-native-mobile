package io.wantic.app.share.utils

import android.annotation.SuppressLint
import android.view.MotionEvent
import android.widget.EditText

@SuppressLint("ClickableViewAccessibility")
fun EditText.onRightDrawableClicked(onClicked: (view: EditText) -> Unit) {
    this.setOnTouchListener { v, event ->
        var hasConsumed = false
        if (v is EditText) {
            if (event.x >= v.width - v.totalPaddingRight) {
                if (event.action == MotionEvent.ACTION_UP) {
                    onClicked(this)
                    performClick()
                }
                hasConsumed = true
            }
        }
        hasConsumed
    }
}
