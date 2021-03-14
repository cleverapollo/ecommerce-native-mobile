//
//  ProductImageViewController.swift
//  Share
//
//  Created by Tim Fischer on 23.01.21.
//

import UIKit
import MobileCoreServices

private let reuseIdentifier = "ProductInfoCell"

class ProductInfoCell: UICollectionViewCell {
    
    @IBOutlet weak var image: UIImageView!
    
}

class ProductImageViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    
    let authService = AuthService.shared
    let toastService = ToastService.shared
    
    var productInfos: [ProductInfo] = []
    var selectedProductInfo: ProductInfo?
    var selectedCell: ProductInfoCell?
    
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var closeButton: UIBarButtonItem!
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        self.showActivityIndicator("Wir durchsuchen derzeit die Seite nach Bildern \n hab noch einen kurzen Moment Geduld.")
        if let _ = authService.getAuthToken() {
            if let item = extensionContext?.inputItems.first as? NSExtensionItem {
                accessWebpageProperties(extensionItem: item)
            }
        } else {
            toastService.showNotAuthorizedToast(controller: self, extensionContext: self.extensionContext!)
        }
        WishDataStore.shared.reset()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setupView()
        
        self.collectionView.delegate = self
        self.collectionView.dataSource = self
    }
    
    private func setupView() {
        nextButton.isEnabled = selectedCell != nil
    }
    
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
     if let viewController = segue.destination as? EditDetailsViewController {
         let indexPath = collectionView.indexPath(for: selectedCell!)!
         viewController.productInfo = productInfos[indexPath.row]
     }
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return productInfos.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: reuseIdentifier, for: indexPath) as? ProductInfoCell else {
            return UICollectionViewCell()
        }
    
        let productInfo = productInfos[indexPath.row]
        cell.image.setImageFromURl(imageUrlString: productInfo.imageUrl)
    
        return cell
    }
    
     func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath) as! ProductInfoCell
        let productInfo = productInfos[indexPath.row]
        
        if selectedCell == cell {
            cell.layer.borderWidth = 0.0
            selectedCell = nil
            nextButton.isEnabled = false
        } else {
            cell.layer.borderWidth = 2.0
            cell.layer.borderColor = UIColor(hex: "#3E3E3E")?.cgColor
            selectedCell = cell
            nextButton.isEnabled = true
            WishDataStore.shared.wish.addProductInfo(productInfo)
        }
        
    }
    
    func collectionView(_ collectionView: UICollectionView, didDeselectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath)
        cell?.layer.borderWidth = 2.0
        cell?.layer.borderColor = UIColor.white.cgColor
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let width = view.frame.size.width
        // in case you you want the cell to be 40% of your controllers view
        return CGSize(width: width * 0.4, height: width * 0.4)
    }

    func accessWebpageProperties(extensionItem: NSExtensionItem) {
        let propertyList = String(kUTTypePropertyList)

        for attachment in extensionItem.attachments! where attachment.hasItemConformingToTypeIdentifier(propertyList) {
            attachment.loadItem(
                forTypeIdentifier: propertyList,
                options: nil,
                completionHandler: { (item, error) -> Void in
                    guard let dictionary = item as? NSDictionary, let results = dictionary[NSExtensionJavaScriptPreprocessingResultsKey] as? NSDictionary else { return }

                    guard let title = results["title"] as? String,
                          let url = results["url"] as? String,
                          let productInfosDict = results["productInfos"] as? [NSDictionary]  else {
                            return
                    }
                    
                    let price = results["price"] as? Double ?? 0.00
                    
                    self.productInfos = productInfosDict.compactMap { (dict: NSDictionary) in
                        guard let imageUrl = dict["imageUrl"] as? String else { return nil }
                        var displayName = title
                        if let name = dict["name"] as? String, !name.isEmpty {
                            displayName = name
                        }
                        return ProductInfo(productUrl: url, imageUrl: imageUrl, name: displayName, price: Price(amount: Decimal(price)))
                    }
                    DispatchQueue.main.async {
                        self.collectionView.reloadData()
                        self.removeActivityIndicator()
                    }
                }
            )
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        let width = view.frame.size.width
        let cellWidth = width * 0.425
        let cellsInRow: CGFloat = 2
        
        let totalCellWidth = cellWidth * cellsInRow
        let totalSpacingWidth = 14.0 * (cellsInRow - 1)

        let leftInset = (collectionView.frame.width - CGFloat(totalCellWidth + totalSpacingWidth)) / 2
        let rightInset = leftInset
        return UIEdgeInsets(top: 10, left: leftInset, bottom: 10, right: rightInset)
    }

    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: {_ in
            WishDataStore.shared.reset()
        })
    }
    
}
