package io.wantic.app.share.core.extensions

import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Lifecycle

/**
 * Checks whether the activity is in the foreground
 * @see androidx.lifecycle.Lifecycle.State.RESUMED
 */
fun AppCompatActivity.isInForeground() = lifecycle.currentState.isAtLeast(Lifecycle.State.RESUMED)