//
//  SelectImageViewController.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit
import MobileCoreServices

private let reuseIdentifier = "ProductInfoCell"

class ProductInfoCell: UICollectionViewCell {
    
    @IBOutlet weak var image: UIImageView!
    @IBOutlet weak var name: UILabel!
    
}

class SelectImageViewController: UICollectionViewController {
    
    @IBOutlet weak var selectProductInfoButton: UIBarButtonItem!
    
    let authService = AuthService.shared
    let toastService = ToastService.shared
    
    var productInfos: [ProductInfo] = []
    var selectedCell: ProductInfoCell? = nil

    override func viewDidLoad() {
        super.viewDidLoad()

        setupView()
        
        if #available(iOS 13, *) {
            let appearance = navigationController?.navigationBar.standardAppearance.copy()
            navigationItem.standardAppearance = appearance
        }
    }
    
    private func setupView() {
        if let _ = authService.getAuthToken() {
            if let item = extensionContext?.inputItems.first as? NSExtensionItem {
                accessWebpageProperties(extensionItem: item)
            }
        } else {
            toastService.showNotAuthorizedToast(controller: self, extensionContext: self.extensionContext!)
        }
        selectProductInfoButton.isEnabled = selectedCell == nil ? false : true
    }


    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
        if let viewController = segue.destination as? CreateWishViewController {
            let indexPath = collectionView.indexPath(for: selectedCell!)!
            viewController.productInfo = productInfos[indexPath.row]
        }
    }

    // MARK: UICollectionViewDataSource

    override func numberOfSections(in collectionView: UICollectionView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }


    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return productInfos.count
    }

    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: reuseIdentifier, for: indexPath) as? ProductInfoCell else {
            return UICollectionViewCell()
        }
    
        let productInfo = productInfos[indexPath.row]
        cell.image.setImageFromURl(ImageUrl: productInfo.imageUrl)
        cell.name.text = productInfo.name
    
        return cell
    }
    
    override func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath) as! ProductInfoCell
        let productInfo = productInfos[indexPath.row]
        
        cell.layer.borderWidth = 2.0
        if selectedCell == cell {
            cell.layer.borderColor = UIColor.white.cgColor
            selectedCell = nil
            selectProductInfoButton.isEnabled = false
        } else {
            cell.layer.borderColor = UIColor.red.cgColor
            selectedCell = cell
            selectProductInfoButton.isEnabled = true
            WishDataStore.shared.wish.addProductInfo(productInfo)
        }
    }
    
    override func collectionView(_ collectionView: UICollectionView, didDeselectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath)
        cell?.layer.borderWidth = 2.0
        cell?.layer.borderColor = UIColor.white.cgColor
    }

    private func accessWebpageProperties(extensionItem: NSExtensionItem) {
        let propertyList = String(kUTTypePropertyList)

        for attachment in extensionItem.attachments! where attachment.hasItemConformingToTypeIdentifier(propertyList) {
            attachment.loadItem(
                forTypeIdentifier: propertyList,
                options: nil,
                completionHandler: { (item, error) -> Void in

                    guard let dictionary = item as? NSDictionary,
                        let results = dictionary[NSExtensionJavaScriptPreprocessingResultsKey] as? NSDictionary,
                        let title = results["title"] as? String,
                        let hostname = results["hostname"] as? String,
                        let url = results["url"] as? String,
                        let productInfosDict = results["productInfos"] as? [NSDictionary]  else {
                            return
                    }

                    // Fallback to the favicon.ico file, if JavaScript returns nil
                    let favicon = results["favicon"] as? String ?? "\(hostname)/favicon.ico"
                    print("url: \(url), title: \(title), hostname: \(hostname), favicon: \(favicon), image count: \(productInfosDict.count)")
                    
                    self.productInfos = productInfosDict.compactMap { (dict: NSDictionary) in
                        guard let imageUrl = dict["imageUrl"] as? String else { return nil }
                        var displayName = title
                        if let name = dict["name"] as? String, !name.isEmpty {
                            displayName = name
                        }
                        return ProductInfo(productUrl: url, imageUrl: imageUrl, name: displayName)
                    }
                    self.collectionView.reloadData()
                }
            )
        }
    }

}
