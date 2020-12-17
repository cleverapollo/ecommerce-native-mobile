//
//  AuthService.swift
//  Share
//
//  Created by Tim Fischer on 17.12.20.
//

import Foundation
import SwiftKeychainWrapper

struct AuthService {
    var keychainwrapper: KeychainWrapper = KeychainWrapper.init(serviceName: "cap_sec", accessGroup: "3LDV8B8SZ2.io.wantic.app")
    
    static let shared = AuthService()
    
    private init() {}
    
    func getAuthToken() -> String? {
        let token = keychainwrapper.string(forKey: "auth-token")
        print("token: \(token ?? "")")
        return token
    }
}
