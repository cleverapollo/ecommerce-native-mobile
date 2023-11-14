//
//  WishList.swift
//  Share
//
//  Created by Alex on 14/11/2023.
//

import Foundation

struct WishList: Codable {
    
    let id: UUID
    let name: String
}

struct WishListCreateRequest: Codable {
    
    let name: String
    var showReservedWishes: Bool = false
}
