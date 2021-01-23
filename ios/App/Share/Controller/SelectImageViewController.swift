//
//  SelectImageViewController.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit
import MobileCoreServices

private let reuseIdentifier = "ProductInfoCell"
private let reuseIdentifierHeaderCell = "HeaderCell"
private let reuseIdentifierFooterCell = "FooterCell"

class ProductInfoCell: UICollectionViewCell {
    
    @IBOutlet weak var image: UIImageView!
    
}

class HeaderCell: UICollectionReusableView {
    @IBOutlet weak var label: UILabel!
}

class FooterCell: UICollectionReusableView {
    @IBOutlet weak var nextButton: UIButton!
}

class SelectImageViewController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    
    @IBOutlet weak var closeShareSheetButton: UIBarButtonItem!
    
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
    
        return cell
    }
    
    override func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath) as! ProductInfoCell
        let productInfo = productInfos[indexPath.row]
        
        if selectedCell == cell {
            cell.layer.borderWidth = 0.0
            selectedCell = nil
        } else {
            cell.layer.borderWidth = 2.0
            cell.layer.borderColor = UIColor(hex: "#3E3E3E")?.cgColor
            selectedCell = cell
            WishDataStore.shared.wish.addProductInfo(productInfo)
        }
        
        collectionView.reloadData()
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
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        return UIEdgeInsets(top: 10, left: 10, bottom: 10, right: 10)
    }
    
    override func collectionView(_ collectionView: UICollectionView, viewForSupplementaryElementOfKind kind: String, at indexPath: IndexPath) -> UICollectionReusableView {
        if kind == UICollectionView.elementKindSectionFooter, let footerView = collectionView.dequeueReusableSupplementaryView(ofKind: kind, withReuseIdentifier: reuseIdentifierFooterCell, for: indexPath) as? FooterCell {
            footerView.nextButton.isEnabled = selectedCell == nil ? false : true
            
            if let layout = collectionView.collectionViewLayout as? UICollectionViewFlowLayout {
                layout.sectionFootersPinToVisibleBounds = true
            }
            
            return footerView
        } else if kind == UICollectionView.elementKindSectionHeader, let headerView = collectionView.dequeueReusableSupplementaryView(ofKind: kind, withReuseIdentifier: reuseIdentifierHeaderCell, for: indexPath) as? HeaderCell {
            return headerView
        } else {
            return UICollectionReusableView()
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForFooterInSection section: Int) -> CGSize {
        return CGSize(width: view.frame.size.width, height: 52)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForHeaderInSection section: Int) -> CGSize {
        return CGSize(width: view.frame.size.width, height: 35)
    }

}
