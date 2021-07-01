//
//  ToastService.swift
//  Share
//
//  Created by Tim Fischer on 16.01.21.
//

import UIKit

struct ToastService {
    
    static let shared = ToastService()
    

    func showToast(controller: UIViewController, message : String, wishListId: UUID, extensionContext: NSExtensionContext) {
        let alert = createAlertController(title: nil, message: message)
        DispatchQueue.main.async {
            let alertActionShowWish = createAlertAction(title: "Wunsch anzeigen", style: .default, handler: { (action: UIAlertAction!) in
                if let url = URL(string: "\(AppConfig.appUrl)/secure/home/wish-list/\(wishListId)?forceRefresh=true") {
                    redirectToHostApp(controller: controller, extensionContext: extensionContext, url: url)
                } else {
                    closeShareExtension(extensionContext: extensionContext)
                }
            })
            alert.addAction(alertActionShowWish)
            
            let alertActionCloseShareExtension = createAlertAction(title: "Fertig", style: .cancel, handler: { (action: UIAlertAction!) in
                closeShareExtension(extensionContext: extensionContext)
            })
            alert.addAction(alertActionCloseShareExtension)
            
            controller.present(alert, animated: true)
        }
    }
    
    func showNotAuthorizedToast(controller: UIViewController, extensionContext: NSExtensionContext) {
        let title = "Du bist nicht angemeldet."
        let message = "Melde dich an der Wantic-App an, um dir einen Wunsch zur Wunschliste hinzuzufügen."
        let alert = createAlertController(title: title, message: message)
        
        DispatchQueue.main.async {
            alert.addAction(UIAlertAction(title: "Anmelden", style: .default, handler: { (action: UIAlertAction!) in
                if let url = URL(string: "\(AppConfig.appUrl)/login") {
                    redirectToHostApp(controller: controller, extensionContext: extensionContext, url: url)
                } else {
                    closeShareExtension(extensionContext: extensionContext)
                }
            }))
            alert.addAction(createAlertAction(title: "Abbrechen", style: .cancel, handler: { (action: UIAlertAction!) in
                closeShareExtension(extensionContext: extensionContext)
            }))
            controller.present(alert, animated: true)
        }
    }
    
    func showWishListLoadingErrorToast(controller: UIViewController, extensionContext: NSExtensionContext) {
        let title = "Fehler"
        let message = "Beim Laden deiner Wunschlisten ist leider ein Fehler aufgetreten. Überprüfe ob du in der Wantic App angemeldet bist und versuche es noch einmal."
        let alert = createAlertController(title: title, message: message)
        
        DispatchQueue.main.async {
            alert.addAction(createAlertAction(title: "Wantic öffnen", style: .default, handler: { (action: UIAlertAction!) in
                if let url = URL(string: "\(AppConfig.appUrl)/secure/home") {
                    redirectToHostApp(controller: controller, extensionContext: extensionContext, url: url)
                } else {
                    closeShareExtension(extensionContext: extensionContext)
                }
            }))
            alert.addAction(createAlertAction(title: "Abbrechen", style: .cancel, handler: { (action: UIAlertAction!) in
                closeShareExtension(extensionContext: extensionContext)
            }))
            controller.present(alert, animated: true)
        }
    }
    
    func showNoWishListsAvailableToast(controller: UIViewController, extensionContext: NSExtensionContext) {
        let title = "Keine Wunschlisten vorhanden"
        let message = "Du hast noch keine Wunschlisten angelegt und kannst deshalb keinen Wunsch speichern. Lege jetzt deine erste Wunschliste an und wiederhole diesen Vorgang."
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.view.backgroundColor = .black
        alert.view.alpha = 0.5
        alert.view.layer.cornerRadius = 15
        
        DispatchQueue.main.async {
            alert.addAction(createAlertAction(title: "Jetzt Wunschliste anlegen", style: .default, handler: { (action: UIAlertAction!) in
                if let url = URL(string: "\(AppConfig.appUrl)/secure/home/wish-list-new") {
                    redirectToHostApp(controller: controller, extensionContext: extensionContext, url: url)
                } else {
                    closeShareExtension(extensionContext: extensionContext)
                }
            }))
            alert.addAction(createAlertAction(title: "Abbrechen", style: .cancel, handler: { (action: UIAlertAction!) in
                closeShareExtension(extensionContext: extensionContext)
            }))
            controller.present(alert, animated: true)
        }
    }
    
    func redirectToHostApp(controller: UIViewController, extensionContext: NSExtensionContext, url: URL) {
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
    
    func createAlertController(title: String?, message: String) -> UIAlertController {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.view.backgroundColor = .white
        alert.view.alpha = 0.5
        alert.view.layer.cornerRadius = 15
        alert.view.tintColor = UIColor(named: "primary")
        return alert
    }
    
    func createAlertAction(title: String, style: UIAlertAction.Style, handler: ((UIAlertAction) -> Void)?) -> UIAlertAction {
        let alertAction = UIAlertAction(title: title, style: style, handler: handler)
        alertAction.setValue(UIColor(named: "primary"), forKey: "titleTextColor")
        return alertAction
    }
    
    
}
