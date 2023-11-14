//
//  ProductList.swift
//  App
//
//  Created by Alex on 14/11/2023.
//

import Foundation

struct ProductList: Codable {
    
    var name: String
    var id: String
    
    init(id: String, name: String) {
        self.name = name
        self.id = id
    }
    
}
