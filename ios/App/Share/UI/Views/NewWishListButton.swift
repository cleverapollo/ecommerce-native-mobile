import Foundation
import UIKit

@IBDesignable class NewWishListButton: UIButton {
    
    // MARK: - lifecycle
    
    override init(frame: CGRect) {
        
        super.init(frame: frame)
        setup()
    }
    
    required init?(coder: NSCoder) {
        
        super.init(coder: coder)
        setup()
    }
    
    override func prepareForInterfaceBuilder() {
        
        setup()
    }
    
    // MARK: - setup
    
    private func setup() {
        
        contentHorizontalAlignment = .leading
        
        setupIcon()
        setupLabel()
    }
    
    private func setupIcon() {
        
        setImage(Icon.get(.add), for: .normal)
        imageView?.contentMode = .scaleAspectFit
    }
    
    private func setupLabel() {
        
        let text = "Neue Wunschliste anlegen"
        let font = Font.get(.Medium, family: .Roboto, size: Constants.defaultFontSize)
        let labelAttributes: [NSAttributedString.Key: Any] = [
            .font: font
        ]
        let attributedString = NSAttributedString(string: text, attributes: labelAttributes)
        setAttributedTitle(attributedString, for: .normal)
    }
}
