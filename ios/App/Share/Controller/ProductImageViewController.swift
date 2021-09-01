//
//  ProductImageViewController.swift
//  Share
//
//  Created by Tim Fischer on 23.01.21.
//

import UIKit
import MobileCoreServices
import FirebaseAnalytics

private let reuseIdentifier = "ProductInfoCell"

class ProductInfoCell: UICollectionViewCell {
    
    @IBOutlet weak var image: UIImageView!
    
}

class ProductImageViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    
    let authService = AuthService.shared
    let alertService = AlertService.shared
    
    var productInfos: [ProductInfo] = []
    var selectedProductInfo: ProductInfo?
    var selectedCell: ProductInfoCell?
    var itemsToDelete: [IndexPath: ProductInfo] = [:]
    
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var closeButton: UIBarButtonItem!
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        authService.getAuthToken(completionHandler: { idToken in
            if idToken == nil {
                self.alertService.showNotAuthorizedToast(controller: self, extensionContext: self.extensionContext!)
            } else if let item = self.extensionContext?.inputItems.first as? NSExtensionItem {
                self.fetchProductInfos(extensionItem: item)
            }
        })
        WishDataStore.shared.reset()
        
        Analytics.logEvent(AnalyticsEventScreenView, parameters: [
            AnalyticsParameterScreenName: "share_extension-picture"
        ])
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
        let imageLoaded = cell.image.setImageFromURl(imageUrlString: productInfo.imageUrl)
        if !imageLoaded {
            itemsToDelete[indexPath] = productInfo
        }
        
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
    
    func fetchProductInfos(extensionItem: NSExtensionItem) {
        // web page
        let propertyList = String(kUTTypePropertyList)
        // thrid party apps
        let url = String(kUTTypeURL)
        let text = String(kUTTypeText)
        
        for attachment in extensionItem.attachments! {
            if attachment.hasItemConformingToTypeIdentifier(propertyList) {
                fetchProductInfosFromWebPage(attachment)
            } else if attachment.hasItemConformingToTypeIdentifier(url) {
                attachment.loadItem(forTypeIdentifier: url, options: nil, completionHandler: { (item, error) in
                    if let urlContent = item as? URL {
                        self.fetchProductInfosFromWebView(urlContent)
                    }
                })
            } else if attachment.hasItemConformingToTypeIdentifier(text) {
                attachment.loadItem(forTypeIdentifier: text, options: nil, completionHandler: { (item, error) in
                    if let textContent = item as? String, let webUrl = self.getProductUrlFromProductDescription(textContent)  {
                        self.fetchProductInfosFromWebView(webUrl)
                    }
                })
            }
        }
    }
    
    func fetchProductInfosFromWebPage(_ attachment: NSItemProvider) {
        self.showActivityIndicator("Wir durchsuchen derzeit die Seite nach Bildern \n hab noch einen kurzen Moment Geduld.")
        attachment.loadItem(
            forTypeIdentifier: String(kUTTypePropertyList),
            options: nil,
            completionHandler: { (item, error) -> Void in
                guard let dictionary = item as? NSDictionary, let results = dictionary[NSExtensionJavaScriptPreprocessingResultsKey] as? NSDictionary else {
                    self.reloadViewRemoveActivityIndicator()
                    return
                }
                
                guard let title = results["title"] as? String,
                      let url = results["url"] as? String,
                      let productInfosDict = results["productInfos"] as? [NSDictionary]  else {
                    self.reloadViewRemoveActivityIndicator()
                    return
                }
                
                var priceAmount: Decimal = 0.00
                if let doublePrice = results["price"] as? Double  {
                    priceAmount = Decimal(doublePrice)
                } else if let decimalPrice = results["price"] as? Decimal {
                    priceAmount = decimalPrice
                }
                
                var productInfoId: UInt = 0
                self.productInfos = productInfosDict.compactMap { (dict: NSDictionary) in
                    guard let imageUrl = dict["imageUrl"] as? String else { return nil }
                    var displayName = title
                    if let name = dict["name"] as? String, !name.isEmpty {
                        displayName = name
                    }
                    productInfoId += 1
                    return ProductInfo(id: productInfoId, productUrl: url, imageUrl: imageUrl, name: displayName, price: Price(amount: priceAmount))
                }
                self.reloadViewRemoveActivityIndicator()
            }
        )
    }
    
    func fetchProductInfosFromWebView(_ productUrl: URL?) {
        if let webUrl = productUrl, webUrl.absoluteString.starts(with: "https://") {
            self.showActivityIndicator("Wir durchsuchen derzeit die Seite nach Bildern \n hab noch einen kurzen Moment Geduld.")
            DispatchQueue.main.async {
                let webView = WebViewController(webUrl: webUrl, productImageViewController: self)
                self.view.addSubview(webView)
                webView.loadWebUrl(webUrl)
            }
        }
    }
    
    func getProductUrlFromProductDescription(_ description: String) -> URL? {
        var imageUrl: URL? = nil
        let detector = try! NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
        let matches = detector.matches(in: description, options: [], range: NSRange(location: 0, length: description.utf16.count))

        for match in matches {
            guard let range = Range(match.range, in: description) else { continue }
            let urlString = description[range]
            print(urlString)
            if let url = URL(string: String(urlString)) {
                imageUrl = url
                break
            }
        }
        return imageUrl
    }
    
    func reloadViewRemoveActivityIndicator() {
        DispatchQueue.main.async {
            self.collectionView.reloadData()
            self.collectionView.performBatchUpdates(nil, completion: {
                (result) in
                // ready
                if !self.itemsToDelete.isEmpty {
                    for itemToDelete in self.itemsToDelete {
                        self.productInfos.removeAll(where: { $0 == itemToDelete.value })
                    }
                    self.collectionView.deleteItems(at: self.itemsToDelete.compactMap { $0.key })
                    
                    if self.productInfos.isEmpty {
                        self.alertService.showNoImagesFoundAlert(controller: self, extensionContext: self.extensionContext)
                    }
                }
            })
            self.removeActivityIndicator()
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
