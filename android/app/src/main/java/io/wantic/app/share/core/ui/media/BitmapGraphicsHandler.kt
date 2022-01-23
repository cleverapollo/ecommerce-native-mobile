package io.wantic.app.share.core.ui.media

import android.net.Uri
import android.widget.ImageView
import com.squareup.picasso.Picasso
import com.squareup.picasso.RequestCreator
import io.wantic.app.share.core.ui.UIConstants.IMAGE_ERROR
import io.wantic.app.share.core.ui.UIConstants.IMAGE_FALLBACK
import io.wantic.app.share.core.ui.UIConstants.IMAGE_PLACEHOLDER

class BitmapGraphicsHandler : BitmapGraphicsHandling {

    override fun loadImageUrlIntoView(imageUri: Uri, into: ImageView, options: GraphicOptions?) {
        loadImageIntoView(imageUri, null, into, options)
    }

    override fun loadGraphicResourceIntoView(
        resourceId: Int,
        into: ImageView,
        options: GraphicOptions?
    ) {
        loadImageIntoView(null, resourceId, into, options)
    }

    private fun loadImageIntoView(imageUri: Uri?, resourceId: Int?, into: ImageView, options: GraphicOptions?) {
        val picasso = Picasso.get()
        val requestCreator: RequestCreator = when {
            imageUri != null -> {
                picasso.load(imageUri)
            }
            resourceId != null -> {
                picasso.load(resourceId)
            }
            else -> {
                picasso.load(IMAGE_FALLBACK)
            }
        }

        requestCreator
            .placeholder(IMAGE_PLACEHOLDER)
            .error(IMAGE_ERROR)
            .centerInside()

        handleOptions(options, requestCreator)

        requestCreator
            .into(into)
    }

    private fun handleOptions(
        options: GraphicOptions?,
        requestCreator: RequestCreator
    ) {
        var height: Int? = null
        var width: Int? = null

        if (options != null) {
            height = options.height
            width = options.width

            if (options.transformation != null) {
                requestCreator
                    .transform(options.transformation!!)
            }
        }

        if (width != null && height != null) {
            requestCreator
                .resize(width, height)
                .onlyScaleDown()
        } else {
            requestCreator
                .fit()
        }
    }
}