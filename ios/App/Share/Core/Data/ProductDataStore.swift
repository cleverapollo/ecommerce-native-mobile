//
//  ProductDataStore.swift
//  App
//
//  Created by Alex on 19/11/2023.
//

import Foundation

protocol ProductDataStorable {
    
    var product: ProductRequest { get }
    
    func update(_ product: ProductRequest)
    func reset()
}

class ProductDataStore: ProductDataStorable {
    
    static let shared = ProductDataStore()
    
    var product: ProductRequest
    
    private init() {
        
        product = ProductRequest()
    }
    
    public func update(_ product: ProductRequest) {
        
        self.product = product
    }

    public func reset() {
        
        product = ProductRequest()
    }
}
