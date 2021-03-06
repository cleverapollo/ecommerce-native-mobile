//
//  EditDetailsViewController.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit

private enum ViewIdentifier: Int {
    case productImage = 0
    case productName = 1
    case productPrice = 2
}

class ProductImageTableViewCell: UITableViewCell {
    static let reuseIdentifier = "ProductImageTableViewCell"
    
    @IBOutlet weak var productImageView: UIImageView!
}

class ProductNameTableViewCell: UITableViewCell {
    static let reuseIdentifier = "ProductNameTableViewCell"
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var productNameView: DesignableTextView!
}

class ProductPriceTableViewCell: UITableViewCell {
    static let reuseIdentifier = "ProductPriceTableViewCell"
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var productPriceView: TextFieldInnerPadding!
}

class EditDetailsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UITextFieldDelegate, UITextViewDelegate {

    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var tableView: SelfSizedTableView!
    
    var productImage: UIImageView? {
        get {
            return findView(.productImage)
        }
    }
    
    var productName: UITextView? {
        get {
            return findView(.productName)
        }
    }
    
    var productPrice: UITextField? {
        get {
            return findView(.productPrice)
        }
    }
    
    private func findView<T>(_ id: ViewIdentifier) -> T? {
        return tableView.viewWithTag(id.rawValue) as? T
    }
    
    var textFields: [UITextInput] = []
    
    var productInfo: ProductInfo!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()
        
        let notificationCenter = NotificationCenter.default
        notificationCenter.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(textDidChange(_:)), name: UITextField.textDidChangeNotification, object: nil)
        
        self.hideKeyboardWhenTappedAround()
    }
    
    
    @objc func keyboardWillShow(notification:NSNotification) {
        if let keyboardBeginSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            tableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardBeginSize.height, right: 0)
         }
    }

    @objc func keyboardWillHide(notification:NSNotification) {
        if let _ = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            tableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        }
    }

    // MARK: - Table view data source

    func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section == 0 {
            if let cell = tableView.dequeueReusableCell(withIdentifier: ProductImageTableViewCell.reuseIdentifier, for: indexPath) as? ProductImageTableViewCell {
                cell.productImageView.setImageFromURl(imageUrlString: productInfo.imageUrl)
                return cell
            }
        } else if indexPath.section == 1 {
            if let cell = tableView.dequeueReusableCell(withIdentifier: ProductNameTableViewCell.reuseIdentifier, for: indexPath) as? ProductNameTableViewCell {
                textFields.append(cell.productNameView)
                cell.productNameView.text = productInfo.name
                /*cell.productNameView.translatesAutoresizingMaskIntoConstraints = true
                cell.productNameView.sizeToFit()
                cell.productNameView.isScrollEnabled = false*/
                return cell
            }
        } else if indexPath.section == 2 {
            if let cell = tableView.dequeueReusableCell(withIdentifier: ProductPriceTableViewCell.reuseIdentifier, for: indexPath) as? ProductPriceTableViewCell {
                textFields.append(cell.productPriceView)
                cell.productPriceView.text = productInfo.price
                return cell
            }
        }
        return UITableViewCell()
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.section == 0 {
            return 241
        } else if indexPath.section == 1 {
            return 168
        } else if indexPath.section == 2 {
            return 99
        }
        return UITableView.automaticDimension
    }
    
    // MARK: UITextFieldDelegate
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == productPrice {
            dismissKeyboard()
        }
        return true
    }
    
    @objc private func textDidChange(_ notification: Notification) {
        validateTextFields()
    }
    
    func validateTextFields() {
        var formIsValid = true
        for textInput in textFields {
            if let textField = textInput as? UITextField {
                if textField == productPrice, let amountCurrency = textField.text {
                    WishDataStore.shared.wish.price = amountCurrency
                }
            } else if let textView = textInput as? UITextView {
                /*textView.translatesAutoresizingMaskIntoConstraints = true
                textView.sizeToFit()
                textView.isScrollEnabled = false*/
                if textView == productName {
                    WishDataStore.shared.wish.name = textView.text
                }
            }
            
            guard validate(textInput) else {
                formIsValid = false
                break
            }
        }

        // Update Save Button
        nextButton.isEnabled = formIsValid
    }
    
    fileprivate func validate(_ textInput: UITextInput) -> Bool {
        var text = ""
        
        if let textField = textInput as? UITextField {
            text = textField.text != nil ? textField.text! : text
        } else if let textView = textInput as? UITextView {
            text = textView.text != nil ? textView.text! : text
        }

        return text.count > 0
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard textField == productPrice else { return true }
        
        switch string {
         case "0","1","2","3","4","5","6","7","8","9":
             return true
        case "€":
            let currencyCount = textField.text?.filter { $0 == "€" }.count ?? 0
            if currencyCount >= 1 {
                return false
            } else {
                return true
            }
         case ",":
             let decimalCount = textField.text?.filter { $0 == "," }.count ?? 0
             if decimalCount == 1 {
                 return false
             } else {
                 return true
             }
         default:
             let array = Array(string)
             if array.count == 0 {
                 return true
             }
             return false
         }
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        if textField == productPrice, let text = textField.text {
            if text.filter({ $0 == "€" }).count < 1 {
                textField.text! += "€"
            }
        }
    }
    
    func countCharacterInString(string: String, char: String.Element) -> Int {
        return string.filter { $0 == char }.count
    }
    
    // MARK: - View Methods

    func setupView() {
        validateTextFields()
    }
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: { _ in
            WishDataStore.shared.reset()
        })
    }
    
}
