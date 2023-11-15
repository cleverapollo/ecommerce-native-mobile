import UIKit

@IBDesignable
class DesignableNavigationItem: UINavigationItem {
    
    @IBInspectable var titleViewImage: UIImage? {
        didSet {
            updateView(titleViewImage)
        }
    }
    
    func updateView(_ image: UIImage? = UIImage(resource: ImageResource.logo)) {
            let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 40, height: 40))
            imageView.contentMode = .scaleAspectFit
            imageView.image = image
            titleView = imageView
    }
}
