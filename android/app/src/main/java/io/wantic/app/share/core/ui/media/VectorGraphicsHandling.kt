package io.wantic.app.share.core.ui.media

import android.net.Uri
import android.widget.ImageView

interface VectorGraphicsHandling {
    fun loadImageUrlIntoView(imageUri: Uri, into: ImageView, options: GraphicOptions? = null)
}