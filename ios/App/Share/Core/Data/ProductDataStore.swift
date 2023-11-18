//
//  ProductDataStore.swift
//  App
//
//  Created by Alex on 19/11/2023.
//

import Foundation

protocol ProductDataStorable {
    
    var product: Product { get }
    
    func update(_ product: Product)
    func reset()
}

class ProductDataStore: ProductDataStorable {
    
    static let shared = ProductDataStore()
    
    var product: Product
    
    private init() {
        
        product = Product()
    }
    
    public func update(_ product: Product) {
        
        self.product = product
    }

    public func reset() {
        
        product = Product()
    }
}
