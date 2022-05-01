import Foundation
import UIKit

enum Alert {
    
    case unauthorized
    case generalError(message: String, retryAction: (UIAlertAction) -> Void)
    case noImagesFound
    case addedWishSuccessful(wishListId: UUID)
    
    static func present(_ alert: Alert, on parent: UIViewController) {
        
        DispatchQueue.main.async {

            var alertController: UIAlertController
            switch alert {
            case .unauthorized:
                alertController = createUnauthorizedAlert(vc: parent)
            case .generalError(let message, let retryAction):
                alertController = createGeneralErrorAlert(message: message, retryAction: retryAction)
            case .noImagesFound:
                alertController = createNoImagesFoundAlert(vc: parent)
            case .addedWishSuccessful(let wishListId):
                alertController = createWishAddedAlert(vc: parent, wishListId: wishListId)
            }
            parent.present(alertController, animated: true)
        }
    }
    
    // MARK: - general error
    
    private static func createGeneralErrorAlert(message: String, retryAction: @escaping (UIAlertAction) -> Void) -> UIAlertController {
        let alert = createAlertController(title: "Ein Fehler ist aufgetreten", message: message)
        
        let dismiss = createAlertAction(title: "Abbrechen", style: .cancel)
        alert.addAction(dismiss)
        
        let retry = createAlertAction(title: "Wiederholen", handler: retryAction)
        alert.addAction(retry)
        
        return alert
    }
    
    // MARK: - no images found
    
    private static func createNoImagesFoundAlert(vc: UIViewController) -> UIAlertController {
        
        let message = "Leider können wir von dieser Seite keine Bilder abrufen, deshalb kannst du keinen Wunsch hinzufügen. \n\n Befindest du dich gerade in einer App, dann kannst du es alternativ über die Webseite des App-Betreibers in deinem Web-Browser (z.B. Safari) erneut versuchen. \n\n Hast du damit auch keinen Erfolg, dann schreib uns gerne eine E-Mail an hello@wantic.io und nenne uns die App/Webseite über die das Erstellen eines neuen Wunsches nicht möglich war."
        let alert = createAlertController(title: "Keine Bilder gefunden", message: message)
        
        let closeShareExtension = createAlertAction(title: "Schließen", style: .cancel) { _ in
            vc.closeShareExtension()
        }
        alert.addAction(closeShareExtension)
        
        return alert
    }
    
    // MARK: - added wish successful
    
    private static func createWishAddedAlert(vc: UIViewController, wishListId: UUID) -> UIAlertController {
        
        let title = "Wunsch erfolgreich gespeichert"
        let message = "Dein Wunsch wurde deiner Liste hinzugefügt."
        let alert = createAlertController(title: title, message: message)
        let alertActionShowWish = createAlertAction(title: "Anzeigen") { _ in
            if let url = URL(string: "\(AppConfig.appLinkHost):secure/home/wish-list/\(wishListId)?forceRefresh=true") {
                vc.redirectToHostApp(url: url)
            } else {
                vc.closeShareExtension()
            }
        }
        alert.addAction(alertActionShowWish)
        
        let alertActionCloseShareExtension = createAlertAction(title: "Fertig", style: .cancel) { _ in
            vc.closeShareExtension()
        }
        alert.addAction(alertActionCloseShareExtension)
        
        return alert
    }
    
    // MARK: - unauthorized
    
    private static func createUnauthorizedAlert(vc: UIViewController) -> UIAlertController {
        
        let title = "Sitzung abgelaufen"
        let message = "Du warst eine Weile lang inaktiv, also haben wir dich abgemeldet, um deine persönlichen Daten zu schützen. \n\n Bitte öffne kurz die Wantic App, um eine neue Sitzung zu starten. Danach kannst du diesen Vorgang einfach wiederholen. \n\n Hinweis: Deine Sitzung wird im Hintergrund automatisch aktualisiert. Du musst dich in der App nicht abmelden und anschließend neu anmelden."
        let alert = createAlertController(title: title, message: message)
        
        let retryAuthAction = createAlertAction(title: "Sitzung erneuern") { action in
            
            guard let url = URL(string: "\(AppConfig.appLinkHost):start") else {
                vc.closeShareExtension()
                return
            }
            vc.redirectToHostApp(url: url)
        }
        alert.addAction(retryAuthAction)
        
        let dismissAction = createAlertAction(title: "Abbrechen", style: .cancel) { action in
            
            vc.closeShareExtension()
        }
        alert.addAction(dismissAction)
        
        return alert
    }
    
    // MARK: - Shared methods
    
    private static func createAlertController(title: String?, message: String) -> UIAlertController {
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.view.backgroundColor = .white
        alert.view.alpha = 0.5
        alert.view.layer.cornerRadius = 15
        alert.view.tintColor = Color.get(.primary)
        return alert
    }
    
    private static func createAlertAction(title: String, style: UIAlertAction.Style = .default, handler: ((UIAlertAction) -> Void)? = nil) -> UIAlertAction {
        
        let alertAction = UIAlertAction(title: title, style: style, handler: handler)
        alertAction.setValue(Color.get(.primary), forKey: "titleTextColor")
        return alertAction
    }
}
