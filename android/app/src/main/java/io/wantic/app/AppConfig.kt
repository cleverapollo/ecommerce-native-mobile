package io.wantic.app

import android.os.Build
import android.util.Log
import java.util.*

object AppConfig {

    private const val LOG_TAG = "AppConfig"

    val backendUrl: String
        get() {
            var url = ""
            when (BuildConfig.FLAVOR) {
                "beta" -> {
                    url = "https://rest-dev.wantic.io"
                }
                "prod" -> {
                    url = "https://rest-prd.wantic.io"
                }
                else -> {
                    Log.e(LOG_TAG, "Flavor is not defined!")
                }
            }
            return url
        }

    val appUrl: String
        get() {
            return when (BuildConfig.FLAVOR) {
                "beta" -> {
                    "https://app.beta.wantic.io"
                }
                "prod" -> {
                    "https://app.wantic.io"
                }
                else -> {
                    Log.e(LOG_TAG, "Flavor is not defined!")
                    "https://app.wantic.io"
                }
            }
        }

     fun createRequestHeaders(idToken: String): MutableMap<String, String> {
        val headers = HashMap<String, String>()
        headers["Accept"] = "application/json"
        headers["Authorization"] = "Bearer $idToken"
        headers["Content-Type"] = "application/json"
        headers["Wantic-Client-Info"] = "platform=android; osVersion=${Build.VERSION.RELEASE}; appVersion=${BuildConfig.VERSION_NAME};"
        return headers
    }

}