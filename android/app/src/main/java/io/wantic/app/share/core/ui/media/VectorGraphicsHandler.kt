package io.wantic.app.share.core.ui.media

import android.net.Uri
import android.util.Log
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.github.twocoffeesoneteam.glidetovectoryou.GlideToVectorYou
import com.github.twocoffeesoneteam.glidetovectoryou.GlideToVectorYouListener
import io.wantic.app.share.core.ui.UIConstants.IMAGE_ERROR
import io.wantic.app.share.core.ui.UIConstants.IMAGE_PLACEHOLDER

class VectorGraphicsHandler(val activity: AppCompatActivity) : VectorGraphicsHandling {

    companion object {
        private const val LOG_TAG = "VectorGraphicsHandler"
    }

    override fun loadImageUrlIntoView(imageUri: Uri, into: ImageView, options: GraphicOptions?) {
        if (activity.isDestroyed) {
            return
        }
        // ToDo: Handle options
        GlideToVectorYou
            .init()
            .with(activity)
            .withListener(object : GlideToVectorYouListener {
                override fun onLoadFailed() {
                    Log.e(LOG_TAG, "Loading of image with uri \"$imageUri\" failed!")
                }
                override fun onResourceReady() {
                    Log.e(LOG_TAG, "Image ready")
                }
            })
            .setPlaceHolder(IMAGE_PLACEHOLDER, IMAGE_ERROR)
            .load(imageUri, into)
    }

}