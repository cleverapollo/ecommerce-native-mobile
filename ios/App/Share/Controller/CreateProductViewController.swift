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
    @IBOutlet weak var imgProduct: UIImageView!
    @IBOutlet weak var txtName: TextFieldInnerPadding!
    @IBOutlet weak var txtPrice: TextFieldInnerPadding!
    @IBOutlet weak var txtCouponCode: TextFieldInnerPadding!
    @IBOutlet weak var txtCouponValue: TextFieldInnerPadding!
    @IBOutlet weak var txtDate: TextFieldInnerPadding!
    @IBOutlet weak var txtUrl: TextFieldInnerPadding!
    @IBOutlet weak var txtAffilateUrl: TextFieldInnerPadding!
    @IBOutlet weak var btnCalendar: UIButton!
    
    @IBOutlet weak var bottomConstraint: NSLayoutConstraint!
    
    
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
        setupData()
        setupNotifications()
        hideKeyboardWhenTappedAround()
    }
    
    private func setupView() {
        nextButton.applyCreatorGradient()
        btnCalendar.setTitle(nil, for: .normal)
        navigationBar.updateView(UIImage(resource: ImageResource.logoCreator))
        validateForm()
    }
    
    private func setupData() {
        var displayName = webPageInfo.title
        if let imageName = webPageImage?.name, !imageName.isEmpty {
            displayName = imageName
        }
        displayName.truncateIfNeeded()
        txtName.text = displayName
        if let webPageImage = webPageImage {
            imgProduct.setImageFromURl(imageUrlString: webPageImage.url)
        } else {
            imgProduct.image = Image.get(.fallbackWishImage)
        }
        
        txtPrice.text = "fsfd"
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
        print(!txtName.isEmpty() && !txtPrice.isEmpty())
//        nextButton.isEnabled = !txtName.isEmpty() && !txtPrice.isEmpty()
        nextButton.isEnabled = true
    }
    
    // MARK: Select Date
    
    @IBAction func selectDate(_ sender: Any) {
        
    }
    

}


// MARK: - UITextFieldDelegate

extension CreateProductViewController: UITextFieldDelegate {
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        dismissKeyboard()
        return true
    }
    
    func textFieldDidChange(_ textField: UITextField) {
        let value = textField.text ?? "0"
        switch textField {
        case txtName:
            updateName(value)
        case txtDate: 
            updateExpireDate(value)
            break
        case txtPrice:
            updatePrice(value)
            break
        case txtUrl:
            updateURL(value)
            break
        case txtCouponCode:
            updateCouponCode(value)
            break
        case txtCouponValue: 
            updateCouponValue(value)
            break
            
        default:
            break
        }
    
        validateForm()
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if textField == txtPrice {
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
        } else {
            let newText = (textField.text! as NSString).replacingCharacters(in: range, with: string)
            let numberOfChars = newText.count
            return numberOfChars < Constants.maxAllowedChars
        }
    }
    
    private func updatePrice(_ priceAmountString: String) {
        let amount = priceAmountString.decimalValue
        WishDataStore.shared.wish.price.amount = amount
    }
    
    private func updateName(_ name: String) {
        WishDataStore.shared.wish.name = name
        WishDataStore.shared.wish.note = name
    }
    
    private func updateURL(_ url: String) {
        WishDataStore.shared.wish.productUrl = url
    }
    
    private func updateAffiliateUrl(_ affiliateURL: String) {
        WishDataStore.shared.wish.affiliateUrl = affiliateURL
    }
    
    private func updateCouponCode(_ couponCode: String) {
        WishDataStore.shared.wish.coupon?.code = couponCode
    }
    
    private func updateCouponValue(_ couponValue: String) {
        WishDataStore.shared.wish.coupon?.value = couponValue
    }
    
    private func updateExpireDate(_ date: String) {
        WishDataStore.shared.wish.coupon?.expirationDate = date
    }
}
