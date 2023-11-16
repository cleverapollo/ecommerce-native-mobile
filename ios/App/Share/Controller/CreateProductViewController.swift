//
//  CreateProductViewController.swift
//  App
//
//  Created by Alex on 16/11/2023.
//

import UIKit

class CreateProductViewController: UIViewController {

    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var navigationBar: DesignableNavigationItem!
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: { _ in
            WishDataStore.shared.reset()
        })
    }
    
    
    var webPageInfo: WebPageInfo!
    var webPageImage: WebPageImage?
    
    private var displayName: String {

        var displayName = webPageInfo.title
        if let imageName = webPageImage?.name, !imageName.isEmpty {
            displayName = imageName
        }
        displayName.truncateIfNeeded()
        return displayName
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        FirebaseAnalytics.logScreenEvent("share_extension-name-price")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()
        setupNotifications()
        
        hideKeyboardWhenTappedAround()
    }
    
    private func setupView() {
        
        nextButton.applyCreatorGradient()
        navigationBar.updateView(UIImage(resource: ImageResource.logoCreator))
        validateForm()
    }
    
    private func setupNotifications() {

        let notificationCenter = NotificationCenter.default
        notificationCenter.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(onTextFieldDidChange(_:)), name: UITextField.textDidChangeNotification, object: nil)
    }
    
    // MARK: Keyboard
    
    @objc func keyboardWillShow(notification:NSNotification) {
//        if let keyboardBeginSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
//            tableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardBeginSize.height, right: 0)
//         }
    }

    @objc func keyboardWillHide(notification:NSNotification) {
//        if let _ = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
//            tableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
//        }
    }
    
    // MARK: Form
    
    @objc private func onTextFieldDidChange(_ notification: Notification) {
//        guard let priceTextField = priceTextField else {
//            return
//        }
//        textFieldDidChange(priceTextField)
    }
    
    private func validateForm() {

//        var formIsValid = true
//        if let nameTextView = nameTextView {
//            formIsValid = !nameTextView.isEmpty()
//        }
//        if let priceTextField = priceTextField {
//            formIsValid = !priceTextField.isEmpty()
//        }
//        nextButton.isEnabled = formIsValid
    }

}


// MARK: - UITextFieldDelegate

extension CreateProductViewController: UITextFieldDelegate {
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
//        if textField == priceTextField {
//            dismissKeyboard()
//        }
        return true
    }
    
    func textFieldDidChange(_ textField: UITextField) {

        updatePrice(textField)
        
        validateForm()
    }
    
    private func updatePrice(_ textField: UITextField) {
//        guard textField == priceTextField,
//                let priceAmountString = textField.text else {
//            return
//        }
//        let amount = priceAmountString.decimalValue
//        WishDataStore.shared.wish.price.amount = amount
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
//        guard textField == priceTextField else { return true }
//        
//        switch string {
//         case "0","1","2","3","4","5","6","7","8","9":
//             return true
//        case "€":
//            let currencyCount = textField.text?.filter { $0 == "€" }.count ?? 0
//            if currencyCount >= 1 {
//                return false
//            } else {
//                return true
//            }
//         case ",":
//             let decimalCount = textField.text?.filter { $0 == "," }.count ?? 0
//             if decimalCount == 1 {
//                 return false
//             } else {
//                 return true
//             }
//         default:
//             let array = Array(string)
//             if array.count == 0 {
//                 return true
//             }
//             return false
//         }
        
        return false
    }
}

// MARK: - UITextViewDelegate

extension CreateProductViewController: UITextViewDelegate {
    
    func textViewDidChange(_ textView: UITextView) {

        updateName(textView)
        updateNote(textView)

        validateForm()
    }
    
    private func updateName(_ textView: UITextView) {
//        guard textView == nameTextView else { return }
//        WishDataStore.shared.wish.name = textView.text
    }
    
    private func updateNote(_ textView: UITextView) {
//        guard textView == noteTextView else { return }
//        WishDataStore.shared.wish.note = textView.text
    }
    
    func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
        let newText = (textView.text as NSString).replacingCharacters(in: range, with: text)
        let numberOfChars = newText.count
        return numberOfChars < Constants.maxAllowedChars
    }
    
}
