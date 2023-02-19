package io.wantic.app.share

import org.junit.Assert
import java.io.File
import java.nio.charset.Charset

open class BaseUnitTest {

    protected fun loadFileAsText(fileName: String): String {
        val resource = javaClass.classLoader?.getResource(fileName)
        Assert.assertNotNull(resource)
        val file = File(resource!!.path)
        Assert.assertNotNull(file)
        return file.readText(Charset.forName("UTF-8"))
    }

}