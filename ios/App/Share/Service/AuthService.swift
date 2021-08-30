//
//  AuthService.swift
//  Share
//
//  Created by Tim Fischer on 17.12.20.
//

import Foundation
import SwiftKeychainWrapper
import JWTDecode
import Firebase

class AuthService {
    
    var keychainwrapper: KeychainWrapper = KeychainWrapper.init(serviceName: "cap_sec", accessGroup: AppConfig.keychainAccessGroup)
    
    static let shared = AuthService()
    
    private init() {
        if FirebaseApp.app() == nil {
            configureFirebaseApp()
            do {
                try Auth.auth().useUserAccessGroup(AppConfig.keychainAccessGroup)
            } catch let error as NSError {
                print("Error changing user acccess group %@", error)
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
            } else if let encodedToken = self.keychainwrapper.string(forKey: "firebaseIdToken") {
                completionHandler(encodedToken.replacingOccurrences(of: "\"", with: ""))
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
