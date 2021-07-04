//
//  ProductInfo.swift
//  Share
//
//  Created by Tim Fischer on 16.12.20.
//

import Foundation

struct ProductInfo: Equatable {

    let id: UInt
    let productUrl: String
    let imageUrl: String
    let name: String?
    let price: Price
    
    static func == (lhs: ProductInfo, rhs: ProductInfo) -> Bool {
        return lhs.id == rhs.id
    }
    
}
