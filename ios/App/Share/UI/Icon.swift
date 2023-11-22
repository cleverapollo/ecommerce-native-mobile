//
//  Icon.swift
//  App
//
//  Created by Tim Fischer on 05.02.22.
//

import Foundation
import UIKit

enum Icon: String {
    
    case add
    case checkMark
    case unchecked
    case creatorChecked
    case logo
    case logoCreator
    
    static func get(_ icon: Icon) -> UIImage {
        Logger.success(icon)
        Logger.success(icon.rawValue)
        return UIImage(named: icon.rawValue)!
    }
    
}
