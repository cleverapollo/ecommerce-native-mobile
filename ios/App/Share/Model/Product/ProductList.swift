//
//  ProductList.swift
//  App
//
//  Created by Alex on 14/11/2023.
//

import Foundation

struct ProductList: Codable {
    
    var name: String
    var id: UUID
    
    init(id: UUID, name: String) {
        self.name = name
        self.id = id
    }
    
}
