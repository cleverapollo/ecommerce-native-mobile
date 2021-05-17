//
//  AuthService.swift
//  Share
//
//  Created by Tim Fischer on 17.12.20.
//

import Foundation
import SwiftKeychainWrapper
import JWTDecode

class AuthService {
    
    var keychainwrapper: KeychainWrapper = KeychainWrapper.init(serviceName: "cap_sec", accessGroup: AppConfig.keychainAccessGroup)
    
    static let shared = AuthService()
    
    private init() {}
    
    func getAuthToken(completionHandler: @escaping (String?) -> Void) {
        if let encodedToken = keychainwrapper.string(forKey: "firebaseIdToken") {
            completionHandler(encodedToken.replacingOccurrences(of: "\"", with: ""))
        } else {
            completionHandler(nil)
        }
    }
    
}
