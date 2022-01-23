package io.wantic.app.share.core.ui.media

import android.content.Context
import android.net.Uri
import android.widget.ImageView
import com.github.twocoffeesoneteam.glidetovectoryou.GlideToVectorYou
import io.wantic.app.share.core.ui.UIConstants.IMAGE_ERROR
import io.wantic.app.share.core.ui.UIConstants.IMAGE_PLACEHOLDER

class VectorGraphicsHandler(val context: Context) : VectorGraphicsHandling {

    override fun loadImageUrlIntoView(imageUri: Uri, into: ImageView, options: GraphicOptions?) {
        // ToDo: Handle options
        GlideToVectorYou
            .init()
            .with(context)
            .setPlaceHolder(IMAGE_PLACEHOLDER, IMAGE_ERROR)
            .load(imageUri, into)
    }

}