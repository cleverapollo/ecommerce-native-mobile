//
//  Color.swift
//  App
//
//  Created by Tim Fischer on 04.02.22.
//

import Foundation
import UIKit

enum Color: String {
    
    
    case primary
    case secondary
    case tertiary
    case backgroundColor
    case textColor
    case separatorColor
    case gradientOrangeStart
    case gradientOrangeEnd
    case gradientPurpleStart
    case gradientPurpleEnd
    
    static func get(_ color: Color) -> UIColor {
        UIColor(named: color.rawValue)!
    }
    
}
