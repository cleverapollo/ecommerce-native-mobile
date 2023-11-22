//
//  CreateProductViewController.swift
//  App
//
//  Created by Alex on 16/11/2023.
//

import UIKit
import Foundation

class CreateProductViewController: UIViewController {
    
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var navigationBar: DesignableNavigationItem!
    @IBOutlet weak var imgProduct: UIImageView!
    @IBOutlet weak var nameTextfield: TextFieldInnerPadding!
    @IBOutlet weak var priceTextfield: TextFieldInnerPadding!
    @IBOutlet weak var couponCodeTextfield: TextFieldInnerPadding!
    @IBOutlet weak var couponValueTextfield: TextFieldInnerPadding!
    @IBOutlet weak var expiredDateTextfield: TextFieldInnerPadding!
    @IBOutlet weak var urlTextfield: TextFieldInnerPadding!
    @IBOutlet weak var affiliateUrlTextfield: TextFieldInnerPadding!
    @IBOutlet weak var calendarButton: UIButton!
    
    @IBOutlet weak var bottomConstraint: NSLayoutConstraint!
    
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: { _ in
            ProductDataStore.shared.reset()
        })
    }
    
    
    var webPageInfo: WebPageInfo!
    var webPageImage: WebPageImage?
    var dateSelected: Date!
    
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
        setupData()
        setupView()
        setupNotifications()
        hideKeyboardWhenTappedAround()
    }
    
    private func setupView() {
        nextButton.applyPurpleGradient()
        calendarButton.setTitle(nil, for: .normal)
        navigationBar.updateView(Icon.get(.logoCreator))
        priceTextfield.delegate = self
        nameTextfield.delegate = self
        urlTextfield.delegate = self
        priceTextfield.delegate = self
        couponCodeTextfield.delegate = self
        affiliateUrlTextfield.delegate = self
        couponValueTextfield.delegate = self
        validateForm()
    }
    
    private func setupData() {
        dateSelected = Date()
        var displayName = webPageInfo.title
        if let imageName = webPageImage?.name, !imageName.isEmpty {
            displayName = imageName
        }
        displayName.truncateIfNeeded()
        nameTextfield.text = displayName
        if let webPageImage = webPageImage {
            imgProduct.setImageFromURl(imageUrlString: webPageImage.url)
        } else {
            imgProduct.image = Image.get(.fallbackWishImage)
        }
        
        priceTextfield.text = "\(webPageInfo.price.amount)"
        couponCodeTextfield.text = "\(webPageInfo.coupon?.code ?? "")"
        couponValueTextfield.text = "\(webPageInfo.coupon?.value ?? "")"
        urlTextfield.text = "\(webPageInfo.url)"
    }
    
    private func setupNotifications() {
        
        let notificationCenter = NotificationCenter.default
        notificationCenter.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        notificationCenter.addObserver(self, selector: #selector(keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
    }
    
    // MARK: Keyboard
    
    @objc func keyboardWillShow(notification:NSNotification) {
        if let keyboardBeginSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            bottomConstraint.constant = keyboardBeginSize.height + 24
            
        }
    }
    
    @objc func keyboardWillHide(notification:NSNotification) {
        if let _ = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            bottomConstraint.constant = 24
        }
    }
    
    // MARK: Form
    
    private func validateForm() {
        nextButton.isEnabled = !nameTextfield.isEmpty() && !priceTextfield.isEmpty()
    }
    
    // MARK: Select Date
    
    @IBAction func selectDate(_ sender: Any) {
        
        let alert = UIAlertController(title: "", message: "", preferredStyle: .alert)
        alert.addDatePicker(mode: .date, date: Date(), minimumDate: nil, maximumDate: nil) { date in
            self.dateSelected = date
        }
        let confirmAction = Alert.createAlertAction(title: "Anzeigen") { _ in
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            let formatterShow = DateFormatter()
            formatterShow.dateFormat = "dd.MM.yyyy"
            self.expiredDateTextfield.text = formatterShow.string(from: self.dateSelected)
            self.updateExpireDate(formatter.string(from: self.dateSelected))
        }
        
        alert.addAction(confirmAction)
        
        let cancelAction = Alert.createAlertAction(title: "Abbrechen", style: .cancel)
        alert.addAction(cancelAction)
        self.present(alert, animated: true)
    }
}


// MARK: - UITextFieldDelegate

extension CreateProductViewController: UITextFieldDelegate {
    
    func textFieldDidChangeSelection(_ textField: UITextField) {
        validateForm()
        let value = textField.text ?? "0"
        switch textField {
        case nameTextfield:
            updateName(value)
        case priceTextfield:
            updatePrice(value)
            break
        case urlTextfield:
            updateURL(value)
            break
        case affiliateUrlTextfield:
            updateAffiliateUrl(value)
            break
        case couponCodeTextfield:
            updateCouponCode(value)
            break
        case couponValueTextfield:
            updateCouponValue(value)
            break
        default:
            break
        }
    }
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if textField == priceTextfield {
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
        } else if textField == urlTextfield || textField == affiliateUrlTextfield {
            let newText = (textField.text! as NSString).replacingCharacters(in: range, with: string)
            let numberOfChars = newText.count
            return numberOfChars < Constants.maxAllowedURLs
        } else {
            let newText = (textField.text! as NSString).replacingCharacters(in: range, with: string)
            let numberOfChars = newText.count
            return numberOfChars < Constants.maxAllowedChars
        }
    }
    
    private func updatePrice(_ priceAmountString: String) {
        let amount = priceAmountString.decimalValue
        ProductDataStore.shared.product.price.amount = amount
    }
    
    private func updateName(_ name: String) {
        ProductDataStore.shared.product.name = name
    }
    
    private func updateURL(_ url: String) {
        ProductDataStore.shared.product.productUrl = url
    }
    
    private func updateAffiliateUrl(_ affiliateURL: String) {
        ProductDataStore.shared.product.affiliateUrl = affiliateURL
    }
    
    private func updateCouponCode(_ couponCode: String) {
        if ProductDataStore.shared.product.coupon == nil {
            ProductDataStore.shared.product.coupon = Coupon(code: couponCode, value: "", expirationDate: "")
        } else {
            ProductDataStore.shared.product.coupon?.code = couponCode
        }
    }
    
    private func updateCouponValue(_ couponValue: String) {
        if ProductDataStore.shared.product.coupon == nil {
            ProductDataStore.shared.product.coupon = Coupon(code: "", value: couponValue, expirationDate: "")
        } else {
            ProductDataStore.shared.product.coupon?.value = couponValue
        }
    }
    
    private func updateExpireDate(_ date: String) {
        if ProductDataStore.shared.product.coupon == nil {
            ProductDataStore.shared.product.coupon = Coupon(code: "", value: "", expirationDate:  date)
        } else {
            ProductDataStore.shared.product.coupon?.expirationDate = date
        }
    }
}
