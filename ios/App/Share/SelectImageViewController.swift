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
    
    var productInfos: [ProductInfo] = []
    var selectedCell: ProductInfoCell? = nil

    override func viewDidLoad() {
        super.viewDidLoad()

        // Uncomment the following line to preserve selection between presentations 13.01 18.00
        // self.clearsSelectionOnViewWillAppear = false

        // Register cell classes
        // self.collectionView!.register(UICollectionViewCell.self, forCellWithReuseIdentifier: reuseIdentifier)

        // Do any additional setup after loading the view.
        if let item = extensionContext?.inputItems.first as? NSExtensionItem {
            accessWebpageProperties(extensionItem: item)
        }
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
    }
    */

    // MARK: UICollectionViewDataSource

    override func numberOfSections(in collectionView: UICollectionView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }


    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return productInfos.count
    }

    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: reuseIdentifier, for: indexPath) as! ProductInfoCell
    
        let productInfo = productInfos[indexPath.row]
        cell.image.setImageFromURl(ImageUrl: productInfo.imageUrl)
        cell.name.text = productInfo.name
    
        return cell
    }
    
    override func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath) as! ProductInfoCell
        cell.layer.borderWidth = 2.0
        if selectedCell == cell {
            cell.layer.borderColor = UIColor.white.cgColor
            selectedCell = nil
        } else {
            cell.layer.borderColor = UIColor.red.cgColor
            selectedCell = cell
        }
    }
    
    override func collectionView(_ collectionView: UICollectionView, didDeselectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath)
        cell?.layer.borderWidth = 2.0
        cell?.layer.borderColor = UIColor.white.cgColor
    }

    // MARK: UICollectionViewDelegate

    /*
    // Uncomment this method to specify if the specified item should be highlighted during tracking
    override func collectionView(_ collectionView: UICollectionView, shouldHighlightItemAt indexPath: IndexPath) -> Bool {
        return true
    }
    */

    /*
    // Uncomment this method to specify if the specified item should be selected
    override func collectionView(_ collectionView: UICollectionView, shouldSelectItemAt indexPath: IndexPath) -> Bool {
        return true
    }
    */

    /*
    // Uncomment these methods to specify if an action menu should be displayed for the specified item, and react to actions performed on the item
    override func collectionView(_ collectionView: UICollectionView, shouldShowMenuForItemAt indexPath: IndexPath) -> Bool {
        return false
    }

    override func collectionView(_ collectionView: UICollectionView, canPerformAction action: Selector, forItemAt indexPath: IndexPath, withSender sender: Any?) -> Bool {
        return false
    }

    override func collectionView(_ collectionView: UICollectionView, performAction action: Selector, forItemAt indexPath: IndexPath, withSender sender: Any?) {
    
    }
    */
    
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
                        let productInfosDict = results["productInfos"] as? [NSDictionary]  else {
                            return
                    }

                    // Fallback to the favicon.ico file, if JavaScript returns nil
                    let favicon = results["favicon"] as? String ?? "\(hostname)/favicon.ico"
                    print("title: \(title), hostname: \(hostname), favicon: \(favicon), image count: \(productInfosDict.count)")
                    
                    self.productInfos = productInfosDict.compactMap { (dict: NSDictionary) in
                        guard let imageUrl = dict["imageUrl"] as? String else { return nil }
                        var displayName = title
                        if let name = dict["name"] as? String, !name.isEmpty {
                            displayName = name
                        }
                        return ProductInfo(imageUrl: imageUrl, name: displayName)
                    }
                    self.collectionView.reloadData()
                }
            )
        }
    }

}
