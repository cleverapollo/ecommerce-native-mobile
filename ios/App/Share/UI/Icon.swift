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
    
    static func get(_ icon: Icon) -> UIImage {
        UIImage(named: icon.rawValue)!
    }
    
}
