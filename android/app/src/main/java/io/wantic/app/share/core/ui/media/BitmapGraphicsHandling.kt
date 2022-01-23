package io.wantic.app.share.core.ui.media

import android.net.Uri
import android.widget.ImageView

interface BitmapGraphicsHandling {
    fun loadImageUrlIntoView(imageUri: Uri, into: ImageView, options: GraphicOptions? = null)
    fun loadGraphicResourceIntoView(resourceId: Int, into: ImageView, options: GraphicOptions? = null)
}