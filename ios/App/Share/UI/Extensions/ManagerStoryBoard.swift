import UIKit

extension UIStoryboard {
    
    //MARK: MainInterface Storyboard
    class func mainStoryboard() -> UIStoryboard {
        return UIStoryboard(name: "MainInterface", bundle: Bundle.main)
    }
    
    class func editDetailsViewController() -> EditDetailsViewController? {
        return mainStoryboard().instantiateViewController(withIdentifier: "EditDetailsViewController") as? EditDetailsViewController
    }
    
    class func createProductViewController() -> CreateProductViewController? {
        return mainStoryboard().instantiateViewController(withIdentifier: "CreateProductViewController") as? CreateProductViewController
    }
}
