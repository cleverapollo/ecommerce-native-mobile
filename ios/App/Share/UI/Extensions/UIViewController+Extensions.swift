import UIKit

var effectView: UIVisualEffectView?

extension UIViewController {
    
    // MARK: - Keyboard Handling
    
    func hideKeyboardWhenTappedAround() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
    
    // MARK: - Activity Indicator
    
    func showActivityIndicator(_ title: String) {
        guard effectView == nil else { return }
        let width = self.view.frame.width - 20
        let height = 50
        
        let strLabel = UILabel(frame: CGRect(x: 50, y: 0, width: Int(width), height: height))
        strLabel.text = title
        strLabel.numberOfLines = 0
        strLabel.font = .systemFont(ofSize: 14, weight: .medium)
        strLabel.textColor = UIColor(white: 0.9, alpha: 0.7)
        
        effectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
        effectView?.frame = CGRect(x: view.frame.midX - strLabel.frame.width/2, y: view.frame.midY - strLabel.frame.height/2 , width: width, height: CGFloat(height))
        effectView?.layer.cornerRadius = 15
        effectView?.layer.masksToBounds = true
        
        let activityIndicator = UIActivityIndicatorView(style: .white)
        activityIndicator.frame = CGRect(x: 0, y: 0, width: height, height: height)
        activityIndicator.startAnimating()
        
        DispatchQueue.main.async {
            effectView?.contentView.addSubview(activityIndicator)
            effectView?.contentView.addSubview(strLabel)
            if let effectView = effectView {
                self.view.addSubview(effectView)
            }
        }
    }
    
    func removeActivityIndicator() {
        DispatchQueue.main.async {
            effectView?.removeFromSuperview()
            effectView = nil
        }
    }
    
    //
    
    func closeShareExtension() {
        
        guard let extensionContext = self.extensionContext else {
            return
        }
        extensionContext.completeRequest(returningItems: nil, completionHandler: nil)
    }
    
    func redirectToHostApp(url: URL) {
        
        var responder = self as UIResponder?
        let selectorOpenURL = sel_registerName("openURL:")
        
        while (responder != nil) {
            if (responder?.responds(to: selectorOpenURL))! {
                let _ = responder?.perform(selectorOpenURL, with: url)
            }
            responder = responder!.next
        }
        closeShareExtension()
    }
    
}
