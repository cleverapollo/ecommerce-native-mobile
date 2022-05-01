import Foundation
import UIKit

protocol TextInputValidation {
    func isEmpty() -> Bool
}

extension UITextField: TextInputValidation {
    
    func isEmpty() -> Bool {
        let count = text?.count ?? 0
        return count == 0
    }
}

extension UITextView: TextInputValidation {

    func isEmpty() -> Bool {
        let count = text?.count ?? 0
        return count == 0
    }
}
