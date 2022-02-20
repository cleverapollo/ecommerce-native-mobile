import UIKit

@IBDesignable
class DesignableNavigationItem: UINavigationItem {
    
    @IBInspectable var titleViewImage: UIImage? {
        didSet {
            updateView()
        }
    }
    
    private func updateView() {
        
        if titleViewImage != nil {
            let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 40, height: 40))
            imageView.contentMode = .scaleAspectFit
            imageView.image = titleViewImage!
            
            titleView = imageView
        }
    }
}
