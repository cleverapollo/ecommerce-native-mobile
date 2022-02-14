import Foundation
import UIKit

protocol LoadingDelegate {
    
    func showLoading()
    func dismissLoading()
}

class NewWishListTextField: UITextField  {
    
    private var activityIndicator : UIActivityIndicatorView!
    private var doneButton: UIButton? {
        rightView as? UIButton
    }
    var onButtonClick: (_ result: String) -> Void

    
    // MARK: - Lifecycle
    
    override init(frame: CGRect) {
        
        self.onButtonClick = { result in }
        super.init(frame: frame)
        setup()
    }
    
    required init?(coder: NSCoder) {
        
        self.onButtonClick = { result in }
        super.init(coder: coder)
        setup()
    }
    
    override func prepareForInterfaceBuilder() {
        
        setup()
    }
    
    private func setup() {
        
        borderStyle = .none
        tag = 20
        clearButtonMode = .whileEditing
        addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
        
        setupRightView()
        setupPlaceholder()
    }
    
    // MARK: - Style
    
    private func setupPlaceholder() {
        
        let placeholderText = "Gib einen Namen ein"
        let attributes: [NSAttributedString.Key : Any] = [
            .foregroundColor: Color.get(.secondary),
            .font: Font.get(.Italic, family: .Roboto, size: 14.0)
        ]
        attributedPlaceholder = NSAttributedString(string: placeholderText, attributes: attributes)
    }
    
    // MARK: - Right View
    
    private var buttonAttributedTitle: NSAttributedString {
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineSpacing = 12.0
        
        let attributes: [NSAttributedString.Key : Any] = [
            .font: Font.get(.Bold, family: .Roboto, size: 10.0),
            .foregroundColor: UIColor.white,
            .paragraphStyle: paragraphStyle,
            .kern: 1.0
        ]
        return NSAttributedString(string: "FERTIG", attributes: attributes)
    }
    
    private func setupRightView() {
        
        let button = UIButton(type: .custom)
        button.setAttributedTitle(buttonAttributedTitle, for: .normal)
        button.layer.cornerRadius = 12.5
        button.contentEdgeInsets = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        button.addTarget(self, action: #selector(self.onDoneAction), for: .touchUpInside)
        button.backgroundColor = Color.get(.tertiary)
        
        rightView = button
        rightViewMode = .whileEditing
        
        onTextInputChanged(text ?? "")
    }
    
    @IBAction func onDoneAction(_ sender: Any) {
        
        guard let wishListName = text else {
            return
        }
        onButtonClick(wishListName)
    }
    
    func clearTextField() {
        
        text = ""
    }
    
}


// MARK: - Validation

extension NewWishListTextField {
    
    @objc func textFieldDidChange(_ textField: UITextField) {
        
        guard textField == self else { return }
        let textFieldText = textField.text ?? ""
        onTextInputChanged(textFieldText)
    }
    
    private func onTextInputChanged(_ input: String) {
        
        let isValid = validateInput(input)
        doneButton?.isEnabled = isValid
        doneButton?.alpha = isValid ? 1.0 : 0.5
    }
    
    private func validateInput(_ text: String) -> Bool {
        
        return !text.isEmpty
    }
}

// MARK: - Loading Indicator

extension NewWishListTextField: LoadingDelegate {
    
    func showLoading() {
        
        guard let donebutton = doneButton else { return }
        
        donebutton.setAttributedTitle(NSAttributedString(string: ""), for: .normal)
        
        if (activityIndicator == nil) {
            activityIndicator = createActivityIndicator()
        }
        
        showSpinning()
    }
    
    private func createActivityIndicator() -> UIActivityIndicatorView {
        
        let activityIndicator = UIActivityIndicatorView()
        activityIndicator.hidesWhenStopped = true
        activityIndicator.color = .white
        return activityIndicator
    }
    
    func dismissLoading() {
        
        guard let donebutton = doneButton else { return }
        
        donebutton.setAttributedTitle(buttonAttributedTitle, for: .normal)
        activityIndicator.stopAnimating()
    }

    private func showSpinning() {
        
        guard let donebutton = doneButton else { return }
        
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        donebutton.addSubview(activityIndicator)
        centerActivityIndicatorInButton()
        activityIndicator.startAnimating()
    }

    private func centerActivityIndicatorInButton() {
        
        guard let donebutton = doneButton else { return }
        
        let xCenterConstraint = NSLayoutConstraint(item: donebutton,
                                                   attribute: .centerX,
                                                   relatedBy: .equal,
                                                   toItem: activityIndicator,
                                                   attribute: .centerX,
                                                   multiplier: 1,
                                                   constant: 0)
        donebutton.addConstraint(xCenterConstraint)
        
        let yCenterConstraint = NSLayoutConstraint(item: donebutton,
                                                   attribute: .centerY,
                                                   relatedBy: .equal,
                                                   toItem: activityIndicator,
                                                   attribute: .centerY,
                                                   multiplier: 1,
                                                   constant: 0)
        donebutton.addConstraint(yCenterConstraint)
    }
}
