//
//  WishListTableViewController.swift
//  Share
//
//  Created by Tim Fischer on 15.01.21.
//

import UIKit

class WishListTableViewCell: UITableViewCell {

    static let identifier = "WishListTableViewCell"
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var checkMarkImageView: UIImageView!
    
}

class WishListTableViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UITextFieldDelegate {
    
    @IBOutlet weak var tableView: SelfSizedTableView!
    @IBOutlet weak var saveButton: UIButton!
    @IBOutlet weak var selectedWishImageView: UIImageView!
    
    
    @IBAction func onButtonTap() {
        let wish = WishDataStore.shared.wish
        WishService.shared.saveWish(wish, completionHandler: { result in
            switch result {
            case .success(_):
                self.alertService.showToast(controller: self, message: "Dein Wunsch wurde erfolgreich deiner Liste hinzugefügt.", wishListId: wish.wishListId!, extensionContext: self.extensionContext!)
            case .failure(let error):
                if (error as NSError).code == HttpStatusCode.UNAUTHORIZED {
                    self.alertService.showNotAuthorizedToast(controller: self, extensionContext: self.extensionContext!)
                } else {
                    self.alertService.showToast(controller: self, message: "Beim Speichern deines Wunsches ist ein Fehler aufgetreten", wishListId: wish.wishListId!, extensionContext: self.extensionContext!)
                }
            }
        })
    }
    
    let alertService = AlertService.shared
    var wishLists: [WishList] = []
    var wishListId: UUID? {
        didSet {
            WishDataStore.shared.wish.wishListId = wishListId
            DispatchQueue.main.async {
                self.saveButton.isEnabled = WishDataStore.shared.wish.isValid()
            }
        }
    }
    var selectedIndexPath: IndexPath?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupViews()
        loadWishLists()
    }
    
    private func setupViews() {
        if let imageUrl = WishDataStore.shared.wish.imageUrl {
            self.selectedWishImageView.setImageFromURl(imageUrlString: imageUrl)
        }
        saveButton.isEnabled = WishDataStore.shared.wish.isValid()
        wishListId = WishDataStore.shared.wish.wishListId
        tableView.tableFooterView = UIView()
        tableView.separatorColor = UIColor(hex: "#F1EEE4")
    }
    
    private func loadWishLists() {
        self.showActivityIndicator("Deine Wunschlisten werden geladen ...")
        WishListService.shared.getWishLists(completionHandler: { result in
            self.removeActivityIndicator()
            switch result {
            case .success(let wishLists):
                guard !wishLists.isEmpty else {
                    self.alertService.showNoWishListsAvailableToast(controller: self, extensionContext: self.extensionContext!)
                    return
                }
                self.wishLists = wishLists
                self.wishListId = self.wishLists.first?.id
                self.selectedIndexPath = IndexPath(row: 0, section: 0)
                WishDataStore.shared.wish.wishListId = self.wishListId
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            case .failure(let error):
                if (error as NSError).code == HttpStatusCode.UNAUTHORIZED {
                    self.alertService.showNotAuthorizedToast(controller: self, extensionContext: self.extensionContext!)
                }
                self.wishLists = []
            }
        })
    }

    // MARK: - Table view data source

    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return wishLists.count
    }

    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: WishListTableViewCell.identifier, for: indexPath) as? WishListTableViewCell else {
            return UITableViewCell()
        }
        
        if !wishLists.isEmpty {
            
            if indexPath.section == 0 {
                let cornerRadius: CGFloat = 25
                if indexPath.row == 0 {
                    cell.layer.cornerRadius = cornerRadius
                    cell.clipsToBounds = true
                    var maskedCorners: CACornerMask = [.layerMinXMinYCorner,.layerMaxXMinYCorner]
                    if  wishLists.count == 1 {
                        maskedCorners.insert(.layerMinXMaxYCorner)
                        maskedCorners.insert(.layerMaxXMaxYCorner)
                        cell.layer.cornerRadius = 20
                    }
                    cell.layer.maskedCorners = maskedCorners
                } else if indexPath.row == wishLists.count - 1 {
                    cell.layer.cornerRadius = cornerRadius
                    cell.clipsToBounds = true
                    cell.layer.maskedCorners = [.layerMinXMaxYCorner,.layerMaxXMaxYCorner]
                } else {
                    cell.layer.cornerRadius = 0
                    cell.clipsToBounds = false
                }
            }
            
            let wishList = wishLists[indexPath.row]
            cell.nameLabel.text = wishList.name
            if wishList.id == wishListId {
                cell.checkMarkImageView.image = UIImage(named: "checkMark")
            } else {
                cell.checkMarkImageView.image = UIImage(named: "unchecked")
            }
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let wishList = wishLists[indexPath.row]
        
        var indexPathsToReload = [indexPath]
        if selectedIndexPath != nil {
            indexPathsToReload.append(selectedIndexPath!)
        }
        
        selectedIndexPath = wishList.id == wishListId ? nil : indexPath
        wishListId = wishList.id == wishListId ? nil : wishList.id
        tableView.reloadRows(at: indexPathsToReload, with: .automatic)
    }
    
    @IBAction func onCloseButtonTaped(_ sender: UIBarButtonItem) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: {_ in
            WishDataStore.shared.reset()
        })
    }
    
    // MARK: UITextFieldDelegate
    
    /*func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        guard let text = textField.text, !text.isEmpty else {
            return true
        }
        createNewWishList(text)
        return false
    }
    
    private func createNewWishList(_ wishListName: String) {
        WishListService.shared.createNewWishList(wishListName, completionHandler: { result in
            switch result {
            case .success(let wishList):
                self.wishLists.insert(wishList, at: 0)
                DispatchQueue.main.async {
                    self.tableView.beginUpdates()
                    self.tableView.insertRows(at: [IndexPath(row: 0, section: 1)], with: .automatic)
                    self.tableView.endUpdates()
                }
            case .failure(let error):
                print(error)
            }
        })
    }*/


}
