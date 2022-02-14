//
//  TextFieldInnerPadding.swift
//  Share
//
//  Created by Tim Fischer on 26.01.21.
//

import UIKit

class TextFieldInnerPadding: DesignableTextField {
    
    @IBInspectable
    var innerPaddingLeft: CGFloat {
        get {
            return padding.left
        }
        set {
            padding.left = newValue
        }
    }

    var padding = UIEdgeInsets(top: 0, left: 20, bottom: 0, right: 20)
    
    override open func textRect(forBounds bounds: CGRect) -> CGRect {
        return bounds.inset(by: padding)
    }

    override open func placeholderRect(forBounds bounds: CGRect) -> CGRect {
        return bounds.inset(by: padding)
    }

    override open func editingRect(forBounds bounds: CGRect) -> CGRect {
        return bounds.inset(by: padding)
    }
    
    override func clearButtonRect(forBounds bounds: CGRect) -> CGRect {
        let originalRect = super.clearButtonRect(forBounds: bounds)
        return originalRect.offsetBy(dx: -20, dy: 0)
    }

}
