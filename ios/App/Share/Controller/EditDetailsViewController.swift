import UIKit

private enum ViewIdentifier: Int {
    case productImage = 0
    case productName = 1
    case productPrice = 2
}

protocol CustomTableViewCell {
    
    static var sectionNumber: Int { get }
    static var reuseIdentifier: String { get }
}

class ProductImageTableViewCell: UITableViewCell, CustomTableViewCell {
    static let sectionNumber: Int = 0
    static let reuseIdentifier = "ProductImageTableViewCell"
    
    @IBOutlet weak var productImageView: UIImageView!
}

class ProductNameTableViewCell: UITableViewCell, CustomTableViewCell {
    static let sectionNumber: Int = 1
    static let reuseIdentifier = "ProductNameTableViewCell"
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var productNameView: DesignableTextView!
}

class ProductPriceTableViewCell: UITableViewCell {
    static let sectionNumber: Int = 2
    static let reuseIdentifier = "ProductPriceTableViewCell"
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var productPriceView: TextFieldInnerPadding!
}

class EditDetailsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UITextFieldDelegate, UITextViewDelegate {

    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var tableView: SelfSizedTableView!
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: { _ in
            WishDataStore.shared.reset()
        })
    }
    
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
    
    var webPageInfo: WebPageInfo!
    var webPageImage: WebPageImage?
    
    private var displayName: String {
        var displayName = webPageInfo.title
        if let imageName = webPageImage?.name, !imageName.isEmpty {
            displayName = imageName
        }
        return displayName
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        FirebaseAnalytics.logScreenEvent("share_extension-name-price")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()
        
        let notificationCenter = NotificationCenter.default
        notificationCenter.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(textDidChange(_:)), name: UITextField.textDidChangeNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(textDidChange(_:)), name: UITextView.textDidChangeNotification, object: nil)
        
        self.hideKeyboardWhenTappedAround()
    }
    
    func setupView() {
        
        setupActionButton()
        validateTextFields()
    }
    
    private func setupActionButton() {
        
        nextButton.applyGradient()
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
        
        switch indexPath.section {
        case ProductImageTableViewCell.sectionNumber:
            return setupImageTableViewCell(tableView, cellForRowAt: indexPath)
        case ProductNameTableViewCell.sectionNumber:
            return setupNameTableViewCell(tableView, cellForRowAt: indexPath)
        case ProductPriceTableViewCell.sectionNumber:
            return setupPriceTableViewCell(tableView, cellForRowAt: indexPath)
        default:
            return UITableViewCell()
        }
    }
    
    private func setupImageTableViewCell(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ProductImageTableViewCell.reuseIdentifier, for: indexPath) as? ProductImageTableViewCell else {
            return UITableViewCell()
        }
        if let webPageImage = webPageImage {
            cell.productImageView.setImageFromURl(imageUrlString: webPageImage.url)
        } else {
            cell.productImageView.image = Image.get(.fallbackWishImage)
        }
        return cell
    }
    
    private func setupNameTableViewCell(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ProductNameTableViewCell.reuseIdentifier, for: indexPath) as? ProductNameTableViewCell else {
            return UITableViewCell()
        }
        textFields.append(cell.productNameView)
        cell.productNameView.text = displayName
        
        return cell
    }
    
    private func setupPriceTableViewCell(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ProductPriceTableViewCell.reuseIdentifier, for: indexPath) as? ProductPriceTableViewCell else {
            return UITableViewCell()
        }
        textFields.append(cell.productPriceView)
        cell.productPriceView.text = webPageInfo.price.amount.formattedAmount
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
        switch indexPath.section {
        case ProductImageTableViewCell.sectionNumber:
            return 241
        case ProductNameTableViewCell.sectionNumber:
            return 168
        case ProductPriceTableViewCell.sectionNumber:
            return 99
        default:
            return UITableView.automaticDimension
        }
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
                if textField == productPrice, let priceAmountString = textField.text {
                    let amount = priceAmountString.decimalValue
                    WishDataStore.shared.wish.price.amount = amount
                }
            } else if let textView = textInput as? UITextView {
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
    
    func countCharacterInString(string: String, char: String.Element) -> Int {
        return string.filter { $0 == char }.count
    }

}
