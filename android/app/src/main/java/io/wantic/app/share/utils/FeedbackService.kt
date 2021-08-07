package io.wantic.app.share.utils

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat.finishAffinity
import io.wantic.app.MainActivity
import io.wantic.app.R

object FeedbackService {

    fun showNotAuthorizedAlert(context: Activity) {
        AlertDialog.Builder(context)
            .setMessage(R.string.message_failed_to_save_wish)
            .setNeutralButton(R.string.button_label_open_wantic_app) { _, _ ->
                startMainActivity(context)
            }
            .setNegativeButton(R.string.button_label_close) { _, _ ->
                finishAffinity(context)
            }
            .show()
    }

    private fun startMainActivity(context: Context) {
        val startIntent = Intent(context, MainActivity::class.java)
        startIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(startIntent)
    }

}