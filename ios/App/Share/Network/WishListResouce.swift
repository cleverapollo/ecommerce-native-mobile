import Foundation
import UIKit

// MARK: - Models

struct WishList: Codable {
    
    let id: UUID
    let name: String
}

struct WishListCreateRequest: Codable {
    
    let name: String
    var showReservedWishes: Bool = false
}

// MARK: - API

protocol WishListApi: NetworkResource {
    
    static func queryWishLists(completionHandler: @escaping (Result<NetworkResponse<[WishList]>, NetworkError>) -> Void)
    static func createWishList(_ wishList: WishListCreateRequest, completionHandler: @escaping (Result<NetworkResponse<WishList>, NetworkError>) -> Void)
}

struct WishListResource: WishListApi {
    
    static var baseUrl = URL(string: "\(AppConfig.backendUrl)/v1/wish-lists")!

    static func queryWishLists(completionHandler: @escaping (Result<NetworkResponse<[WishList]>, NetworkError>) -> Void)  {
        
        Network<[WishList]>.get(baseUrl) { result in
            switch result {
            case .success(let response):
                let sorted = response.data.sorted(by: { (wishListA, wishListB) in
                    wishListA.name.compare(wishListB.name) == .orderedAscending
                })
                completionHandler(.success(NetworkResponse(data: sorted)))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }
    
    static func createWishList(_ wishList: WishListCreateRequest, completionHandler: @escaping (Result<NetworkResponse<WishList>, NetworkError>) -> Void) {
        
        let data = try! JSONEncoder().encode(wishList)
        Network<WishList>.post(baseUrl, bodyData: data, completionHandler: completionHandler)
    }
    
}
