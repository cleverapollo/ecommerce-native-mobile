import Foundation
import UIKit

class NewWishListView: UIView {
    
    lazy var newWishListButton: NewWishListButton = {
        NewWishListButton()
    }()
    
    lazy var newWishListTextField: NewWishListTextField = {
        NewWishListTextField()
    }()
    
    var onDoneButtonClick: (_ result: String) -> Void {
        didSet {
            newWishListTextField.onButtonClick = onDoneButtonClick
        }
    }
    
    var editMode: Bool {
        didSet {
            newWishListButton.isHidden = editMode
            newWishListTextField.isHidden = !editMode
        }
    }
    
    // MARK: - lifecycle

    override init(frame: CGRect) {
        editMode = false
        onDoneButtonClick = { result in }
        super.init(frame: frame)
        setup()
    }
    
    required init?(coder: NSCoder) {
        editMode = false
        onDoneButtonClick = { result in }
        super.init(coder: coder)
        setup()
    }
    
    override func prepareForInterfaceBuilder() {
        
        editMode = false
        backgroundColor = .blue
        setup()
    }
    
    // MARK: - setup
        
    private func setup() {

        setupAutoLayout(forSubview: newWishListButton)
        setupAutoLayout(forSubview: newWishListTextField)
    }
}
