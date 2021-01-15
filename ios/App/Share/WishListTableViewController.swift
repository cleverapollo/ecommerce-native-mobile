//
//  WishListTableViewController.swift
//  Share
//
//  Created by Tim Fischer on 15.01.21.
//

import UIKit

class WishListTableViewCell: UITableViewCell {

    @IBOutlet weak var nameLabel: UILabel!

}

class WishListTableViewController: UITableViewController {
    
    @IBOutlet weak var saveButton: UIBarButtonItem!
    
    @IBAction func onButtonTap() {
        print("Button tapped!")
    }
    
    var wishLists: [WishList] = []
    var wishListId: Int? {
        didSet {
            WishDataStore.shared.wish.wishListId = wishListId
            saveButton.isEnabled = WishDataStore.shared.wish.isValid()
        }
    }
    
    let reuseIdentifier = "WishListTableViewCell"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        loadWishLists()
    }
    
    private func loadWishLists() {
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

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return wishLists.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: reuseIdentifier, for: indexPath) as! WishListTableViewCell
        
        let wishList = wishLists[indexPath.row]
        cell.nameLabel.text = wishList.name
        
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        //let cell = tableView.dequeueReusableCell(withIdentifier: reuseIdentifier, for: indexPath) as! WishListTableViewCell
        let wishList = wishLists[indexPath.row]
        wishListId = wishList.id
    }

}
