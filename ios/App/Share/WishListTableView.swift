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

    var wishLists: [WishList] = [
        WishList(id: 1, name: "30. Geburtstag"),
        WishList(id: 2, name: "Weihnachten"),
        WishList(id: 3, name: "Ostern 2021"),
    ]
    var selectedCell: WishListCell? = nil
    
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
