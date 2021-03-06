//
//  Wish.swift
//  Share
//
//  Created by Tim Fischer on 15.01.21.
//

import Foundation

struct Wish: Codable {
    var id: Int?
    var wishListId: Int?
    var name: String?
    var price: String?
    var productUrl: String?
    var imageUrl: String?
    
    mutating func addProductInfo(_ productInfo: ProductInfo) {
        name = productInfo.name
        productUrl = productInfo.productUrl
        imageUrl = productInfo.imageUrl
        price = productInfo.price
    }
    
    func isValid() -> Bool {
        guard let _ = self.wishListId,
              let _ = self.name,
              let _ = self.price,
              let _ = self.productUrl,
              let _ = self.imageUrl else {
            return false
        }
        return true
    }
}
