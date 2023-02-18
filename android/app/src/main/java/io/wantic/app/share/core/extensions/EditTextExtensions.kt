package io.wantic.app.share.core.extensions

import android.annotation.SuppressLint
import android.graphics.drawable.Drawable
import android.view.MotionEvent
import android.widget.EditText
import androidx.core.widget.doAfterTextChanged

private const val COMPOUND_DRAWABLE_RIGHT_INDEX = 2

fun EditText.makeClearableEditText(
    onIsNotEmpty: (() -> Unit)?,
    onClear: (() -> Unit)?,
    clearDrawable: Drawable
) {
    val updateRightDrawable = {
        this.setCompoundDrawables(null, null,
            if (text.isNotEmpty()) clearDrawable else null,
            null)
    }
    updateRightDrawable()

    this.doAfterTextChanged {
        if (it != null) {
            if (it.isNotEmpty()) {
                onIsNotEmpty?.invoke()
            }
        }
        updateRightDrawable()
    }

    this.onRightDrawableClicked {
        this.text.clear()
        this.setCompoundDrawables(null, null, null, null)
        onClear?.invoke()
        this.requestFocus()
    }
}

fun EditText.makeClearableEditText(onIsNotEmpty: (() -> Unit)?, onCleared: (() -> Unit)?) {
    compoundDrawables[COMPOUND_DRAWABLE_RIGHT_INDEX]?.let { clearDrawable ->
        makeClearableEditText(onIsNotEmpty, onCleared, clearDrawable)
    }
}

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