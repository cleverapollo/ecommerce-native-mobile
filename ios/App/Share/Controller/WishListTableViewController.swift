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
    // ToDo @IBOutlet weak var newWishListNameTextField: UITextField!
    @IBOutlet weak var footerView: UIView!
    
    
    @IBAction func onButtonTap() {
        let wish = WishDataStore.shared.wish
        WishService.shared.saveWish(wish, completionHandler: { result in
            switch result {
            case .success(_):
                ToastService.shared.showToast(controller: self, message: "Dein Wunsch wurde erfolgreich deiner Liste hinzugefügt.", wishListId: wish.wishListId!, extensionContext: self.extensionContext!)
            case .failure(_):
                ToastService.shared.showToast(controller: self, message: "Beim Speichern deines Wunsches ist ein Fehler aufgetreten", wishListId: wish.wishListId!, extensionContext: self.extensionContext!)
            }
        })
    }
    
    var wishLists: [WishList] = []
    var wishListId: Int? {
        didSet {
            WishDataStore.shared.wish.wishListId = wishListId
            saveButton.isEnabled = WishDataStore.shared.wish.isValid()
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
            self.selectedWishImageView.setImageFromURl(ImageUrl: imageUrl)
        }
        saveButton.isEnabled = WishDataStore.shared.wish.isValid()
        wishListId = WishDataStore.shared.wish.wishListId
        tableView.tableFooterView = UIView()
    }
    
    private func loadWishLists() {
        guard let _ = AuthService.shared.getAuthToken() else {
            ToastService.shared.showNotAuthorizedToast(controller: self, extensionContext: self.extensionContext!)
            return
        }
        
        WishListService.shared.getWishLists(completionHandler: { result in
            switch result {
            case .success(let wishLists):
                self.wishLists = wishLists
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            case .failure(_):
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
            let wishList = wishLists[indexPath.row]
            cell.nameLabel.text = wishList.name
            cell.checkMarkImageView.isHidden = wishListId != wishList.id
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
        extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
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
