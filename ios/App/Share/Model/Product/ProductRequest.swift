//
//  Product.swift
//  App
//
//  Created by Alex on 14/11/2023.
//

import Foundation

struct Product: Codable {
    var name: String?
    var note: String?
    var productUrl: String?
    var affiliateUrl: String?
    var imageUrl: String?
    var productListId: UUID?
    var price: Price
    var coupon: Coupon?
    
    init(name: String, note: String, productUrl: String, imageUrl: String, affiliateUrl: String, productListId: UUID, price: Price, coupon: Coupon) {
        self.name = name
        self.note = note
        self.productUrl = productUrl
        self.imageUrl = imageUrl
        self.affiliateUrl = affiliateUrl
        self.productListId = productListId
        self.price = price
        self.coupon = coupon
    }
    
    init() {
        self.price = Price(amount: 0.00)
    }
    
    var isValid: Bool {
        productListId != nil && name != nil && productUrl != nil
    }
}
