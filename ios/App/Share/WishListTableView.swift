//
//  WishListTableView.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import UIKit

private let reuseIdentifier = "WishListCell"

class WishListCell: UITableViewCell {
    
    @IBOutlet weak var wishListName: UILabel!
    
}

class WishListTableView: UITableView, UITableViewDataSource, UITableViewDelegate {

    var wishLists: [WishList] = []
    var selectedCell: WishListCell? = nil
    
    init() {
        super.init(frame: .zero, style: .plain)
        self.loadWishLists()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        self.loadWishLists()
    }
    
    override init(frame: CGRect, style: UITableView.Style) {
        super.init(frame: frame, style: style)
        self.loadWishLists()
    }
    
    func loadWishLists() {
        WishListService.shared.getWishLists(completionHandler: { result in
            switch result {
            case .success(let wishLists):
                self.wishLists = wishLists
            case .failure(_):
                self.wishLists = []
            }
        })
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return wishLists.count
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: reuseIdentifier, for: indexPath) as! WishListCell
    
        let wishList = wishLists[indexPath.row]
        cell.wishListName.text = wishList.name
    
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let cell = tableView.dequeueReusableCell(withIdentifier: reuseIdentifier, for: indexPath) as! WishListCell
        if cell == selectedCell {
            selectedCell = nil
        } else {
            selectedCell = cell
        }
    }


}
