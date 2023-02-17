package io.wantic.app.share.core.data

import android.util.Log
import androidx.appcompat.app.AppCompatActivity

class FileHandler(val activity: AppCompatActivity) : FileHandling {

    companion object {
        private const val LOG_TAG = "FileHandler"
    }

    override fun loadFileAsText(fileName: String): String {
        return try {
            activity.application.assets.open(fileName).bufferedReader().use {
                it.readText()
            }
        } catch (ex: Exception) {
            val message = ex.message ?: "Error while loading file $fileName"
            Log.e(LOG_TAG, message)
            return ""
        }
    }
}