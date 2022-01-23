package io.wantic.app.share.core.ui.media

import com.squareup.picasso.Transformation

data class GraphicOptions (
    var width: Int? = null,
    var height: Int? = null,
    var transformation: Transformation? = null
)