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
    
    init(_ webPageInfo: WebPageInfo, webPageImage: WebPageImage?) {
        
        if let webPageImageName = webPageImage?.name, !webPageImageName.isEmpty {
            name = webPageImageName
        } else {
            name = webPageInfo.title
        }
        name?.truncateIfNeeded()
        productUrl = webPageInfo.url
        price = webPageInfo.price
        coupon = webPageInfo.coupon
        imageUrl = webPageImage?.url
    }
    
    var isValid: Bool {
        productListId != nil && name != nil && productUrl != nil
    }
}
