import UIKit
import SVGKit

extension UIImageView {
    
    static let minSizeHeight: CGFloat = 10.0
    static let minSizeWidth: CGFloat = 10.0

    @discardableResult
    func setImageFromURl(imageUrlString: String) -> Bool {
        
        guard let url = NSURL(string: imageUrlString) else {
            Logger.error("Can't create URL from String!", imageUrlString)
            return false
        }
        
        guard let imageData = NSData(contentsOf: url as URL) else {
            Logger.error("Can't create image data from URL!", imageUrlString)
            return false
        }
        
        var uiImage: UIImage?
        if imageUrlString.contains(".svg"), let svgImage = SVGKImage(data: imageData as Data) {
            
            guard svgImage.hasSize() else {
                Logger.error("SVG Image has no size!", imageUrlString)
                return false
            }
            uiImage = svgImage.uiImage
        } else if let image = UIImage(data: imageData as Data) {
            uiImage = image
        }
        
        guard uiImage != nil else {
            Logger.error("UIImage is nil")
            return false
        }
        
        // make sure image has a valid size to prevent crashes
        guard !uiImage!.size.width.isInfinite && !uiImage!.size.height.isInfinite else {
            Logger.error("Image has infinite size!", imageUrlString)
            return false
        }
        
        guard imageIsEqualOrGreaterThanMinSize(uiImage!) else {
            Logger.debug("Image size is less than min size. (\(UIImageView.minSizeWidth) x \(UIImageView.minSizeHeight))")
            return false
        }
        
        Logger.success("Load image with URL " + imageUrlString)
        self.image = uiImage!.scalePreservingAspectRatio(targetSize: frame.size)
        return true
     }
    
    /// Checks that the image has a minimum height and width.
    /// This prevents that images with a low quality and images like placeholders (transparent images with 1x1 dp) are not shown.
    private func imageIsEqualOrGreaterThanMinSize(_ image: UIImage) -> Bool {
        
        image.size.height > UIImageView.minSizeHeight && image.size.width > UIImageView.minSizeWidth
    }
 }
