//
//  Font.swift
//  App
//
//  Created by Tim Fischer on 04.02.22.
//

import Foundation
import UIKit

enum FontFamily: String {
    
    case Roboto
    case PlayfairDisplay
}

enum FontStyle: String {
    
    case Italic
    case Medium
    case Bold
}

struct Font {
    
    static func get(_ fontStyle: FontStyle, family: FontFamily, size: CGFloat) -> UIFont {
        
        UIFont(name: "\(family.rawValue)-\(fontStyle.rawValue)", size: size)!
    }
}
