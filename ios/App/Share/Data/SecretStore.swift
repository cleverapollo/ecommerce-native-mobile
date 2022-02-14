import Foundation
import SwiftKeychainWrapper

enum Secret: String {
    
    case firebaseIdToken
}

protocol SecureStorage {
    
    static func getValue(for secret: Secret) -> String?
}

struct SecretStore: SecureStorage {
    
    private static var keychainWrapper: KeychainWrapper = KeychainWrapper.init(
        serviceName: "cap_sec", accessGroup: AppConfig.keychainAccessGroup
    )
    
    static func getValue(for secret: Secret) -> String? {
        
        keychainWrapper.string(forKey: secret.rawValue)
    }
}
