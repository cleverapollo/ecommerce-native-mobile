//
//  ToastService.swift
//  Share
//
//  Created by Tim Fischer on 16.01.21.
//

import UIKit

struct ToastService {
    
    static let shared = ToastService()
    

    func showToast(controller: UIViewController, message : String, wishListId: Int, extensionContext: NSExtensionContext) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.view.backgroundColor = .black
        alert.view.alpha = 0.5
        alert.view.layer.cornerRadius = 15
        
        DispatchQueue.main.async {
            alert.addAction(UIAlertAction(title: "Wunsch anzeigen", style: .default, handler: { (action: UIAlertAction!) in
                redirectToHostApp(controller: controller, extensionContext: extensionContext, wishListId: wishListId)
            }))
            alert.addAction(UIAlertAction(title: "Abbrechen", style: .cancel, handler: { (action: UIAlertAction!) in
                closeShareExtension(extensionContext: extensionContext)
            }))
            controller.present(alert, animated: true)
        }
    }
    
    func redirectToHostApp(controller: UIViewController, extensionContext: NSExtensionContext, wishListId: Int) {
        let url = URL(string: "http://app.beta.wantic.io/secure/home/wish-list/\(wishListId)")
        var responder = controller as UIResponder?
        let selectorOpenURL = sel_registerName("openURL:")
        
        while (responder != nil) {
            if (responder?.responds(to: selectorOpenURL))! {
                let _ = responder?.perform(selectorOpenURL, with: url)
            }
            responder = responder!.next
        }
        closeShareExtension(extensionContext: extensionContext)
    }
    
    func closeShareExtension(extensionContext: NSExtensionContext) {
        extensionContext.completeRequest(returningItems: nil, completionHandler: nil)
    }
    
    
}
