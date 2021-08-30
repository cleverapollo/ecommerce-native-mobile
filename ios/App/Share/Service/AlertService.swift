//
//  ToastService.swift
//  Share
//
//  Created by Tim Fischer on 16.01.21.
//

import UIKit

struct AlertService {
    
    static let shared = AlertService()
    
    func showNoImagesFoundAlert(controller: UIViewController, extensionContext: NSExtensionContext?) {
        let message = "Leider können wir von dieser Seite keine Bilder abrufen, deshalb kannst du keinen Wunsch hinzufügen. \n\n Befindest du dich gerade in einer App, dann kannst du es alternativ über die Webseite des App-Betreibers in deinem Web-Browser (z.B. Safari) erneut versuchen. \n\n Hast du damit auch keinen Erfolg, dann schreib uns gerne eine E-Mail an hello@wantic.io und nenne uns die App/Webseite über die das Erstellen eines neuen Wunsches nicht möglich war."
        let alert = createAlertController(title: "Keine Bilder gefunden", message: message)
        DispatchQueue.main.async {
            if let extensionContext = extensionContext {
                let alertActionCloseShareExtension = createAlertAction(title: "Schließen", style: .cancel, handler: { (action: UIAlertAction!) in
                    closeShareExtension(extensionContext: extensionContext)
                })
                alert.addAction(alertActionCloseShareExtension)
            }
            controller.present(alert, animated: true)
        }
    }

    func showToast(controller: UIViewController, message : String, wishListId: UUID, extensionContext: NSExtensionContext) {
        let alert = createAlertController(title: nil, message: message)
        DispatchQueue.main.async {
            let alertActionShowWish = createAlertAction(title: "Wunsch anzeigen", style: .default, handler: { (action: UIAlertAction!) in
                if let url = URL(string: "\(AppConfig.appLinkHost):secure/home/wish-list/\(wishListId)?forceRefresh=true") {
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
        let title = "Sitzung abgelaufen"
        let message = "Du warst eine Weile lang inaktiv, also haben wir dich abgemeldet, um deine persönlichen Daten zu schützen. \n\n Bitte öffne kurz die Wantic App, um eine neue Sitzung zu starten. Danach kannst du diesen Vorgang einfach wiederholen. \n\n Hinweis: Deine Sitzung wird im Hintergrund automatisch aktualisiert. Du musst dich in der App nicht abmelden und anschließend neu anmelden."
        let alert = createAlertController(title: title, message: message)
        
        DispatchQueue.main.async {
            alert.addAction(createAlertAction(title: "Sitzung erneuern", style: .default, handler: { (action: UIAlertAction!) in
                if let url = URL(string: "\(AppConfig.appLinkHost):start") {
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
                if let url = URL(string: "\(AppConfig.appLinkHost):secure/home") {
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
                if let url = URL(string: "\(AppConfig.appLinkHost):secure/home/wish-list-new") {
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
