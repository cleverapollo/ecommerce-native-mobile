//
//  WishListService.swift
//  Share
//
//  Created by Tim Fischer on 17.12.20.
//

import Foundation

struct WishListService {

    static let shared = WishListService()
    private init() {}

    func getWishLists(completionHandler: @escaping (Result<[WishList], Error>) -> Void)  {
        guard let authToken = AuthService.shared.getAuthToken() else {
            completionHandler(.failure(NSError(domain: "app.wantic.io", code: 900, userInfo: nil)))
            return
        }
        
        let url = URL(string: "https://wantic-rest-api-fddlidpl2q-ew.a.run.app/wish-list")!
        let request = createRequest(url, authToken: authToken)
        let task = URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) in
            if let error = error {
                print(error.localizedDescription)
                completionHandler(.failure(error))
            } else if let data = data {
                do {
                    let wishLists = try JSONDecoder().decode([WishList].self, from: data)
                    completionHandler(.success(wishLists))
                } catch let error {
                    print(error.localizedDescription)
                    completionHandler(.failure(error))
                }
            }
            
        })
        task.resume()
    }
    
    private func createRequest(_ url: URL, authToken: String) -> URLRequest {
        var request = URLRequest(url: url)
        request.setValue("*", forHTTPHeaderField: "Access-Control-Allow-Origin")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        return request
    }
    
}
