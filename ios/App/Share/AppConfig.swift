//
//  AppConfig.swift
//  Share
//
//  Created by Tim Fischer on 28.03.21.
//

import Foundation
import UIKit

struct AppConfig {
    
    static let appUrl = "https://app.wantic.io"
    static let backendUrl = "https://rest-prd.wantic.io"
    static let keychainAccessGroup = "3LDV8B8SZ2.io.wantic.app"
    
    static var appVersion: String {
        if let bundleVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String {
            return bundleVersion
        }
        return "0.0.0"
    }
    
    static var osVersion: String {
        return UIDevice.current.systemVersion
    }
    
    
}
