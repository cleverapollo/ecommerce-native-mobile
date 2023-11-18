//
//  ProductList.swift
//  Share
//
//  Created by Alex on 14/11/2023.
//
import Foundation

struct ProductListCreateRequest: Codable {
    
    var name: String
    
    init(name: String) {
        self.name = name
    }
    
}
