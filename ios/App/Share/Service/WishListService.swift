//
//  WishListService.swift
//  Share
//
//  Created by Tim Fischer on 17.12.20.
//

import Foundation
import UIKit

struct WishListService {

    static let shared = WishListService()
    private init() {}

    func getWishLists(completionHandler: @escaping (Result<[WishList], Error>) -> Void)  {
        AuthService.shared.getAuthToken(completionHandler: { idToken in
            guard let authToken = idToken else {
                completionHandler(.failure(NSError(domain: "app.wantic.io", code: 900, userInfo: nil)))
                return
            }
            
            let url = URL(string: "\(AppConfig.backendUrl)/v1/wish-lists")!
            let request = ApiService.createGetRequest(authToken: authToken, url: url)
            let task = URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) in
                guard error == nil else {
                    print(error!.localizedDescription)
                    completionHandler(.failure(error!))
                    return
                }
                
                guard let response = response as? HTTPURLResponse else {
                    completionHandler(.failure(NSError(domain: "app.wantic.io", code: 920, userInfo: nil)))
                    return
                }
                
                guard let data = data, response.statusCode == HttpStatusCode.OK else {
                    let error = NSError(domain: "app.wantic.io", code: response.statusCode, userInfo: nil)
                    completionHandler(.failure(error))
                    return
                }
                do {
                    var wishLists = try JSONDecoder().decode([WishList].self, from: data)
                    wishLists = wishLists.sorted(by: { (wishListA, wishListB) in
                        wishListA.name.compare(wishListB.name) == .orderedAscending
                    })
                    completionHandler(.success(wishLists))
                } catch let error {
                    print(error.localizedDescription)
                    completionHandler(.failure(error))
                }
            })
            task.resume()
        })

    }
    
}
