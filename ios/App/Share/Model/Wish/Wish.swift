//
//  Wish.swift
//  Share
//
//  Created by Alex on 14/11/2023.
//

import Foundation

struct Wish: Codable {
    
    var id: UUID?
    var wishListId: UUID?
    var name: String?
    var note: String?
    var price: Price
    var coupon: Coupon?
    var productUrl: String?
    var imageUrl: String?
    var isFavorite: Bool = false
    var isCreator: Bool? = false
    
    var isValid: Bool {
        wishListId != nil && name != nil && productUrl != nil
    }
    
    init() {
        self.price = Price(amount: 0.00)
    }
    
    init(_ webPageInfo: WebPageInfo, webPageImage: WebPageImage?, isCreator: Bool? = false) {
        
        if let webPageImageName = webPageImage?.name, !webPageImageName.isEmpty {
            name = webPageImageName
        } else {
            name = webPageInfo.title
        }
        name?.truncateIfNeeded()

        productUrl = webPageInfo.url
        imageUrl = webPageImage?.url
        price = webPageInfo.price
        coupon = webPageInfo.coupon
        self.isCreator = isCreator
    }
}
