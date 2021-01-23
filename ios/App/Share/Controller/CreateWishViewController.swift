//
//  CreateWishViewController.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit

class CreateWishViewController: UITableViewController, UITextFieldDelegate, UITextViewDelegate {

    @IBOutlet weak var nextButton: UIBarButtonItem!
    @IBOutlet weak var productImage: UIImageView!
    @IBOutlet weak var productPrice: UITextField!
    @IBOutlet weak var productPriceCurrency: UITextField!
    @IBOutlet weak var productName: UITextView!
    
    @IBOutlet var textFields: [UITextInput]!
    
    var productInfo: ProductInfo!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setupView()
        
        NotificationCenter.default.addObserver(self, selector: #selector(textDidChange(_:)), name: UITextField.textDidChangeNotification, object: nil)
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 4
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

        for textInput in textFields {
            if let textField = textInput as? UITextField {
                if textField == productPrice {
                    updatePrice()
                } else if textField == productPriceCurrency {
                    if let text = textField.text, text.count > 1 {
                        textInput.deleteBackward()
                    }
                    updatePrice()
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
    
    func updatePrice() {
        guard let value = productPrice.text, let currency = productPriceCurrency.text else { return }
        WishDataStore.shared.wish.price = "\(value) \(currency)"
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
    
    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        guard section == 2 || section == 3 else { return nil }
        
        let headerView = UIView.init(frame: CGRect.init(x: 0, y: 0, width: tableView.frame.width, height: 30))
        headerView.backgroundColor = UIColor(named: "backgroundColor")
        
        let label = SectionHeaderLabel()
        label.frame = CGRect.init(x: 5, y: 5, width: headerView.frame.width-10, height: 18)
        label.text = section == 2 ? "Name" : "Preis"

        headerView.addSubview(label)

        return headerView
    }
    
    // MARK: - View Methods

    func setupView() {
        productImage.setImageFromURl(ImageUrl: productInfo.imageUrl)
        productName.text = productInfo.name
        
        nextButton.isEnabled = false
    }
}
