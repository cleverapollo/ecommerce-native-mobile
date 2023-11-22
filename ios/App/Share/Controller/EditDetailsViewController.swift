import UIKit

private enum ViewIdentifier: Int {
    case image = 0
    case name = 1
    case note = 2
    case price = 3
    case isFavorite = 4
}

protocol CustomTableViewCell {
    
    static var sectionNumber: Int { get }
    static var reuseIdentifier: String { get }
}

class ProductImageTableViewCell: UITableViewCell, CustomTableViewCell {
    static let sectionNumber: Int = ViewIdentifier.image.rawValue
    static let reuseIdentifier = "ProductImageTableViewCell"
    
    @IBOutlet weak var productImageView: UIImageView!
}

class ProductNameTableViewCell: UITableViewCell, CustomTableViewCell {
    static let sectionNumber: Int = ViewIdentifier.name.rawValue
    static let reuseIdentifier = "ProductNameTableViewCell"
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var productNameView: DesignableTextView!
}

class ProductNoteTableViewCell: UITableViewCell, CustomTableViewCell {
    static let sectionNumber: Int = ViewIdentifier.note.rawValue
    static let reuseIdentifier = "ProductNoteTableViewCell"
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var productNoteView: DesignableTextView!
}

class ProductPriceTableViewCell: UITableViewCell {
    static let sectionNumber: Int = ViewIdentifier.price.rawValue
    static let reuseIdentifier = "ProductPriceTableViewCell"
    
    @IBOutlet weak var headerLabel: UILabel!
    @IBOutlet weak var productPriceView: TextFieldInnerPadding!
}

class ProductIsFavoriteTableViewCell: UITableViewCell {
    static let sectionNumber: Int = ViewIdentifier.isFavorite.rawValue
    static let reuseIdentifier = "ProductIsFavoriteTableViewCell"
    
    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var switchView: CustomSwitch!
}

class EditDetailsViewController: UIViewController {

    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var tableView: SelfSizedTableView!
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: { _ in
            WishDataStore.shared.reset()
        })
    }
    
    @IBAction func onSwitchButtonChanged(_ sender: UISwitch) {
        WishDataStore.shared.wish.isFavorite = sender.isOn
    }
    
    var imageView: UIImageView? { findView(.image) }
    var nameTextView: UITextView? { findView(.name) }
    var noteTextView: UITextView? { findView(.note) }
    var priceTextField: UITextField? { findView(.price) }
    var isFavoriteSwitch: CustomSwitch? { findView(.isFavorite) }
    
    private func findView<T>(_ id: ViewIdentifier) -> T? {
        return tableView.viewWithTag(id.rawValue) as? T
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
        
        // add spacing below the table view
        tableView.contentInset = Constants.tableViewInsets
        // add gradient to the button
        nextButton.applyOrangeGradient()
        // set enable state for action button depending on form validation
        validateForm()
    }
    
    private func setupNotifications() {

        let notificationCenter = NotificationCenter.default
        notificationCenter.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(onTextFieldDidChange(_:)), name: UITextField.textDidChangeNotification, object: nil)
        // notificationCenter.addObserver(self, selector: #selector(onTextViewDidChange(_:)), name: UITextView.textDidChangeNotification, object: nil)
    }
    
    // MARK: Keyboard
    
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
    
    // MARK: Form
    
    @objc private func onTextFieldDidChange(_ notification: Notification) {
        guard let priceTextField = priceTextField else {
            return
        }
        textFieldDidChange(priceTextField)
    }
    
    private func validateForm() {

        var formIsValid = true
        if let nameTextView = nameTextView {
            formIsValid = !nameTextView.isEmpty()
        }
        if let priceTextField = priceTextField {
            formIsValid = !priceTextField.isEmpty()
        }
        nextButton.isEnabled = formIsValid
    }

}

// MARK: - UITableViewDelegate

extension EditDetailsViewController: UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
        switch indexPath.section {
        case ProductImageTableViewCell.sectionNumber:
            return 241
        case ProductNameTableViewCell.sectionNumber:
            return 150
        case ProductNoteTableViewCell.sectionNumber:
            return 150
        case ProductPriceTableViewCell.sectionNumber:
            return 100
        default:
            return UITableView.automaticDimension
        }
    }
    
}

// MARK: - UITableViewDataSource

extension EditDetailsViewController: UITableViewDataSource {
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 5
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
        case ProductNoteTableViewCell.sectionNumber:
            return setupNoteTableViewCell(tableView, cellForRowAt: indexPath)
        case ProductPriceTableViewCell.sectionNumber:
            return setupPriceTableViewCell(tableView, cellForRowAt: indexPath)
        case ProductIsFavoriteTableViewCell.sectionNumber:
            return setupIsFavoriteTableViewCell(tableView, cellForRowAt: indexPath)
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
        cell.productNameView.text = displayName
        cell.productNameView.delegate = self
        
        return cell
    }
    
    private func setupNoteTableViewCell(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ProductNoteTableViewCell.reuseIdentifier, for: indexPath) as? ProductNoteTableViewCell else {
            return UITableViewCell()
        }
        cell.productNoteView.delegate = self
        return cell
    }
    
    private func setupPriceTableViewCell(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ProductPriceTableViewCell.reuseIdentifier, for: indexPath) as? ProductPriceTableViewCell else {
            return UITableViewCell()
        }
        cell.productPriceView.text = webPageInfo.price.amount.formattedAmount
        cell.productPriceView.delegate = self
        return cell
    }
    
    private func setupIsFavoriteTableViewCell(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ProductIsFavoriteTableViewCell.reuseIdentifier, for: indexPath) as? ProductIsFavoriteTableViewCell else {
            return UITableViewCell()
        }
        cell.switchView.isOn = false
        return cell
    }
    
}

// MARK: - UITextFieldDelegate

extension EditDetailsViewController: UITextFieldDelegate {
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == priceTextField {
            dismissKeyboard()
        }
        return true
    }
    
    func textFieldDidChange(_ textField: UITextField) {

        updatePrice(textField)
        
        validateForm()
    }
    
    private func updatePrice(_ textField: UITextField) {
        guard textField == priceTextField,
                let priceAmountString = textField.text else {
            return
        }
        let amount = priceAmountString.decimalValue
        WishDataStore.shared.wish.price.amount = amount
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard textField == priceTextField else { return true }
        
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
}

// MARK: - UITextViewDelegate

extension EditDetailsViewController: UITextViewDelegate {
    
    func textViewDidChange(_ textView: UITextView) {

        updateName(textView)
        updateNote(textView)

        validateForm()
    }
    
    private func updateName(_ textView: UITextView) {
        guard textView == nameTextView else { return }
        WishDataStore.shared.wish.name = textView.text
    }
    
    private func updateNote(_ textView: UITextView) {
        guard textView == noteTextView else { return }
        WishDataStore.shared.wish.note = textView.text
    }
    
    func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
        let newText = (textView.text as NSString).replacingCharacters(in: range, with: text)
        let numberOfChars = newText.count
        return numberOfChars < Constants.maxAllowedChars
    }
    
}
