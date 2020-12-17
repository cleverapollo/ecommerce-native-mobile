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
        
        let request = createRequest(authToken: authToken)
        let task = URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) in
            if let error = error {
                print(error.localizedDescription)
                completionHandler(.failure(error))
            } else if let response = response as? HTTPURLResponse {
                guard let data = data, response.statusCode == 200 else {
                    let error = NSError(domain: "app.wantic.io", code: 910, userInfo: [ "statusCode": response.statusCode ])
                    completionHandler(.failure(error))
                    return
                }
                do {
                    let wishLists = try JSONDecoder().decode([WishList].self, from: data)
                    completionHandler(.success(wishLists))
                } catch let error {
                    print(error.localizedDescription)
                    completionHandler(.failure(error))
                }
            } else {
                completionHandler(.failure(NSError(domain: "app.wantic.io", code: 920, userInfo: nil)))
            }
            
        })
        task.resume()
    }
    
    private func createRequest(authToken: String) -> URLRequest {
        let url = URL(string: "https://wantic-rest-api-fddlidpl2q-ew.a.run.app/wish-list")!
        var request = URLRequest(url: url)
        request.setValue("*", forHTTPHeaderField: "Access-Control-Allow-Origin")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        return request
    }
    
}
