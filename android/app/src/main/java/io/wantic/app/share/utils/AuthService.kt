package io.wantic.app.share.utils

import android.util.Log
import com.google.firebase.auth.FirebaseAuth

object AuthService {

    private const val LOG_TAG = "AuthService"

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()

    fun getIdToken(completionHandler: (idToken: String?) -> Unit) {
        val currentUser = auth.currentUser
        if (currentUser != null) {
            currentUser.getIdToken(true).addOnSuccessListener {
                Log.d(LOG_TAG, "idToken: ${it.token}")
                completionHandler(it.token)
            }
        } else {
            Log.e(LOG_TAG, "User is not authorized! Instance of current user not found!")
            completionHandler(null)
        }
    }

}