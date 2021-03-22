//
//  WishService.swift
//  Share
//
//  Created by Tim Fischer on 15.01.21.
//

import Foundation

class WishService {
    
    static let shared = WishService()
    
    private init() {}
    
    func saveWish(_ wish: Wish, completionHandler: @escaping (Result<Wish, Error>) -> Void) {
        guard let authToken = AuthService.shared.getAuthToken() else {
            completionHandler(.failure(NSError(domain: "app.wantic.io", code: 900, userInfo: nil)))
            return
        }
        
        var request = createRequest(authToken: authToken)
        request.httpBody = try! JSONEncoder().encode(wish)
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
                    let wish = try JSONDecoder().decode(Wish.self, from: data)
                    completionHandler(.success(wish))
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
        let url = URL(string: "https://rest-prd.wantic.io/v1/wishes")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("*", forHTTPHeaderField: "Access-Control-Allow-Origin")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("Bearer " + authToken, forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        return request
    }
    
}
