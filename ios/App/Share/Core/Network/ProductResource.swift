//
//  ProductResource.swift
//  App
//
//  Created by Alex on 18/11/2023.
//

import Foundation

// MARK: - API

protocol ProductApi: NetworkResource {
    
    static func createProduct(_ product: Product, completionHandler: @escaping (Result<NetworkResponse<Product>, NetworkError>) -> Void)
}

struct ProductResource: ProductApi {
    
    static var baseUrl: URL = URL(string: "\(AppConfig.backendUrl)/v1/products")!
    
    static func createProduct(_ product: Product, completionHandler: @escaping (Result<NetworkResponse<Product>, NetworkError>) -> Void) {
        let httpBody = try! JSONEncoder().encode(product)
        Network.post(baseUrl, bodyData: httpBody, completionHandler: completionHandler)
    }
}

