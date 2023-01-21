package io.wantic.app.share.core.data

import android.app.Activity
import android.util.Log

class FileHandler(val context: Activity) : FileHandling {

    companion object {
        private const val LOG_TAG = "FileHandler"
    }

    override fun loadFileAsText(fileName: String): String {
        return try {
            context.application.assets.open(fileName).bufferedReader().use {
                it.readText()
            }
        } catch (ex: Exception) {
            val message = ex.message ?: "Error while loading file $fileName"
            Log.e(LOG_TAG, message)
            return ""
        }
    }
}