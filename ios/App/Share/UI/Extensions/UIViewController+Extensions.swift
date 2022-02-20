import UIKit

// MARK: - Activity Indicator

protocol ActivityLoading {
    
    func createActivityIndicatorView(with text: String) -> UIVisualEffectView
    func showActivityIndicator(_ indicatorView: UIVisualEffectView)
    func removeActivityIndicator(_ indicatorView: UIVisualEffectView)
}

extension UIViewController: ActivityLoading {
    
    func createActivityIndicatorView(with text: String) -> UIVisualEffectView {
        
        ActivityIndicator.create(text, for: self.view)
    }
    
    func showActivityIndicator(_ indicatorView: UIVisualEffectView) {
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.view.addSubview(indicatorView)
        }
    }
    
    func removeActivityIndicator(_ indicatorView: UIVisualEffectView) {
        
        DispatchQueue.main.async { [weak self] in
            guard self != nil else { return }
            indicatorView.removeFromSuperview()
        }
    }
}

// MARK: - Keyboard Handling

protocol KeyboardHandling {
    func hideKeyboardWhenTappedAround()
    func dismissKeyboard()
}

extension UIViewController: KeyboardHandling {
    
    func hideKeyboardWhenTappedAround() {
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        
        view.endEditing(true)
    }
}

// MARK: - Share extension

extension UIViewController {

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
