package io.wantic.app.share.core.ui.media

import android.net.Uri
import android.widget.ImageView

class GraphicsHandler(
    private val bitmapGraphicsHandler: BitmapGraphicsHandling,
    private val vectorGraphicsHandler: VectorGraphicsHandling
) : GraphicsHandling {

    override fun loadImageUrlIntoView(imageUri: Uri, into: ImageView, options: GraphicOptions?) {
        if (isVectorImage(imageUri)) {
            vectorGraphicsHandler.loadImageUrlIntoView(imageUri, into, options)
        } else {
            bitmapGraphicsHandler.loadImageUrlIntoView(imageUri, into, options)
        }
    }

    override fun loadGraphicResourceIntoView(
        resourceId: Int,
        into: ImageView,
        options: GraphicOptions?
    ) {
        bitmapGraphicsHandler.loadGraphicResourceIntoView(resourceId, into, options)
    }

    private fun isVectorImage(imageUri: Uri): Boolean {
        return imageUri.toString().endsWith(".svg")
    }

}