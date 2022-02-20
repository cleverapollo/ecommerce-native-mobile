import Foundation
import JWTDecode
import Firebase

// MARK: - Models

struct Credentials: Codable {
    
    let email: String
    let password: String
}

struct LoginRequest: Codable {
    
    let username: String
    let password: String
}

struct LoginResponse: Codable {
    
    let token: String
}

// MARK: - API

protocol Authentication {
    
    func getAuthToken(completionHandler: @escaping (String?) -> Void)
}

class AuthService: Authentication {
    
    static let shared = AuthService()
    
    private init() {
        if FirebaseApp.app() == nil {
            configureFirebaseApp()
            do {
                try Auth.auth().useUserAccessGroup(AppConfig.keychainAccessGroup)
            } catch let error as NSError {
                print("Error changing user access group %@", error)
            }
        }
    }
    
    private func configureFirebaseApp() {
        if let filePath = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") {
            if let firebaseOptions = FirebaseOptions(contentsOfFile: filePath) {
                FirebaseApp.configure(options: firebaseOptions)
            } else {
                print("Error creating FirebaseOptions")
            }
        } else {
            print("GoogleService-Info.plist was not found")
        }
    }
    
    func getAuthToken(completionHandler: @escaping (String?) -> Void) {
        getIdToken() { idToken in
            if let idToken = idToken {
                completionHandler(idToken)
            } else if let firebaseIdToken = SecretStore.getValue(for: .firebaseIdToken) {
                completionHandler(firebaseIdToken.replacingOccurrences(of: "\"", with: ""))
            } else {
                completionHandler(nil)
            }
        }

    }
    
    private func getIdToken(completionHandler: @escaping (String?) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completionHandler(nil)
            return
        }
        currentUser.getIDToken() { idToken, error in
            guard let idToken = idToken, error == nil else {
                completionHandler(nil)
                return
            }
            completionHandler(idToken)
        }
    }
    
}
