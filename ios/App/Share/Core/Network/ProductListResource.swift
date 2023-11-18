//
//  ProductListResource.swift
//  App
//
//  Created by Alex on 18/11/2023.
//

import Foundation
import UIKit

protocol ProductListApi: NetworkResource {
    
    static func queryProductLists(completionHandler: @escaping (Result<NetworkResponse<[ProductList]>, NetworkError>) -> Void)
    static func createProductList(_ ProductList: ProductListCreateRequest, completionHandler: @escaping (Result<NetworkResponse<ProductList>, NetworkError>) -> Void)
}

struct ProductListResource: ProductListApi {
    static var baseUrl = URL(string: "\(AppConfig.backendUrl)/v1/product-lists")!

    static func queryProductLists(completionHandler: @escaping (Result<NetworkResponse<[ProductList]>, NetworkError>) -> Void)  {
        
        Network<[ProductList]>.get(baseUrl) { result in
            switch result {
            case .success(let response):
                let sorted = response.data.sorted(by: { (ProductListA, ProductListB) in
                    ProductListA.name.compare(ProductListB.name) == .orderedAscending
                })
                completionHandler(.success(NetworkResponse(data: sorted)))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }
    
    static func createProductList(_ ProductList: ProductListCreateRequest, completionHandler: @escaping (Result<NetworkResponse<ProductList>, NetworkError>) -> Void) {
        
        let data = try! JSONEncoder().encode(ProductList)
        Network<ProductList>.post(baseUrl, bodyData: data, completionHandler: completionHandler)
    }
    
}
