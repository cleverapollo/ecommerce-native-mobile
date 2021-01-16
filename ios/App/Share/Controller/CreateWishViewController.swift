//
//  CreateWishViewController.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit

class CreateWishViewController: UITableViewController, UITextFieldDelegate {

    @IBOutlet weak var nextButton: UIBarButtonItem!
    @IBOutlet weak var productImage: UIImageView!
    @IBOutlet weak var productName: UITextField!
    @IBOutlet weak var productPrice: UITextField!
    @IBOutlet weak var productPriceCurrency: UITextField!
    
    @IBOutlet var textFields: [UITextField]!
    
    var productInfo: ProductInfo!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setupView()
        
        NotificationCenter.default.addObserver(self, selector: #selector(textDidChange(_:)), name: UITextField.textDidChangeNotification, object: nil)
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    // MARK: UITextFieldDelegate
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == productName {
            productPrice.becomeFirstResponder()
        }
        return true
    }
    
    @objc private func textDidChange(_ notification: Notification) {
        var formIsValid = true

        for textField in textFields {
            if textField == productName {
                WishDataStore.shared.wish.name = textField.text
            } else if textField == productPrice {
                updatePrice()
            } else if textField == productPriceCurrency {
                if let text = textField.text, text.count > 1 {
                    textField.deleteBackward()
                }
                updatePrice()
            }
            
            guard validate(textField) else {
                formIsValid = false
                break
            }
        }

        // Update Save Button
        nextButton.isEnabled = formIsValid
    }
    
    func updatePrice() {
        guard let value = productPrice.text, let currency = productPriceCurrency.text else { return }
        WishDataStore.shared.wish.price = "\(value) \(currency)"
    }
    
    fileprivate func validate(_ textField: UITextField) -> Bool {
        guard let text = textField.text else {
            return false
        }

        return text.count > 0
    }
    
    // MARK: - View Methods

    func setupView() {
        productImage.setImageFromURl(ImageUrl: productInfo.imageUrl)
        productName.text = productInfo.name
        
        nextButton.isEnabled = false
    }
}
